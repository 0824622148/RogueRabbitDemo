'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatRand } from '@/lib/money'
import { SHOP_ORDERS_ON_HOLD, COMING_SOON_LABEL } from '@/lib/store-status'
import DeliveryAddressFields, {
  EMPTY_ADDRESS, cleanAddress, checkoutInputStyle, type DeliveryAddress,
} from './DeliveryAddressFields'
import DeliveryOptions, { useDeliveryRates } from './DeliveryOptions'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CheckoutForm() {
  const { items, subtotal, hydrated, count } = useCart()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState<DeliveryAddress>(EMPTY_ADDRESS)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Back button from PayFast restores this page from the bfcache with the
  // button still "processing" — re-enable it.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) setSubmitting(false) }
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])

  // Only ids and quantities go to the server — it prices everything itself.
  const cartItems = useMemo(
    () => items.map((l) => ({ inventoryId: l.inventoryId, qty: l.qty })),
    [items],
  )

  const {
    rates, selectedRate, setSelectedRate,
    loading: ratesLoading, error: ratesError, addressComplete,
  } = useDeliveryRates(address, cartItems)

  const shippingCost = selectedRate?.rate ?? 0
  const total = Math.round((subtotal + shippingCost) * 100) / 100

  const canSubmit = Boolean(
    !SHOP_ORDERS_ON_HOLD &&
    items.length > 0 &&
    name.trim() && EMAIL_RE.test(email.trim()) && phone.trim() &&
    addressComplete && selectedRate,
  )

  const submit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          ...cleanAddress(address),
          serviceCode: selectedRate!.code,
          items: cartItems,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      const { payfast } = data as { payfast: { url: string; fields: Record<string, string> } }
      // Standard PayFast redirect — must be a form POST, not window.location.
      // The bag is kept until /checkout/success, so a cancelled payment
      // doesn't lose it.
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = payfast.url
      Object.entries(payfast.fields).forEach(([k, v]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = k
        input.value = v
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (!hydrated) {
    return <div style={{ minHeight: '60vh' }} />
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 16px', textAlign: 'center' }}>
        <p className="rr-overline" style={{ color: '#A6A6A8', marginBottom: 24 }}>YOUR BAG IS EMPTY</p>
        <Link href="/shop/apparel" className="rr-btn" style={{ textDecoration: 'none' }}>
          SHOP APPAREL →
        </Link>
      </div>
    )
  }

  const field = (label: string, value: string, set: (v: string) => void, type: string, placeholder: string, autoComplete: string) => (
    <div key={label}>
      <div className="rr-overline" style={{ marginBottom: 8, color: '#A6A6A8', fontSize: 9 }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={checkoutInputStyle}
      />
    </div>
  )

  return (
    <div className="rr-checkout-grid" style={{ borderBottom: '1px solid #3A3A3C' }}>
      {/* Details */}
      <div className="rr-checkout-main">
        <h1 className="rr-display" style={{ fontSize: 'clamp(40px, 6vw, 64px)', margin: '0 0 32px', lineHeight: 0.9 }}>
          CHECKOUT<span style={{ color: '#D90017' }}>.</span>
        </h1>

        <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>YOUR DETAILS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {field('FULL NAME', name, setName, 'text', 'Your name', 'name')}
          {field('EMAIL ADDRESS', email, setEmail, 'email', 'your@email.com', 'email')}
          {field('PHONE / WHATSAPP', phone, setPhone, 'tel', '+27 XX XXX XXXX', 'tel')}
        </div>

        <DeliveryAddressFields value={address} onChange={setAddress} />

        <DeliveryOptions
          rates={rates}
          selectedRate={selectedRate}
          onSelect={setSelectedRate}
          loading={ratesLoading}
          error={ratesError}
          addressComplete={addressComplete}
        />
      </div>

      {/* Summary */}
      <aside className="rr-checkout-side">
        <div className="rr-overline" style={{ marginBottom: 16, color: '#D90017' }}>
          [ ORDER SUMMARY · {count} ITEM{count === 1 ? '' : 'S'} ]
        </div>

        <div style={{ borderTop: '1px solid #3A3A3C' }}>
          {items.map((l) => (
            <div key={l.inventoryId} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #3A3A3C' }}>
              <div style={{ width: 64, height: 64, flexShrink: 0, background: l.mediaBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {l.image && <img src={l.image} alt="" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="rr-overline" style={{ color: '#E6E6E6', fontSize: 11, marginBottom: 4 }}>{l.name}</div>
                <div className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.1em' }}>
                  {l.colourway} · {l.size} · ×{l.qty}
                </div>
              </div>
              <div className="rr-mono" style={{ fontSize: 12, color: '#E6E6E6', whiteSpace: 'nowrap' }}>
                {formatRand(l.unitPrice * l.qty)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 16, marginBottom: 24 }}>
          {[
            ['SUBTOTAL', formatRand(subtotal)],
            ['DELIVERY', selectedRate ? (shippingCost === 0 ? 'FREE' : formatRand(shippingCost)) : '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.12em' }}>{k}</span>
              <span className="rr-mono" style={{ fontSize: 12, color: v === 'FREE' ? '#2A9D2A' : '#E6E6E6' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', borderTop: '1px solid #3A3A3C', marginTop: 8 }}>
            <span className="rr-mono" style={{ fontSize: 11, color: '#E6E6E6', letterSpacing: '.12em' }}>TOTAL</span>
            <span className="rr-mono" style={{ fontSize: 16, color: '#E6E6E6' }}>{formatRand(total)}</span>
          </div>
        </div>

        {submitError && (
          <div className="rr-mono" role="alert" style={{ fontSize: 11, color: '#D90017', marginBottom: 16, letterSpacing: '.12em', lineHeight: 1.6 }}>
            {submitError}
          </div>
        )}

        <button
          onClick={submit}
          disabled={!canSubmit || submitting}
          className="rr-btn"
          style={{
            width: '100%', justifyContent: 'space-between', padding: '18px 24px',
            opacity: !canSubmit || submitting ? 0.45 : 1,
            cursor: !canSubmit || submitting ? 'default' : 'pointer',
          }}
        >
          <span>
            {SHOP_ORDERS_ON_HOLD
              ? COMING_SOON_LABEL
              : submitting ? 'PROCESSING…' : `PAY WITH PAYFAST · ${formatRand(total)}`}
          </span>
          {!submitting && <span>→</span>}
        </button>

        <p className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', marginTop: 14, lineHeight: 1.8, letterSpacing: '.1em' }}>
          YOU WILL BE REDIRECTED TO PAYFAST TO COMPLETE PAYMENT SECURELY.
          FREE DELIVERY IN ENNERDALE — THE ROUGE RABBIT TEAM WILL WHATSAPP YOU TO ARRANGE A TIME.
          NATIONWIDE ORDERS SHIP WITH THE COURIER GUY.
        </p>
      </aside>
    </div>
  )
}
