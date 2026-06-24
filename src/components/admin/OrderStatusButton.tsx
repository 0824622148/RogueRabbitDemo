'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  orderId: number
  currentStatus: string
}

export default function OrderStatusButton({ orderId, currentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const update = async (status: string) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) router.refresh()
      else console.error('[OrderStatusButton] Update failed:', res.status)
    } finally {
      setLoading(false)
    }
  }

  const btnBase: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '.14em',
    padding: '4px 10px',
    border: '1px solid',
    background: 'transparent',
    cursor: loading ? 'default' : 'pointer',
    opacity: loading ? 0.5 : 1,
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {currentStatus !== 'paid' && (
        <button
          onClick={() => update('paid')}
          disabled={loading}
          style={{ ...btnBase, borderColor: '#2A9D2A', color: '#2A9D2A' }}
        >
          MARK PAID
        </button>
      )}
      {currentStatus !== 'cancelled' && (
        <button
          onClick={() => update('cancelled')}
          disabled={loading}
          style={{ ...btnBase, borderColor: '#D90017', color: '#D90017' }}
        >
          CANCEL
        </button>
      )}
    </div>
  )
}
