import { createClient } from '@supabase/supabase-js'
import OrderStatusButton from '@/components/admin/OrderStatusButton'
import BookCollectionButton from '@/components/admin/BookCollectionButton'

export const dynamic = 'force-dynamic'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_COLOUR: Record<string, string> = {
  pending: '#A6A6A8',
  paid: '#2A9D2A',
  shipped: '#3B82F6',
  delivered: '#2A9D2A',
  cancelled: '#D90017',
}

const CONFIRMED_STATUSES = ['paid', 'shipped', 'delivered']

export default async function AdminPage() {
  const db = getServiceClient()

  const [{ data: orders }, { data: members }] = await Promise.all([
    db.from('orders').select('*').order('created_at', { ascending: false }),
    db.from('members').select('*').order('created_at', { ascending: false }),
  ])

  const confirmedRevenue = (orders ?? [])
    .filter((o: any) => CONFIRMED_STATUSES.includes(o.status))
    .reduce((sum: number, o: any) => sum + (o.amount_due ?? 0), 0)

  const pendingRevenue = (orders ?? [])
    .filter((o: any) => o.status === 'pending')
    .reduce((sum: number, o: any) => sum + (o.amount_due ?? 0), 0)

  const cell: React.CSSProperties = {
    padding: '12px 14px',
    borderBottom: '1px solid #1E1E20',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '.08em',
    color: '#E6E6E6',
    whiteSpace: 'nowrap',
  }

  const th: React.CSSProperties = {
    ...cell,
    color: '#A6A6A8',
    fontSize: 9,
    letterSpacing: '.18em',
    borderBottom: '1px solid #3A3A3C',
    background: '#0F0F10',
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <div style={{ color: '#D90017', fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '.06em' }}>
            ROUGE RABBIT
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginTop: 2 }}>
            ADMIN DASHBOARD
          </div>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            style={{
              background: 'none', border: '1px solid #3A3A3C', color: '#A6A6A8',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em',
              padding: '8px 16px', cursor: 'pointer',
            }}
          >
            LOGOUT →
          </button>
        </form>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
        {[
          { label: 'TOTAL ORDERS', value: orders?.length ?? 0, accent: '#E6E6E6' },
          { label: 'CONFIRMED REVENUE', value: `R${confirmedRevenue.toLocaleString('en-ZA')}`, accent: '#2A9D2A' },
          { label: 'PIPELINE', value: `R${pendingRevenue.toLocaleString('en-ZA')}`, accent: '#A6A6A8' },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ background: '#1E1E20', border: '1px solid #3A3A3C', padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: accent, letterSpacing: '.04em' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', color: '#D90017', marginBottom: 16 }}>
          ● PRE-ORDERS ({orders?.length ?? 0})
        </div>
        <div style={{ overflowX: 'auto', border: '1px solid #3A3A3C' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['REFERENCE', 'COLOURWAY', 'SIZE · GENDER', 'DELIVERY ADDRESS', 'NAME', 'EMAIL', 'STATUS', 'AMOUNT', 'DELIVERY', 'TRACKING', 'PAYMENT ID', 'DATE', 'ACTIONS'].map(h => (
                  <th key={h} style={{ ...th, textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((o: any) => (
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
                    <span style={{
                      color: STATUS_COLOUR[o.status] ?? '#A6A6A8',
                      fontSize: 9, letterSpacing: '.16em',
                    }}>
                      ● {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...cell, color: '#D90017' }}>R{o.amount_due}</td>
                  <td style={{ ...cell, color: '#A6A6A8', fontSize: 10 }}>
                    {o.ship_service_name || o.ship_service_code || '—'}{o.shipping_cost ? ` · R${o.shipping_cost}` : ''}
                  </td>
                  <td style={{ ...cell, color: '#A6A6A8', fontSize: 10 }}>{o.tracking_number ?? '—'}</td>
                  <td style={{ ...cell, color: '#A6A6A8', fontSize: 10 }}>{o.pf_payment_id ?? '—'}</td>
                  <td style={{ ...cell, color: '#A6A6A8' }}>{fmt(o.created_at)}</td>
                  <td style={{ ...cell }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <OrderStatusButton orderId={o.id} currentStatus={o.status} />
                      {o.status === 'paid' && !o.shiplogic_shipment_id && (
                        <BookCollectionButton orderId={o.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!orders?.length && (
                <tr>
                  <td colSpan={13} style={{ ...cell, textAlign: 'center', color: '#3A3A3C' }}>
                    NO ORDERS YET
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Members */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', color: '#D90017', marginBottom: 16 }}>
          ● MEMBERS ({members?.length ?? 0})
        </div>
        <div style={{ overflowX: 'auto', border: '1px solid #3A3A3C' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['NAME', 'EMAIL', 'PHONE', 'SOURCE', 'JOINED'].map(h => (
                  <th key={h} style={{ ...th, textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(members ?? []).map((m: any) => (
                <tr key={m.id} style={{ background: '#0F0F10' }}>
                  <td style={cell}>{m.name ?? '—'}</td>
                  <td style={{ ...cell, color: '#A6A6A8' }}>{m.email}</td>
                  <td style={{ ...cell, color: '#A6A6A8' }}>{m.phone ?? '—'}</td>
                  <td style={cell}>
                    <span style={{
                      fontSize: 9, letterSpacing: '.16em',
                      color: m.source === 'preorder' ? '#D90017' : '#A6A6A8',
                    }}>
                      {m.source === 'preorder' ? '● PRE-ORDER' : '○ HOMEPAGE'}
                    </span>
                  </td>
                  <td style={{ ...cell, color: '#A6A6A8' }}>{fmt(m.created_at)}</td>
                </tr>
              ))}
              {!members?.length && (
                <tr>
                  <td colSpan={5} style={{ ...cell, textAlign: 'center', color: '#3A3A3C' }}>
                    NO MEMBERS YET
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
