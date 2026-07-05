'use client'

import { useEffect, useState } from 'react'
import { useSubscribe } from '@/lib/useSubscribe'

type Variant = 'inline' | 'stacked'
type Tone = 'onDark' | 'onRed'

interface SubscribeFormProps {
  /** Where the signup came from — stored on the member row. */
  source: string
  variant?: Variant
  tone?: Tone
  placeholder?: string
  buttonLabel?: string
  /** Optional success copy shown in place of the form. */
  successLabel?: string
  /** Called after a successful subscribe (e.g. to close a modal). */
  onSuccess?: () => void
  autoFocus?: boolean
}

const TONES: Record<Tone, {
  inputBg: string; border: string; color: string; placeholder: string
  btnBg: string; btnColor: string; accent: string; success: string
}> = {
  onDark: {
    inputBg: 'transparent', border: '#3A3A3C', color: '#E6E6E6', placeholder: '#6b6b6d',
    btnBg: '#D90017', btnColor: '#E6E6E6', accent: '#D90017', success: '#E6E6E6',
  },
  onRed: {
    inputBg: 'transparent', border: 'rgba(255,255,255,.5)', color: '#E6E6E6', placeholder: 'rgba(255,255,255,.6)',
    btnBg: '#0F0F10', btnColor: '#E6E6E6', accent: '#0F0F10', success: '#E6E6E6',
  },
}

export default function SubscribeForm({
  source,
  variant = 'inline',
  tone = 'onDark',
  placeholder = 'YOUR.EMAIL@HERE',
  buttonLabel = 'JOIN',
  successLabel = "YOU'RE ON THE LIST. FIRST ACCESS INCOMING.",
  onSuccess,
  autoFocus = false,
}: SubscribeFormProps) {
  const [email, setEmail] = useState('')
  const { status, error, isNew, subscribe } = useSubscribe(source)
  const t = TONES[tone]

  const loading = status === 'loading'

  // Notify parent (e.g. modal) once, after a successful subscribe.
  useEffect(() => {
    if (status === 'success') onSuccess?.()
  }, [status, onSuccess])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    await subscribe(email)
  }

  // Keep the confirmation visible in place of the form.
  if (status === 'success') {
    const label = isNew ? successLabel : "YOU'RE ALREADY ON THE LIST."
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: t.accent, fontSize: 18 }}>✓</span>
        <span className="rr-mono" style={{ fontSize: 11, letterSpacing: '.18em', color: t.success }}>
          {label}
        </span>
      </div>
    )
  }

  const inputEl = (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      aria-label="Email address"
      style={{
        flex: variant === 'inline' ? 1 : undefined,
        width: variant === 'stacked' ? '100%' : undefined,
        boxSizing: 'border-box',
        background: t.inputBg,
        border: `1px solid ${status === 'error' ? t.accent : t.border}`,
        borderRight: variant === 'inline' ? 'none' : undefined,
        padding: '16px 18px',
        color: t.color,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        outline: 'none',
        minWidth: 0,
      }}
    />
  )

  const buttonEl = (
    <button
      type="submit"
      disabled={loading}
      style={{
        background: t.btnBg,
        color: t.btnColor,
        border: 'none',
        padding: variant === 'inline' ? '0 22px' : '16px',
        width: variant === 'stacked' ? '100%' : undefined,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '.22em',
        cursor: loading ? 'default' : 'pointer',
        flexShrink: 0,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? '...' : `${buttonLabel} →`}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: variant === 'stacked' ? 'column' : 'row',
          gap: variant === 'stacked' ? 12 : 0,
          maxWidth: variant === 'inline' ? 460 : undefined,
        }}
      >
        {inputEl}
        {buttonEl}
      </div>
      {status === 'error' && (
        <p
          className="rr-mono"
          style={{
            fontSize: 10,
            color: t.accent,
            letterSpacing: '.14em',
            margin: '10px 0 0',
          }}
        >
          ✕ {error}
        </p>
      )}
    </form>
  )
}
