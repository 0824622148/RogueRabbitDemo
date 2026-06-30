'use client'

import { useState, useEffect, useRef } from 'react'
import type { ColourwayDB, Size } from '@/types'

const EARLY_ACCESS_CODE = 'ROUGE30'
const FULL_PRICE = 20 // TEMP: test price — change back to 1800 before launch
const DISCOUNT_PCT = 0.30
const DISCOUNTED_PRICE = Math.round(FULL_PRICE * (1 - DISCOUNT_PCT))

const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
  'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
]

interface ShippingRate {
  code: string
  name: string
  rate: number
  deliveryEstimate: string | null
}

interface Props {
  initialColourway?: ColourwayDB
  initialSize?: string
  initialGender?: 'MALE' | 'FEMALE'
  colourways: ColourwayDB[]
  onClose: () => void
}

function genReference() {
  return 'RR-' + Date.now().toString(36).toUpperCase().slice(-6)
}

export default function PreOrderModal({ initialColourway, initialSize, initialGender, colourways, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [cw, setCw] = useState<ColourwayDB>(initialColourway ?? colourways[0])
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>(initialGender ?? 'MALE')
  const [sz, setSz] = useState(initialSize ?? '')
  const [earlyCode, setEarlyCode] = useState('')
  const [codeApplied, setCodeApplied] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Delivery address
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [suburb, setSuburb] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')

  // Live shipping rates
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)
  const [ratesLoading, setRatesLoading] = useState(false)
  const [ratesError, setRatesError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [reference, setReference] = useState('')

  const sizes: Size[] = cw.inventory
    .filter(i => i.gender === (gender === 'MALE' ? 'M' : 'F'))
    .map(i => ({ v: i.size_value, oos: !i.in_stock }))

  const price = codeApplied ? DISCOUNTED_PRICE : FULL_PRICE
  const shippingCost = selectedRate?.rate ?? 0
  const total = price + shippingCost

  const addressComplete = Boolean(
    addressLine1.trim() && suburb.trim() && city.trim() && province && postalCode.trim(),
  )
  const canSubmit = Boolean(
    name.trim() && email.trim() && phone.trim() && sz && addressComplete && selectedRate,
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Fetch live delivery rates once the address is complete (debounced).
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    // Any address change invalidates a previously selected rate.
    setSelectedRate(null)
    setRates([])
    setRatesError('')

    if (!addressComplete) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setRatesLoading(true)
      setRatesError('')
      try {
        const res = await fetch('/api/shipping/rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addressLine1, addressLine2, suburb, city, province, postalCode }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Could not fetch delivery rates')
        const fetched: ShippingRate[] = data.rates ?? []
        setRates(fetched)
        if (fetched.length === 1) setSelectedRate(fetched[0])
      } catch (e: unknown) {
        setRatesError(e instanceof Error ? e.message : 'Could not fetch delivery rates')
      } finally {
        setRatesLoading(false)
      }
    }, 600)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressLine1, addressLine2, suburb, city, province, postalCode])

  const applyCode = () => {
    if (earlyCode.trim().toUpperCase() === EARLY_ACCESS_CODE) {
      setCodeApplied(true)
      setCodeError(false)
    } else {
      setCodeError(true)
      setCodeApplied(false)
    }
  }

  const submit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setSubmitError('')
    const ref = genReference()
    try {
      const res = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: ref,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          colourway: cw.name,
          colourwayId: cw.id,
          size: sz,
          gender,
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          suburb: suburb.trim(),
          city: city.trim(),
          province,
          postalCode: postalCode.trim(),
          serviceCode: selectedRate!.code,
          serviceName: selectedRate!.name,
          shippingCost,
          earlyAccessCode: earlyCode.trim() || null,
          discountApplied: codeApplied,
          finalPrice: price,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }
      const data = await res.json()
      const { payfast } = data as { payfast: { url: string; fields: Record<string, string> } | null }

      if (payfast) {
        // Standard PayFast redirect — must be a form POST, not window.location
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
        return
      }

      // Fallback: PayFast not configured (local dev)
      setReference(ref)
      setStep('success')
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#0F0F10', border: '1px solid #3A3A3C',
    color: '#E6E6E6', fontFamily: 'var(--font-body)', fontSize: 14,
    padding: '12px 14px', outline: 'none', boxSizing: 'border-box' as const,
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1E1E20',
          border: '1px solid #3A3A3C',
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '22px 28px',
          borderBottom: '1px solid #3A3A3C',
          position: 'sticky', top: 0, background: '#1E1E20', zIndex: 1,
        }}>
          <div>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.2em' }}>
              {step === 'form' ? 'PRE-ORDER / EARLY ACCESS' : 'PRE-ORDER CONFIRMED'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#A6A6A8', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em' }}
          >
            ✕ CLOSE
          </button>
        </div>

        {step === 'form' && (
          <div style={{ padding: '28px 28px 32px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
              <div>
                <div className="rr-overline" style={{ marginBottom: 4 }}>ROUGE 01 · FOOTWEAR</div>
                <h2 className="rr-display" style={{ fontSize: 32, margin: 0, color: '#E6E6E6' }}>
                  {cw.name}.
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="rr-mono" style={{ fontSize: 20, color: '#E6E6E6' }}>R{price}</div>
                {codeApplied && (
                  <div className="rr-mono" style={{ fontSize: 12, color: '#A6A6A8', textDecoration: 'line-through' }}>
                    R{FULL_PRICE}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>COLOURWAY · {cw.name}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {colourways.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setCw(c); setSz('') }}
                    style={{
                      width: 44, height: 44, background: '#fff', padding: 3,
                      border: `1px solid ${cw.id === c.id ? '#D90017' : '#3A3A3C'}`,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>SIZE · UK</div>
              <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
                {(['MALE', 'FEMALE'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGender(g); setSz('') }}
                    style={{
                      flex: 1, padding: '8px 0',
                      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em',
                      border: '1px solid #3A3A3C',
                      borderRight: g === 'MALE' ? 'none' : '1px solid #3A3A3C',
                      background: gender === g ? '#D90017' : 'transparent',
                      color: gender === g ? '#fff' : '#A6A6A8',
                      cursor: 'pointer',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {sizes.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => !s.oos && setSz(s.v)}
                    disabled={s.oos}
                    className={`rr-size ${sz === s.v ? 'rr-size--active' : ''} ${s.oos ? 'rr-size--oos' : ''}`}
                    style={{ fontSize: 10 }}
                  >
                    {s.v}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #3A3A3C', marginBottom: 24 }} />

            {/* Delivery address */}
            <div style={{ marginBottom: 24 }}>
              <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>DELIVERY ADDRESS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={addressLine1} onChange={e => setAddressLine1(e.target.value)} placeholder="Street address" style={inputStyle} />
                <input value={addressLine2} onChange={e => setAddressLine2(e.target.value)} placeholder="Apartment, unit, etc. (optional)" style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input value={suburb} onChange={e => setSuburb(e.target.value)} placeholder="Suburb" style={inputStyle} />
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <select value={province} onChange={e => setProvince(e.target.value)} style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    <option value="">Province</option>
                    {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="Postal code" inputMode="numeric" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Delivery options (live rates) */}
            <div style={{ marginBottom: 24 }}>
              <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>DELIVERY OPTION · THE COURIER GUY</div>

              {!addressComplete && (
                <p className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.1em', margin: 0 }}>
                  ENTER YOUR ADDRESS TO SEE DELIVERY OPTIONS.
                </p>
              )}

              {addressComplete && ratesLoading && (
                <p className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.1em', margin: 0 }}>
                  FETCHING LIVE RATES…
                </p>
              )}

              {addressComplete && !ratesLoading && ratesError && (
                <p className="rr-mono" style={{ fontSize: 10, color: '#D90017', letterSpacing: '.1em', margin: 0 }}>
                  {ratesError.toUpperCase()}
                </p>
              )}

              {addressComplete && !ratesLoading && !ratesError && rates.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rates.map((r) => {
                    const active = selectedRate?.code === r.code
                    return (
                      <button
                        key={r.code}
                        onClick={() => setSelectedRate(r)}
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
                              EST. {r.deliveryEstimate}
                            </span>
                          )}
                        </div>
                        <span className="rr-mono" style={{ fontSize: 12, color: '#E6E6E6' }}>R{r.rate}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 28 }}>
              <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>EARLY ACCESS CODE (OPTIONAL)</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={earlyCode}
                  onChange={e => { setEarlyCode(e.target.value); setCodeError(false) }}
                  onKeyDown={e => e.key === 'Enter' && applyCode()}
                  placeholder="ENTER CODE"
                  style={{
                    flex: 1, background: '#0F0F10', border: `1px solid ${codeApplied ? '#2A9D2A' : codeError ? '#D90017' : '#3A3A3C'}`,
                    color: '#E6E6E6', fontFamily: 'var(--font-mono)', fontSize: 11,
                    letterSpacing: '.14em', padding: '12px 14px', outline: 'none',
                  }}
                />
                <button
                  onClick={applyCode}
                  style={{
                    padding: '0 20px', background: 'none',
                    border: '1px solid #3A3A3C', color: '#E6E6E6',
                    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em',
                    cursor: 'pointer',
                  }}
                >
                  APPLY
                </button>
              </div>
              {codeApplied && (
                <div className="rr-mono" style={{ fontSize: 10, color: '#2A9D2A', marginTop: 8, letterSpacing: '.12em' }}>
                  ✓ 30% EARLY ACCESS DISCOUNT APPLIED — R{FULL_PRICE - DISCOUNTED_PRICE} OFF
                </div>
              )}
              {codeError && (
                <div className="rr-mono" style={{ fontSize: 10, color: '#D90017', marginTop: 8, letterSpacing: '.12em' }}>
                  INVALID CODE
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #3A3A3C', marginBottom: 24 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'FULL NAME', value: name, setter: setName, type: 'text', placeholder: 'Your name' },
                { label: 'EMAIL ADDRESS', value: email, setter: setEmail, type: 'email', placeholder: 'your@email.com' },
                { label: 'PHONE / WHATSAPP', value: phone, setter: setPhone, type: 'tel', placeholder: '+27 XX XXX XXXX' },
              ].map(({ label, value, setter, type, placeholder }) => (
                <div key={label}>
                  <div className="rr-overline" style={{ marginBottom: 8, color: '#A6A6A8', fontSize: 9 }}>{label}</div>
                  <input
                    type={type}
                    value={value}
                    onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            {/* Order total */}
            <div style={{ borderTop: '1px solid #3A3A3C', paddingTop: 16, marginBottom: 24 }}>
              {[
                ['SUBTOTAL', `R${price}`],
                ['DELIVERY', selectedRate ? `R${shippingCost}` : '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.12em' }}>{k}</span>
                  <span className="rr-mono" style={{ fontSize: 12, color: '#E6E6E6' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0' }}>
                <span className="rr-mono" style={{ fontSize: 11, color: '#E6E6E6', letterSpacing: '.12em' }}>TOTAL</span>
                <span className="rr-mono" style={{ fontSize: 16, color: '#E6E6E6' }}>R{total}</span>
              </div>
            </div>

            {submitError && (
              <div className="rr-mono" style={{ fontSize: 11, color: '#D90017', marginBottom: 16, letterSpacing: '.12em' }}>
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
              <span>{submitting ? 'PROCESSING...' : `SECURE MY PAIR · R${total}`}</span>
              {!submitting && <span>→</span>}
            </button>

            <p className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', marginTop: 14, lineHeight: 1.8, letterSpacing: '.1em' }}>
              YOU WILL BE REDIRECTED TO PAYFAST TO COMPLETE PAYMENT SECURELY.
              DELIVERED TO YOUR DOOR BY THE COURIER GUY.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div style={{ padding: '32px 28px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              border: '1px solid #2A9D2A', padding: '8px 16px', marginBottom: 20,
            }}>
              <span style={{ color: '#2A9D2A', fontSize: 16 }}>✓</span>
              <span className="rr-mono" style={{ color: '#2A9D2A', fontSize: 11, letterSpacing: '.16em' }}>ORDER RECEIVED</span>
            </div>

            <p className="rr-mono" style={{ color: '#A6A6A8', fontSize: 11, lineHeight: 1.8, margin: '0 0 24px', letterSpacing: '.1em' }}>
              YOUR ORDER HAS BEEN PLACED. REFERENCE: <span style={{ color: '#E6E6E6' }}>{reference}</span>.
              A CONFIRMATION EMAIL IS ON ITS WAY TO <span style={{ color: '#E6E6E6' }}>{email}</span>.
            </p>

            <button onClick={onClose} className="rr-btn rr-btn--ghost" style={{ width: '100%', justifyContent: 'center' }}>
              DONE — CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
