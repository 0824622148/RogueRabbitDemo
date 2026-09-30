import PageHeader from '@/components/admin/PageHeader'
import OrdersTable from '@/components/admin/OrdersTable'
import { getPaidOrders } from '@/lib/admin/queries'
import { rand, PAID_STATUSES, ADMIN_STATUS_TABS } from '@/lib/admin/format'
import { card } from '@/lib/admin/ui'

export const dynamic = 'force-dynamic'

/**
 * Confirmed payments. Every row here was verified by PayFast's ITN (signature,
 * merchant, amount, and PayFast's own validate endpoint). There is no manual
 * "mark paid" — a payment that isn't here was not confirmed by PayFast.
 */
export default async function PaymentsPage() {
  const orders = await getPaidOrders()
  const live = orders.filter((o) => PAID_STATUSES.includes(o.status))
  const revenue = live.reduce((s, o) => s + Number(o.amount_due ?? 0), 0)
  const delivery = live.reduce((s, o) => s + Number(o.shipping_cost ?? 0), 0)
  const refunded = orders.filter((o) => o.status === 'cancelled')

  const stat = (label: string, value: string, accent: string) => (
    <div style={card}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: accent }}>{value}</div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Payments" subtitle="CONFIRMED PAYFAST PAYMENTS" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stat('CONFIRMED PAYMENTS', String(live.length), '#2A9D2A')}
        {stat('TOTAL RECEIVED', rand(revenue), '#2A9D2A')}
        {stat('OF WHICH DELIVERY', rand(delivery), '#A6A6A8')}
        {stat('REFUNDED / CANCELLED', String(refunded.length), '#D90017')}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', color: '#A6A6A8', marginBottom: 16, lineHeight: 1.7 }}>
        ONLY PAYMENTS VERIFIED BY PAYFAST APPEAR HERE. CHECKOUTS THAT WERE STARTED BUT NOT PAID ARE NEVER SHOWN.
        <br />
        TO REFUND: REFUND IN THE PAYFAST DASHBOARD, THEN CANCEL THE ORDER HERE TO RECORD IT.
      </div>

      <OrdersTable
        orders={orders}
        statusTabs={ADMIN_STATUS_TABS}
        emptyLabel="NO CONFIRMED PAYMENTS YET"
      />
    </div>
  )
}
