'use client'

import { useState } from 'react'

interface Props {
  recipientCount: number
}

type Status = { kind: 'idle' | 'sending' | 'ok' | 'error'; msg?: string }

export default function EmailComposer({ recipientCount }: Props) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const disabled = status.kind === 'sending'

  const post = async (payload: Record<string, unknown>) => {
    const res = await fetch('/api/admin/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `Failed (${res.status})`)
    return data as { sent: number }
  }

  const sendTest = async () => {
    if (disabled) return
    if (!subject.trim() || !message.trim()) return setStatus({ kind: 'error', msg: 'Add a subject and message first.' })
    if (!testEmail.trim()) return setStatus({ kind: 'error', msg: 'Enter an email to send the test to.' })
    setStatus({ kind: 'sending' })
    try {
      await post({ subject, message, test: true, testEmail })
      setStatus({ kind: 'ok', msg: `Test sent to ${testEmail}.` })
    } catch (e) {
      setStatus({ kind: 'error', msg: (e as Error).message })
    }
  }

  const sendAll = async () => {
    if (disabled) return
    if (!subject.trim() || !message.trim()) return setStatus({ kind: 'error', msg: 'Add a subject and message first.' })
    if (!confirm(`Send this email to all ${recipientCount} subscribed members? This cannot be undone.`)) return
    setStatus({ kind: 'sending' })
    try {
      const { sent } = await post({ subject, message })
      setStatus({ kind: 'ok', msg: `Sent to ${sent} member${sent === 1 ? '' : 's'}.` })
      setSubject('')
      setMessage('')
    } catch (e) {
      setStatus({ kind: 'error', msg: (e as Error).message })
    }
  }

  const label: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8',
    display: 'block', marginBottom: 8,
  }
  const input: React.CSSProperties = {
    width: '100%', background: '#1E1E20', border: '1px solid #3A3A3C', color: '#E6E6E6',
    fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '.06em',
    padding: '14px 16px', outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <label style={label}>SUBJECT</label>
        <input style={input} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="DROP 004 IS LIVE" disabled={disabled} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={label}>MESSAGE</label>
        <textarea
          style={{ ...input, minHeight: 220, resize: 'vertical', lineHeight: 1.7 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={'Hi there,\n\nWrite your announcement here. Line breaks are preserved.\n\n— Rouge Rabbit'}
          disabled={disabled}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.12em', color: '#3A3A3C', marginTop: 8 }}>
          PLAIN TEXT · BRAND HEADER + UNSUBSCRIBE FOOTER ADDED AUTOMATICALLY
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1E1E20', paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 240px' }}>
          <label style={label}>SEND A TEST TO YOURSELF</label>
          <input style={input} value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="you@rougerabbit.co.za" disabled={disabled} />
        </div>
        <button
          onClick={sendTest}
          disabled={disabled}
          style={{
            background: 'none', border: '1px solid #3A3A3C', color: '#A6A6A8',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em',
            padding: '14px 20px', cursor: disabled ? 'default' : 'pointer', whiteSpace: 'nowrap',
          }}
        >
          SEND TEST
        </button>
      </div>

      <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button
          onClick={sendAll}
          disabled={disabled || recipientCount === 0}
          style={{
            background: '#D90017', color: '#E6E6E6', border: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.22em',
            padding: '16px 28px', cursor: disabled || recipientCount === 0 ? 'default' : 'pointer',
            opacity: disabled || recipientCount === 0 ? 0.6 : 1,
          }}
        >
          {status.kind === 'sending' ? 'SENDING…' : `SEND TO ALL ${recipientCount} MEMBERS →`}
        </button>
        {status.msg && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em',
            color: status.kind === 'error' ? '#D90017' : '#2A9D2A',
          }}>
            {status.kind === 'error' ? '✕' : '✓'} {status.msg}
          </span>
        )}
      </div>
    </div>
  )
}
