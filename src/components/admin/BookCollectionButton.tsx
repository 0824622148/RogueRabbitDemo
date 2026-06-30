'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  orderId: number
}

export default function BookCollectionButton({ orderId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const book = async () => {
    if (loading) return
    if (!confirm('Book this collection with The Courier Guy? This creates a real shipment.')) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/ship`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        router.refresh()
      } else {
        setError(data.error || `Failed (${res.status})`)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <button
        onClick={book}
        disabled={loading}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.14em',
          padding: '4px 10px', border: '1px solid #3B82F6', color: '#3B82F6',
          background: 'transparent', cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.5 : 1, whiteSpace: 'nowrap',
        }}
      >
        {loading ? 'BOOKING…' : '📦 BOOK COLLECTION'}
      </button>
      {error && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#D90017', letterSpacing: '.1em' }}>
          {error}
        </span>
      )}
    </div>
  )
}
