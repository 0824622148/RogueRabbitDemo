'use client'

import { useEffect, useState } from 'react'
import { useSubscribe } from '@/lib/useSubscribe'

interface SubscribeFormProps {
  /** Where the signup came from — stored on the member row. */
  source: string
  buttonLabel?: string
  /** Optional success copy shown in place of the form. */
  successLabel?: string
  /** Called after a successful subscribe (e.g. to close a modal). */
  onSuccess?: () => void
  autoFocus?: boolean
}

const ACCENT = '#D90017'
const BORDER = '#3A3A3C'
const FIELD_COLOR = '#E6E6E6'

const inputStyle = (invalid: boolean): React.CSSProperties => ({
  width: '100%',
  boxSizing: 'border-box',
  background: 'transparent',
  border: `1px solid ${invalid ? ACCENT : BORDER}`,
  padding: '16px 18px',
  color: FIELD_COLOR,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  outline: 'none',
})

export default function SubscribeForm({
  source,
  buttonLabel = 'JOIN',
  successLabel = "YOU'RE ON THE LIST. FIRST ACCESS INCOMING.",
  onSuccess,
  autoFocus = false,
}: SubscribeFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const { status, error, isNew, subscribe } = useSubscribe(source)

  const loading = status === 'loading'
  const isError = status === 'error'

  // Notify parent (e.g. modal) once, after a successful subscribe.
  useEffect(() => {
    if (status === 'success') onSuccess?.()
  }, [status, onSuccess])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    await subscribe({ name, email, phone })
  }

  // Keep the confirmation visible in place of the form.
  if (status === 'success') {
    const label = isNew ? successLabel : "YOU'RE ALREADY ON THE LIST."
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: ACCENT, fontSize: 18 }}>✓</span>
        <span className="rr-mono" style={{ fontSize: 11, letterSpacing: '.18em', color: FIELD_COLOR }}>
          {label}
        </span>
      </div>
    )
  }

  // Highlight the offending field based on the current error message.
  const nameInvalid = isError && /name/i.test(error)
  const emailInvalid = isError && /email/i.test(error)

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NAME"
          aria-label="Name"
          autoFocus={autoFocus}
          style={inputStyle(nameInvalid)}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="YOUR@EMAIL.COM"
          aria-label="Email address"
          style={inputStyle(emailInvalid)}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="PHONE (OPTIONAL)"
          aria-label="Phone number (optional)"
          style={inputStyle(false)}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: ACCENT,
            color: FIELD_COLOR,
            border: 'none',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '.22em',
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? '...' : `${buttonLabel} →`}
        </button>
      </div>
      {isError && (
        <p
          className="rr-mono"
          style={{ fontSize: 10, color: ACCENT, letterSpacing: '.14em', margin: '10px 0 0' }}
        >
          ✕ {error}
        </p>
      )}
    </form>
  )
}
