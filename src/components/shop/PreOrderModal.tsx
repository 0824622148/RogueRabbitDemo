'use client'

import { useState, useEffect } from 'react'
import type { ColourwayDB, Size } from '@/types'
import { FULL_PRICE, DISCOUNTED_PRICE, DISCOUNT_AMOUNT, EARLY_ACCESS_CODE, DELIVERY_FROM } from '@/lib/preorder'
import { formatRand } from '@/lib/money'
import { SNEAKER_ORDERS_ON_HOLD, COMING_SOON_LABEL } from '@/lib/store-status'
import DeliveryAddressFields, { EMPTY_ADDRESS, cleanAddress, type DeliveryAddress } from '@/components/checkout/DeliveryAddressFields'
import DeliveryOptions, { useDeliveryRates } from '@/components/checkout/DeliveryOptions'

interface Props {
  initialColourway?: ColourwayDB
  initialSize?: string
  initialGender?: 'MALE' | 'FEMALE'
  colourways: ColourwayDB[]
  onClose: () => void
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

  // Delivery address + live options (free local delivery for Ennerdale)
  const [address, setAddress] = useState<DeliveryAddress>(EMPTY_ADDRESS)
  const {
    rates, selectedRate, setSelectedRate,
    loading: ratesLoading, error: ratesError, addressComplete,
  } = useDeliveryRates(address)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [reference, setReference] = useState('')

  // Pre-order terms acknowledgement (required before payment)
  const [agreed, setAgreed] = useState(false)

  const sizes: Size[] = cw.inventory
    .filter(i => i.gender === (gender === 'MALE' ? 'M' : 'F'))
    .map(i => ({ v: i.size_value, oos: !i.in_stock }))

  const price = codeApplied ? DISCOUNTED_PRICE : FULL_PRICE
  const shippingCost = selectedRate?.rate ?? 0
  const total = Math.round((price + shippingCost) * 100) / 100

  const canSubmit = Boolean(
    !SNEAKER_ORDERS_ON_HOLD &&
    name.trim() && email.trim() && phone.trim() && sz && addressComplete && selectedRate && agreed,
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
    try {
      const res = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          colourway: cw.name,
          colourwayId: cw.id,
          size: sz,
          gender,
          ...cleanAddress(address),
          serviceCode: selectedRate!.code,
          earlyAccessCode: earlyCode.trim() || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }
      const data = await res.json()
      const { payfast, reference: ref } = data as {
        payfast: { url: string; fields: Record<string, string> } | null
        reference: string
      }

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
                <div className="rr-mono" style={{ fontSize: 20, color: '#E6E6E6' }}>{formatRand(price)}</div>
                {codeApplied && (
                  <div className="rr-mono" style={{ fontSize: 12, color: '#A6A6A8', textDecoration: 'line-through' }}>
                    {formatRand(FULL_PRICE)}
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

            <DeliveryAddressFields value={address} onChange={setAddress} />

            <DeliveryOptions
              rates={rates}
              selectedRate={selectedRate}
              onSelect={setSelectedRate}
              loading={ratesLoading}
              error={ratesError}
              addressComplete={addressComplete}
            />

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
                  ✓ 30% EARLY ACCESS DISCOUNT APPLIED — {formatRand(DISCOUNT_AMOUNT)} OFF
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
                ['SUBTOTAL', formatRand(price)],
                ['DELIVERY', selectedRate ? (shippingCost === 0 ? 'FREE' : formatRand(shippingCost)) : '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.12em' }}>{k}</span>
                  <span className="rr-mono" style={{ fontSize: 12, color: '#E6E6E6' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0' }}>
                <span className="rr-mono" style={{ fontSize: 11, color: '#E6E6E6', letterSpacing: '.12em' }}>TOTAL</span>
                <span className="rr-mono" style={{ fontSize: 16, color: '#E6E6E6' }}>{formatRand(total)}</span>
              </div>
            </div>

            {/* Pre-order acknowledgement — required before payment */}
            <label
              htmlFor="rr-preorder-agree"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                border: `1px solid ${agreed ? '#D90017' : '#3A3A3C'}`,
                background: agreed ? 'rgba(217,0,23,.06)' : 'transparent',
                padding: '14px 16px', marginBottom: 20, cursor: 'pointer',
              }}
            >
              <input
                id="rr-preorder-agree"
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, width: 16, height: 16, accentColor: '#D90017', flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 12, color: '#E6E6E6', lineHeight: 1.6 }}>
                I understand this is a <strong>pre-order</strong>. Delivery is expected from{' '}
                <strong>{DELIVERY_FROM}</strong>, and the Rouge Rabbit team will be in touch to
                confirm before dispatch.{' '}
                <a href="/preorder-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#D90017', textDecoration: 'underline' }}>
                  Read the full pre-order policy
                </a>.
              </span>
            </label>

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
              <span>
                {SNEAKER_ORDERS_ON_HOLD
                  ? COMING_SOON_LABEL
                  : submitting ? 'PROCESSING...' : `SECURE MY PAIR · ${formatRand(total)}`}
              </span>
              {!submitting && <span>→</span>}
            </button>

            <p className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', marginTop: 14, lineHeight: 1.8, letterSpacing: '.1em' }}>
              YOU WILL BE REDIRECTED TO PAYFAST TO COMPLETE PAYMENT SECURELY.
              THIS IS A PRE-ORDER — DELIVERY FROM {DELIVERY_FROM.toUpperCase()}. THE TEAM WILL BE IN
              TOUCH TO CONFIRM BEFORE DISPATCH. FREE DELIVERY IN ENNERDALE; NATIONWIDE WITH THE COURIER GUY.
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
              YOUR PRE-ORDER HAS BEEN PLACED. REFERENCE: <span style={{ color: '#E6E6E6' }}>{reference}</span>.
              A CONFIRMATION EMAIL IS ON ITS WAY TO <span style={{ color: '#E6E6E6' }}>{email}</span>.
              DELIVERY FROM <span style={{ color: '#E6E6E6' }}>{DELIVERY_FROM.toUpperCase()}</span> — THE TEAM WILL
              BE IN TOUCH TO CONFIRM BEFORE DISPATCH.
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
