import PageHeader from '@/components/admin/PageHeader'
import StockEditor from '@/components/admin/StockEditor'
import { getInventory, getStockAdjustments } from '@/lib/admin/queries'
import { fmt, LOW_STOCK_AT } from '@/lib/admin/format'
import { card, cell, th, overline, tableWrap } from '@/lib/admin/ui'

export const dynamic = 'force-dynamic'

/**
 * Stock for tees and caps. Counts go down automatically when PayFast confirms
 * a payment; the team uses this page for restocks and corrections. Footwear
 * is pre-order only and has no stock counts, so it isn't listed.
 */
export default async function InventoryPage() {
  const [products, adjustments] = await Promise.all([getInventory(), getStockAdjustments()])

  const sizes = products.flatMap((p) => p.colourways.flatMap((c) => c.sizes))
  const totalUnits = sizes.reduce((s, r) => s + r.stock, 0)
  const soldOut = sizes.filter((r) => r.stock === 0).length
  const low = sizes.filter((r) => r.stock > 0 && r.stock <= LOW_STOCK_AT).length

  const stat = (label: string, value: string, accent: string) => (
    <div style={card}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: accent }}>{value}</div>
    </div>
  )

  const status = (n: number) =>
    n === 0
      ? <span style={{ fontSize: 9, letterSpacing: '.16em', color: '#D90017' }}>✕ SOLD OUT</span>
      : n <= LOW_STOCK_AT
        ? <span style={{ fontSize: 9, letterSpacing: '.16em', color: '#F2A93B' }}>● LOW</span>
        : <span style={{ fontSize: 9, letterSpacing: '.16em', color: '#2A9D2A' }}>● IN STOCK</span>

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Inventory" subtitle="TEES & CAPS · STOCK PER SIZE" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stat('UNITS IN STOCK', String(totalUnits), '#E6E6E6')}
        {stat(`LOW (≤${LOW_STOCK_AT})`, String(low), '#F2A93B')}
        {stat('SOLD OUT SIZES', String(soldOut), '#D90017')}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', color: '#A6A6A8', marginBottom: 28, lineHeight: 1.7 }}>
        STOCK GOES DOWN AUTOMATICALLY WHEN PAYFAST CONFIRMS A PAYMENT. USE THIS PAGE FOR RESTOCKS AND CORRECTIONS.
        <br />
        A SIZE AT 0 SHOWS AS SOLD OUT ON THE SHOP AND CAN&apos;T BE ADDED TO THE BAG.
      </div>

      {products.map((p) => (
        <section key={p.id} style={{ marginBottom: 36 }}>
          <div style={overline}>● {p.name} <span style={{ color: '#A6A6A8' }}>· {p.category}</span></div>
          <div style={tableWrap}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['COLOUR', 'SIZE', 'IN STOCK', 'STATUS'].map((h) => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {p.colourways.flatMap((cw) =>
                  cw.sizes.map((s, i) => (
                    <tr key={s.inventoryId} style={{ background: '#0F0F10' }}>
                      <td style={{ ...cell, color: i === 0 ? '#E6E6E6' : '#3A3A3C' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, background: cw.hex ?? '#3A3A3C', border: '1px solid #3A3A3C', display: 'inline-block' }} />
                          {cw.name}
                        </span>
                      </td>
                      <td style={cell}>{s.size}</td>
                      <td style={cell}><StockEditor inventoryId={s.inventoryId} stock={s.stock} /></td>
                      <td style={cell}>{status(s.stock)}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {!products.length && (
        <div style={{ ...card, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#3A3A3C' }}>
          NO STOCK-TRACKED PRODUCTS
        </div>
      )}

      <section style={{ marginTop: 12 }}>
        <div style={overline}>● RECENT CHANGES</div>
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['WHEN', 'ITEM', 'CHANGE', 'REASON'].map((h) => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {adjustments.map((a) => {
                const diff = a.newCount - (a.oldCount ?? 0)
                return (
                  <tr key={a.id} style={{ background: '#0F0F10' }}>
                    <td style={{ ...cell, color: '#A6A6A8' }}>{fmt(a.createdAt)}</td>
                    <td style={cell}>{a.label}</td>
                    <td style={cell}>
                      {a.oldCount ?? 0} → {a.newCount}{' '}
                      <span style={{ color: diff >= 0 ? '#2A9D2A' : '#D90017' }}>({diff >= 0 ? '+' : ''}{diff})</span>
                    </td>
                    <td style={{ ...cell, color: '#A6A6A8' }}>{a.reason}</td>
                  </tr>
                )
              })}
              {!adjustments.length && (
                <tr>
                  <td colSpan={4} style={{ ...cell, textAlign: 'center', color: '#3A3A3C' }}>NO MANUAL CHANGES YET</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
