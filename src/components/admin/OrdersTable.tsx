'use client'

import { useMemo, useState } from 'react'
import OrderStatusButton from './OrderStatusButton'
import BookCollectionButton from './BookCollectionButton'
import { fmt, rand, STATUS_COLOUR } from '@/lib/admin/format'
import { cell, th, tableWrap } from '@/lib/admin/ui'

type Order = Record<string, any>

interface Props {
  orders: Order[]
  /** Status filter tabs to show. Omit to hide tabs. */
  statusTabs?: string[]
  /** Which tab is selected initially. */
  initialStatus?: string
  showSearch?: boolean
  emptyLabel?: string
}

const COLUMNS = [
  'REFERENCE', 'COLOURWAY', 'SIZE · GENDER', 'DELIVERY ADDRESS', 'NAME', 'EMAIL',
  'STATUS', 'AMOUNT', 'DELIVERY', 'TRACKING', 'PAYMENT ID', 'DATE', 'ACTIONS',
]

export default function OrdersTable({
  orders,
  statusTabs,
  initialStatus = 'all',
  showSearch = true,
  emptyLabel = 'NO ORDERS',
}: Props) {
  const [status, setStatus] = useState(initialStatus)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (status !== 'all' && o.status !== status) return false
      if (!q) return true
      return [o.reference, o.name, o.email]
        .filter(Boolean)
        .some((v: string) => v.toLowerCase().includes(q))
    })
  }, [orders, status, query])

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em',
    padding: '6px 12px', cursor: 'pointer', textTransform: 'uppercase',
    background: active ? '#1E1E20' : 'transparent',
    border: '1px solid', borderColor: active ? '#D90017' : '#3A3A3C',
    color: active ? '#E6E6E6' : '#A6A6A8',
  })

  return (
    <div>
      {(statusTabs || showSearch) && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          {statusTabs && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button style={tabStyle(status === 'all')} onClick={() => setStatus('all')}>
                ALL ({orders.length})
              </button>
              {statusTabs.map((s) => {
                const count = orders.filter((o) => o.status === s).length
                return (
                  <button key={s} style={tabStyle(status === s)} onClick={() => setStatus(s)}>
                    {s.toUpperCase()} ({count})
                  </button>
                )
              })}
            </div>
          )}
          {showSearch && (
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH REF / NAME / EMAIL"
              style={{
                marginLeft: 'auto', minWidth: 220, flex: '0 1 280px',
                background: '#1E1E20', border: '1px solid #3A3A3C', color: '#E6E6E6',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em',
                padding: '9px 12px', outline: 'none',
              }}
            />
          )}
        </div>
      )}

      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {COLUMNS.map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ background: '#0F0F10' }}>
                <td style={cell}>{o.reference}</td>
                <td style={cell}>{o.colourway}</td>
                <td style={cell}>{o.size_value} · {o.gender}</td>
                <td style={{ ...cell, whiteSpace: 'normal', maxWidth: 220, color: '#A6A6A8' }}>
                  {[o.address_line1, o.address_line2, o.suburb, o.city, o.province, o.postal_code].filter(Boolean).join(', ') || (o.city ?? '—')}
                </td>
                <td style={cell}>{o.name}</td>
                <td style={{ ...cell, color: '#A6A6A8' }}>{o.email}</td>
                <td style={cell}>
                  <span style={{ color: STATUS_COLOUR[o.status] ?? '#A6A6A8', fontSize: 9, letterSpacing: '.16em' }}>
                    ● {String(o.status).toUpperCase()}
                  </span>
                </td>
                <td style={{ ...cell, color: '#D90017' }}>{rand(o.amount_due)}</td>
                <td style={{ ...cell, color: '#A6A6A8', fontSize: 10 }}>
                  {o.ship_service_name || o.ship_service_code || '—'}{o.shipping_cost ? ` · ${rand(o.shipping_cost)}` : ''}
                </td>
                <td style={{ ...cell, color: '#A6A6A8', fontSize: 10 }}>{o.tracking_number ?? '—'}</td>
                <td style={{ ...cell, color: '#A6A6A8', fontSize: 10 }}>{o.pf_payment_id ?? '—'}</td>
                <td style={{ ...cell, color: '#A6A6A8' }}>{fmt(o.created_at)}</td>
                <td style={cell}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <OrderStatusButton orderId={o.id} currentStatus={o.status} />
                    {o.status === 'paid' && !o.shiplogic_shipment_id && (
                      <BookCollectionButton orderId={o.id} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={COLUMNS.length} style={{ ...cell, textAlign: 'center', color: '#3A3A3C' }}>
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
