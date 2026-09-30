'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { STOCK_REASONS } from '@/lib/admin/format'

interface Props {
  inventoryId: number
  stock: number
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '.08em',
  color: '#E6E6E6',
  background: '#0F0F10',
  border: '1px solid #3A3A3C',
  height: 30,
}

/** Inline stock editor: − [n] + · reason · SAVE (only once the value changed). */
export default function StockEditor({ inventoryId, stock }: Props) {
  const router = useRouter()
  const [value, setValue] = useState(String(stock))
  const [reason, setReason] = useState<string>(STOCK_REASONS[0])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const parsed = Number(value)
  const validValue = value !== '' && Number.isInteger(parsed) && parsed >= 0 && parsed <= 999
  const dirty = validValue && parsed !== stock

  const step = (d: number) => {
    const n = Math.min(999, Math.max(0, (validValue ? parsed : stock) + d))
    setValue(String(n))
    setMessage('')
  }

  const save = async () => {
    if (!dirty || saving) return
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/admin/inventory/${inventoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expected: stock, stock: parsed, reason }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        router.refresh()
      } else if (res.status === 409) {
        setMessage(`Stock changed to ${data.current ?? '?'} (a sale came in) — check and save again`)
        router.refresh()
      } else if (res.status === 401) {
        setMessage('Session expired — log in again')
      } else {
        setMessage(data.error || `Failed (${res.status})`)
      }
    } catch {
      setMessage('Network error')
    } finally {
      setSaving(false)
    }
  }

  const btn: React.CSSProperties = { ...mono, width: 30, cursor: 'pointer', padding: 0 }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <button type="button" onClick={() => step(-1)} style={btn} aria-label="Decrease">−</button>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={999}
          value={value}
          onChange={(e) => { setValue(e.target.value); setMessage('') }}
          onKeyDown={(e) => { if (e.key === 'Enter') save() }}
          aria-label="Stock count"
          style={{ ...mono, width: 64, textAlign: 'center', padding: '0 6px' }}
        />
        <button type="button" onClick={() => step(1)} style={btn} aria-label="Increase">+</button>
        {dirty && (
          <>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              aria-label="Reason"
              style={{ ...mono, padding: '0 6px' }}
            >
              {STOCK_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              style={{
                ...mono, padding: '0 12px', cursor: saving ? 'default' : 'pointer',
                background: '#D90017', borderColor: '#D90017', letterSpacing: '.16em', fontSize: 10,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'SAVING…' : 'SAVE'}
            </button>
          </>
        )}
      </div>
      {message && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#F2A93B', marginTop: 6, letterSpacing: '.06em', whiteSpace: 'normal' }}>
          {message}
        </div>
      )}
    </div>
  )
}
