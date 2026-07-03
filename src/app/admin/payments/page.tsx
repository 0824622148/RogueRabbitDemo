import PageHeader from '@/components/admin/PageHeader'
import OrdersTable from '@/components/admin/OrdersTable'
import { getOrders } from '@/lib/admin/queries'
import { rand } from '@/lib/admin/format'
import { card } from '@/lib/admin/ui'

export const dynamic = 'force-dynamic'

/**
 * Payments queue. PayFast's ITN webhook auto-marks paid orders; this view is
 * where the team confirms payment was received and can manually MARK PAID if
 * a payment needs reconciling. Once paid, orders move to Deliveries.
 */
export default async function PaymentsPage() {
  const orders = await getOrders()
  const pending = orders.filter((o) => o.status === 'pending')
  const pendingTotal = pending.reduce((s, o) => s + (o.amount_due ?? 0), 0)

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Payments" subtitle="CONFIRM PAYFAST PAYMENTS RECEIVED" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={card}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>AWAITING PAYMENT</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: '#D90017' }}>{pending.length}</div>
        </div>
        <div style={card}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>PENDING VALUE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: '#A6A6A8' }}>{rand(pendingTotal)}</div>
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', color: '#A6A6A8', marginBottom: 16, lineHeight: 1.7 }}>
        PAID ORDERS SHOW A PAYFAST PAYMENT ID. USE “MARK PAID” ONLY TO RECONCILE A CONFIRMED PAYMENT MANUALLY.
      </div>

      <OrdersTable
        orders={orders}
        statusTabs={['pending', 'paid']}
        initialStatus="pending"
        emptyLabel="NO ORDERS AWAITING PAYMENT"
      />
    </div>
  )
}
