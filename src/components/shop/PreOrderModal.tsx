'use client'

import { useState, useEffect } from 'react'
import type { ColourwayDB, Size } from '@/types'

const EARLY_ACCESS_CODE = 'ROUGE30'
const FULL_PRICE = 1800
const DISCOUNT_PCT = 0.30
const DISCOUNTED_PRICE = Math.round(FULL_PRICE * (1 - DISCOUNT_PCT))

const COLLECTION_POINTS = [
  { id: 'jhb', label: 'JOHANNESBURG · ROSEBANK' },
  { id: 'cpt', label: 'CAPE TOWN · V&A WATERFRONT' },
  { id: 'dbn', label: 'DURBAN · GATEWAY' },
]

const BANK = {
  name: 'Standard Bank of South Africa',
  accountName: 'Rouge Rabbit (Pty) Ltd',
  accountNumber: '0000010279568248',
  branchCode: '051001',
  universalCode: '051001',
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
  const [collection, setCollection] = useState('')
  const [earlyCode, setEarlyCode] = useState('')
  const [codeApplied, setCodeApplied] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [reference, setReference] = useState('')

  const sizes: Size[] = cw.inventory
    .filter(i => i.gender === (gender === 'MALE' ? 'M' : 'F'))
    .map(i => ({ v: i.size_value, oos: !i.in_stock }))

  const price = codeApplied ? DISCOUNTED_PRICE : FULL_PRICE
  const canSubmit = name.trim() && email.trim() && phone.trim() && sz && collection

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
          collection,
          earlyAccessCode: earlyCode.trim() || null,
          discountApplied: codeApplied,
          finalPrice: price,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }
      setReference(ref)
      setStep('success')
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
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

            <div style={{ marginBottom: 24 }}>
              <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>COLLECTION POINT</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {COLLECTION_POINTS.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setCollection(pt.label)}
                    style={{
                      textAlign: 'left', padding: '12px 16px',
                      border: `1px solid ${collection === pt.label ? '#D90017' : '#3A3A3C'}`,
                      background: collection === pt.label ? 'rgba(217,0,23,.08)' : 'transparent',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      border: `1px solid ${collection === pt.label ? '#D90017' : '#3A3A3C'}`,
                      background: collection === pt.label ? '#D90017' : 'transparent',
                      flexShrink: 0,
                    }} />
                    <span className="rr-mono" style={{ fontSize: 11, color: '#E6E6E6', letterSpacing: '.14em' }}>{pt.label}</span>
                  </button>
                ))}
              </div>
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
                    style={{
                      width: '100%', background: '#0F0F10', border: '1px solid #3A3A3C',
                      color: '#E6E6E6', fontFamily: 'var(--font-body)', fontSize: 14,
                      padding: '12px 14px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
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
              <span>{submitting ? 'PROCESSING...' : `SECURE MY PAIR · R${price}`}</span>
              {!submitting && <span>→</span>}
            </button>

            <p className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', marginTop: 14, lineHeight: 1.8, letterSpacing: '.1em' }}>
              NO PAYMENT IS CAPTURED NOW. EFT BANKING DETAILS WILL BE PROVIDED ON THE NEXT SCREEN.
              PAYMENT DUE WITHIN 24 HOURS TO SECURE YOUR PAIR.
              COLLECTION ONLY · DELIVERY COMING SOON.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div style={{ padding: '32px 28px' }}>

            <div style={{ marginBottom: 28 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                border: '1px solid #2A9D2A', padding: '8px 16px', marginBottom: 20,
              }}>
                <span style={{ color: '#2A9D2A', fontSize: 16 }}>✓</span>
                <span className="rr-mono" style={{ color: '#2A9D2A', fontSize: 11, letterSpacing: '.16em' }}>PRE-ORDER RECEIVED</span>
              </div>
              <p className="rr-mono" style={{ color: '#A6A6A8', fontSize: 11, lineHeight: 1.8, margin: 0, letterSpacing: '.1em' }}>
                YOUR SPOT HAS BEEN SECURED. COMPLETE THE EFT BELOW WITHIN 24 HOURS TO CONFIRM YOUR PAIR.
                YOUR EDITION NUMBER WILL BE ASSIGNED AND SENT TO <span style={{ color: '#E6E6E6' }}>{email}</span>.
              </p>
            </div>

            <div style={{ border: '1px solid #3A3A3C', padding: '20px', marginBottom: 20 }}>
              <div className="rr-overline" style={{ color: '#D90017', marginBottom: 16 }}>ORDER SUMMARY</div>
              {[
                ['PRODUCT', 'ROUGE 01 · ' + cw.name],
                ['SIZE', sz + ' · ' + gender],
                ['COLLECTION', collection],
                ['REFERENCE', reference],
                ['AMOUNT DUE', `R${price}${codeApplied ? ` (30% EARLY ACCESS APPLIED)` : ''}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #3A3A3C' }}>
                  <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 10, letterSpacing: '.14em' }}>{k}</span>
                  <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 11, letterSpacing: '.12em', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#0F0F10', border: '1px solid #3A3A3C', padding: '20px', marginBottom: 20 }}>
              <div className="rr-overline" style={{ color: '#D90017', marginBottom: 16 }}>EFT BANKING DETAILS</div>
              {[
                ['BANK', BANK.name],
                ['ACCOUNT NAME', BANK.accountName],
                ['ACCOUNT NUMBER', BANK.accountNumber],
                ['BRANCH CODE', BANK.branchCode],
                ['UNIVERSAL CODE', BANK.universalCode],
                ['REFERENCE', reference],
                ['AMOUNT', `R${price}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #3A3A3C' }}>
                  <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 10, letterSpacing: '.14em' }}>{k}</span>
                  <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 11, letterSpacing: '.12em', fontWeight: k === 'REFERENCE' || k === 'AMOUNT' ? 500 : 400 }}>{v}</span>
                </div>
              ))}
            </div>

            <p className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', lineHeight: 1.8, letterSpacing: '.1em', marginBottom: 24 }}>
              SCREENSHOT OR NOTE THE BANKING DETAILS ABOVE. USE YOUR REFERENCE NUMBER EXACTLY AS SHOWN.
              PAYMENTS NOT RECEIVED WITHIN 24 HOURS WILL RELEASE YOUR SPOT.
              QUESTIONS? WHATSAPP US BELOW.
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
