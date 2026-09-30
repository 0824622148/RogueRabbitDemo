'use client'

import { useEffect, useRef, useState } from 'react'
import { formatRand } from '@/lib/money'
import { isAddressComplete, cleanAddress, type DeliveryAddress } from './DeliveryAddressFields'

export interface ShippingRate {
  code: string
  name: string
  rate: number
  deliveryEstimate: string | null
}

/**
 * Fetches delivery options once the address is complete (debounced). Any
 * change to the address — or to the bag, via `itemsKey` — clears the choice.
 *
 * `items` is sent for cart checkouts so the parcel and insured value match
 * the bag; the pre-order omits it and gets the ROUGE 01 shoe box.
 */
export function useDeliveryRates(address: DeliveryAddress, items?: { inventoryId: number; qty: number }[]) {
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addressComplete = isAddressComplete(address)
  const itemsKey = items ? JSON.stringify(items) : ''

  useEffect(() => {
    setSelectedRate(null)
    setRates([])
    setError('')

    if (!addressComplete) return

    let cancelled = false
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/shipping/rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...cleanAddress(address), ...(items ? { items } : {}) }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Could not fetch delivery rates')
        if (cancelled) return
        const fetched: ShippingRate[] = data.rates ?? []
        setRates(fetched)
        if (fetched.length === 1) setSelectedRate(fetched[0])
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not fetch delivery rates')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 600)

    return () => {
      cancelled = true
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.addressLine1, address.addressLine2, address.suburb, address.city, address.province, address.postalCode, itemsKey])

  return { rates, selectedRate, setSelectedRate, loading, error, addressComplete }
}

interface Props {
  rates: ShippingRate[]
  selectedRate: ShippingRate | null
  onSelect: (r: ShippingRate) => void
  loading: boolean
  error: string
  addressComplete: boolean
}

export default function DeliveryOptions({ rates, selectedRate, onSelect, loading, error, addressComplete }: Props) {
  const msg = (text: string, colour = '#A6A6A8') => (
    <p className="rr-mono" style={{ fontSize: 10, color: colour, letterSpacing: '.1em', margin: 0, lineHeight: 1.7 }}>
      {text}
    </p>
  )

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>DELIVERY OPTION</div>

      {!addressComplete && msg('ENTER YOUR ADDRESS TO SEE DELIVERY OPTIONS. FREE DELIVERY IN ENNERDALE.')}
      {addressComplete && loading && msg('FETCHING DELIVERY OPTIONS…')}
      {addressComplete && !loading && error && msg(error.toUpperCase(), '#D90017')}

      {addressComplete && !loading && !error && rates.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rates.map((r) => {
            const active = selectedRate?.code === r.code
            return (
              <button
                key={r.code}
                type="button"
                onClick={() => onSelect(r)}
                aria-pressed={active}
                style={{
                  textAlign: 'left', padding: '12px 16px',
                  border: `1px solid ${active ? '#D90017' : '#3A3A3C'}`,
                  background: active ? 'rgba(217,0,23,.08)' : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: `1px solid ${active ? '#D90017' : '#3A3A3C'}`,
                  background: active ? '#D90017' : 'transparent',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <span className="rr-mono" style={{ fontSize: 11, color: '#E6E6E6', letterSpacing: '.12em' }}>{r.name.toUpperCase()}</span>
                  {r.deliveryEstimate && (
                    <span className="rr-mono" style={{ display: 'block', fontSize: 9, color: '#A6A6A8', letterSpacing: '.1em', marginTop: 2 }}>
                      EST. {r.deliveryEstimate.toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="rr-mono" style={{ fontSize: 12, color: r.rate === 0 ? '#2A9D2A' : '#E6E6E6' }}>
                  {r.rate === 0 ? 'FREE' : formatRand(r.rate)}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
