import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_COLOUR: Record<string, string> = {
  pending: '#A6A6A8',
  paid: '#2A9D2A',
  cancelled: '#D90017',
}

export default async function AdminPage() {
  const db = getServiceClient()

  const [{ data: orders }, { data: members }] = await Promise.all([
    db.from('orders').select('*').order('created_at', { ascending: false }),
    db.from('members').select('*').order('created_at', { ascending: false }),
  ])

  const totalRevenue = (orders ?? [])
    .filter((o: any) => o.status !== 'cancelled')
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
          { label: 'TOTAL ORDERS', value: orders?.length ?? 0 },
          { label: 'TOTAL MEMBERS', value: members?.length ?? 0 },
          { label: 'REVENUE PIPELINE', value: `R${totalRevenue.toLocaleString('en-ZA')}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#1E1E20', border: '1px solid #3A3A3C', padding: '24px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: '#E6E6E6', letterSpacing: '.04em' }}>
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
                {['REFERENCE', 'COLOURWAY', 'SIZE · GENDER', 'CITY', 'NAME', 'EMAIL', 'STATUS', 'AMOUNT', 'DATE'].map(h => (
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
                  <td style={cell}>{o.city.split(' · ')[0]}</td>
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
                  <td style={{ ...cell, color: '#A6A6A8' }}>{fmt(o.created_at)}</td>
                </tr>
              ))}
              {!orders?.length && (
                <tr>
                  <td colSpan={9} style={{ ...cell, textAlign: 'center', color: '#3A3A3C' }}>
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
