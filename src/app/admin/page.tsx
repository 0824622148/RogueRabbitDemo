import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'
import { getOrders, getMembers } from '@/lib/admin/queries'
import { fmt, rand, STATUS_COLOUR, CONFIRMED_STATUSES } from '@/lib/admin/format'
import { card, cell, th, tableWrap } from '@/lib/admin/ui'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [orders, members] = await Promise.all([getOrders(), getMembers()])

  const confirmedRevenue = orders
    .filter((o) => CONFIRMED_STATUSES.includes(o.status))
    .reduce((sum, o) => sum + Number(o.amount_due ?? 0), 0)

  const pendingRevenue = orders
    .filter((o) => o.status === 'pending')
    .reduce((sum, o) => sum + Number(o.amount_due ?? 0), 0)

  // "Needs attention" — the two operational queues.
  const toConfirm = orders.filter((o) => o.status === 'pending')
  const toShip = orders.filter((o) => o.status === 'paid' && !o.shiplogic_shipment_id)

  const stats = [
    { label: 'TOTAL ORDERS', value: String(orders.length), accent: '#E6E6E6', href: '/admin/orders' },
    { label: 'CONFIRMED REVENUE', value: rand(confirmedRevenue), accent: '#2A9D2A', href: '/admin/orders' },
    { label: 'PIPELINE (PENDING)', value: rand(pendingRevenue), accent: '#A6A6A8', href: '/admin/payments' },
    { label: 'MEMBERS', value: String(members.length), accent: '#E6E6E6', href: '/admin/members' },
  ]

  const attention = [
    { label: 'PAYMENTS TO CONFIRM', count: toConfirm.length, href: '/admin/payments', accent: '#D90017' },
    { label: 'ORDERS TO BOOK FOR DELIVERY', count: toShip.length, href: '/admin/deliveries', accent: '#3B82F6' },
  ]

  const recent = orders.slice(0, 6)

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Dashboard" subtitle="STORE OVERVIEW" />

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

      {/* Recent orders */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', color: '#D90017' }}>
            ● RECENT ORDERS
          </div>
          <Link href="/admin/orders" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em', color: '#A6A6A8', textDecoration: 'none' }}>
            VIEW ALL →
          </Link>
        </div>
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['REFERENCE', 'NAME', 'COLOURWAY', 'STATUS', 'AMOUNT', 'DATE'].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} style={{ background: '#0F0F10' }}>
                  <td style={cell}>{o.reference}</td>
                  <td style={cell}>{o.name}</td>
                  <td style={{ ...cell, color: '#A6A6A8' }}>{o.colourway}</td>
                  <td style={cell}>
                    <span style={{ color: STATUS_COLOUR[o.status] ?? '#A6A6A8', fontSize: 9, letterSpacing: '.16em' }}>
                      ● {String(o.status).toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...cell, color: '#D90017' }}>{rand(o.amount_due)}</td>
                  <td style={{ ...cell, color: '#A6A6A8' }}>{fmt(o.created_at)}</td>
                </tr>
              ))}
              {!recent.length && (
                <tr>
                  <td colSpan={6} style={{ ...cell, textAlign: 'center', color: '#3A3A3C' }}>NO ORDERS YET</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
