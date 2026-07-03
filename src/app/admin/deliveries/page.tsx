import PageHeader from '@/components/admin/PageHeader'
import OrdersTable from '@/components/admin/OrdersTable'
import { getOrders } from '@/lib/admin/queries'
import { card } from '@/lib/admin/ui'

export const dynamic = 'force-dynamic'

/**
 * Deliveries queue. Paid orders not yet booked show a "Book Collection" action
 * (creates a real The Courier Guy / ShipLogic shipment). Shipped orders carry a
 * tracking number.
 */
export default async function DeliveriesPage() {
  const orders = await getOrders()
  const toBook = orders.filter((o) => o.status === 'paid' && !o.shiplogic_shipment_id)
  const inTransit = orders.filter((o) => o.status === 'shipped')

  const stat = (label: string, value: number, accent: string) => (
    <div style={card}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: accent }}>{value}</div>
    </div>
  )

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Deliveries" subtitle="BOOK PAID ORDERS FOR DELIVERY · TRACK SHIPMENTS" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stat('TO BOOK', toBook.length, '#3B82F6')}
        {stat('IN TRANSIT', inTransit.length, '#3B82F6')}
        {stat('DELIVERED', orders.filter((o) => o.status === 'delivered').length, '#2A9D2A')}
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', color: '#A6A6A8', marginBottom: 16, lineHeight: 1.7 }}>
        “BOOK COLLECTION” CREATES A REAL SHIPMENT WITH THE COURIER GUY AND EMAILS THE CUSTOMER A TRACKING NUMBER.
      </div>

      <OrdersTable
        orders={orders}
        statusTabs={['paid', 'shipped', 'delivered']}
        initialStatus="paid"
        emptyLabel="NO ORDERS READY FOR DELIVERY"
      />
    </div>
  )
}
