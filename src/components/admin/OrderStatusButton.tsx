'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ADMIN_TRANSITIONS } from '@/lib/admin/format'

interface Props {
  orderId: number
  currentStatus: string
  /** Ennerdale orders are delivered by hand — they get "out for delivery". */
  local: boolean
  /** Courier orders move paid → shipped via BOOK COLLECTION, not this button. */
  hasShipment: boolean
}

/**
 * Forward-only fulfilment actions. There is deliberately no "mark paid":
 * only a verified PayFast payment notification can set that.
 */
export default function OrderStatusButton({ orderId, currentStatus, local, hasShipment }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const allowed = ADMIN_TRANSITIONS[currentStatus] ?? []

  const update = async (status: string, confirmText?: string) => {
    if (loading) return
    if (confirmText && !confirm(confirmText)) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, from: currentStatus }),
      })
      if (res.ok) router.refresh()
      else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Failed (${res.status})`)
      }
    } catch {
      setError('Network error')
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
    whiteSpace: 'nowrap',
  }

  const showOutForDelivery = allowed.includes('shipped') && local
  // Courier orders normally reach 'delivered' via the ShipLogic webhook; this
  // is the manual fallback. Local orders always use it.
  const showDelivered = allowed.includes('delivered') && (local || hasShipment)

  if (!allowed.length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {showOutForDelivery && (
          <button
            onClick={() => update('shipped')}
            disabled={loading}
            style={{ ...btnBase, borderColor: '#3B82F6', color: '#3B82F6' }}
          >
            🛵 OUT FOR DELIVERY
          </button>
        )}
        {showDelivered && (
          <button
            onClick={() => update('delivered', local ? 'Mark this order as delivered? The customer will be emailed.' : 'Mark this courier order as delivered?')}
            disabled={loading}
            style={{ ...btnBase, borderColor: '#2A9D2A', color: '#2A9D2A' }}
          >
            ✓ DELIVERED
          </button>
        )}
        {allowed.includes('cancelled') && (
          <button
            onClick={() => update('cancelled', 'Cancel this PAID order? Refund the customer in the PayFast dashboard first — this only records it here.')}
            disabled={loading}
            style={{ ...btnBase, borderColor: '#D90017', color: '#D90017' }}
          >
            CANCEL / REFUND
          </button>
        )}
      </div>
      {error && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#D90017', letterSpacing: '.1em' }}>
          {error}
        </span>
      )}
    </div>
  )
}
