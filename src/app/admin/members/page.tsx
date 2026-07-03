import Link from 'next/link'
import PageHeader from '@/components/admin/PageHeader'
import { getMembers } from '@/lib/admin/queries'
import { fmt } from '@/lib/admin/format'
import { cell, th, tableWrap } from '@/lib/admin/ui'

export const dynamic = 'force-dynamic'

export default async function MembersPage() {
  const members = await getMembers()
  const subscribed = members.filter((m) => !m.unsubscribed)

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <PageHeader title="Members" subtitle={`${members.length} TOTAL · ${subscribed.length} SUBSCRIBED`} />
        <Link
          href="/admin/email"
          style={{
            background: '#D90017', color: '#E6E6E6', textDecoration: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em',
            padding: '12px 20px', marginBottom: 32,
          }}
        >
          ✉ EMAIL ALL MEMBERS →
        </Link>
      </div>

      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['NAME', 'EMAIL', 'PHONE', 'SOURCE', 'STATUS', 'JOINED'].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} style={{ background: '#0F0F10' }}>
                <td style={cell}>{m.name ?? '—'}</td>
                <td style={{ ...cell, color: '#A6A6A8' }}>{m.email}</td>
                <td style={{ ...cell, color: '#A6A6A8' }}>{m.phone ?? '—'}</td>
                <td style={cell}>
                  <span style={{ fontSize: 9, letterSpacing: '.16em', color: m.source === 'preorder' ? '#D90017' : '#A6A6A8' }}>
                    {m.source === 'preorder' ? '● PRE-ORDER' : '○ HOMEPAGE'}
                  </span>
                </td>
                <td style={cell}>
                  <span style={{ fontSize: 9, letterSpacing: '.16em', color: m.unsubscribed ? '#3A3A3C' : '#2A9D2A' }}>
                    {m.unsubscribed ? '✕ UNSUBSCRIBED' : '● SUBSCRIBED'}
                  </span>
                </td>
                <td style={{ ...cell, color: '#A6A6A8' }}>{fmt(m.created_at)}</td>
              </tr>
            ))}
            {!members.length && (
              <tr>
                <td colSpan={6} style={{ ...cell, textAlign: 'center', color: '#3A3A3C' }}>NO MEMBERS YET</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
