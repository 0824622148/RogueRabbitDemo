import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'
import { getPaidOrders, getMembers } from '@/lib/admin/queries'
import { fmt, rand, statusLabel, STATUS_COLOUR, PAID_STATUSES, itemsLabel, isLocalDelivery } from '@/lib/admin/format'
import { card, cell, th, tableWrap } from '@/lib/admin/ui'

export const dynamic = 'force-dynamic'

/**
 * Store overview. Every figure here is built from verified-paid orders only —
 * an order appears once PayFast's ITN has confirmed the payment, never before.
 */
export default async function AdminDashboardPage() {
  const [orders, members] = await Promise.all([getPaidOrders(), getMembers()])

  const live = orders.filter((o) => PAID_STATUSES.includes(o.status))
  const revenue = live.reduce((sum, o) => sum + Number(o.amount_due ?? 0), 0)

  // "Needs attention" — the two fulfilment queues.
  const toBook = orders.filter((o) => o.status === 'paid' && !isLocalDelivery(o) && !o.shiplogic_shipment_id)
  const toDeliver = orders.filter((o) => isLocalDelivery(o) && (o.status === 'paid' || o.status === 'shipped'))

  const stats = [
    { label: 'PAID ORDERS', value: String(live.length), accent: '#E6E6E6', href: '/admin/orders' },
    { label: 'REVENUE (VERIFIED)', value: rand(revenue), accent: '#2A9D2A', href: '/admin/payments' },
    { label: 'MEMBERS', value: String(members.length), accent: '#E6E6E6', href: '/admin/members' },
  ]

  const attention = [
    { label: 'COURIER ORDERS TO BOOK', count: toBook.length, href: '/admin/deliveries', accent: '#3B82F6' },
    { label: 'ENNERDALE — DELIVER BY HAND', count: toDeliver.length, href: '/admin/deliveries#local', accent: '#D90017' },
  ]

  const recent = orders.slice(0, 6)

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Dashboard" subtitle="STORE OVERVIEW · VERIFIED PAYMENTS ONLY" />

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stats.map(({ label, value, accent, href }) => (
          <Link key={label} href={href} style={{ ...card, textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: accent, letterSpacing: '.04em' }}>
              {value}
            </div>
          </Link>
        ))}
      </div>

      {/* Needs attention */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {attention.map(({ label, count, href, accent }) => (
          <Link
            key={label}
            href={href}
            style={{
              ...card, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderColor: count > 0 ? accent : '#3A3A3C',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', color: count > 0 ? '#E6E6E6' : '#A6A6A8' }}>
              {label}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: count > 0 ? accent : '#3A3A3C' }}>
              {count}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent paid orders */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', color: '#D90017' }}>
            ● RECENT PAID ORDERS
          </div>
          <Link href="/admin/orders" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em', color: '#A6A6A8', textDecoration: 'none' }}>
            VIEW ALL →
          </Link>
        </div>
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['REFERENCE', 'NAME', 'ITEMS', 'DELIVERY', 'STATUS', 'AMOUNT', 'PAID'].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} style={{ background: '#0F0F10' }}>
                  <td style={cell}>{o.reference}</td>
                  <td style={cell}>{o.name}</td>
                  <td style={{ ...cell, color: '#A6A6A8', whiteSpace: 'normal', maxWidth: 280 }}>{itemsLabel(o)}</td>
                  <td style={{ ...cell, color: isLocalDelivery(o) ? '#D90017' : '#A6A6A8', fontSize: 10 }}>
                    {isLocalDelivery(o) ? 'LOCAL · ENNERDALE' : 'COURIER'}
                  </td>
                  <td style={cell}>
                    <span style={{ color: STATUS_COLOUR[o.status] ?? '#A6A6A8', fontSize: 9, letterSpacing: '.16em' }}>
                      ● {statusLabel(o.status)}
                    </span>
                  </td>
                  <td style={{ ...cell, color: '#D90017' }}>{rand(o.amount_due)}</td>
                  <td style={{ ...cell, color: '#A6A6A8' }}>{fmt(o.paid_at)}</td>
                </tr>
              ))}
              {!recent.length && (
                <tr>
                  <td colSpan={7} style={{ ...cell, textAlign: 'center', color: '#3A3A3C' }}>NO PAID ORDERS YET</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
