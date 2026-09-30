import PageHeader from '@/components/admin/PageHeader'
import OrdersTable from '@/components/admin/OrdersTable'
import { getPaidOrders } from '@/lib/admin/queries'
import { isLocalDelivery } from '@/lib/admin/format'
import { card } from '@/lib/admin/ui'

export const dynamic = 'force-dynamic'

/**
 * Deliveries, in two queues:
 *  - Courier: paid orders not yet booked show "Book Collection" (creates a real
 *    The Courier Guy / ShipLogic shipment). Shipped orders carry tracking.
 *  - Local (Ennerdale): delivered by hand by the Rouge Rabbit team, free.
 *    Never booked with the courier — moved to OUT FOR DELIVERY then DELIVERED.
 */
export default async function DeliveriesPage() {
  const orders = await getPaidOrders()
  const courier = orders.filter((o) => !isLocalDelivery(o))
  const local = orders.filter((o) => isLocalDelivery(o))

  const toBook = courier.filter((o) => o.status === 'paid' && !o.shiplogic_shipment_id)
  const inTransit = courier.filter((o) => o.status === 'shipped')
  const localOpen = local.filter((o) => o.status === 'paid' || o.status === 'shipped')

  const stat = (label: string, value: number, accent: string) => (
    <div style={card}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: '#A6A6A8', marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: accent }}>{value}</div>
    </div>
  )

  const note = (text: string) => (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', color: '#A6A6A8', marginBottom: 16, lineHeight: 1.7 }}>
      {text}
    </div>
  )

  const heading = (text: string, id?: string) => (
    <div id={id} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.2em', color: '#D90017', margin: '40px 0 16px' }}>
      ● {text}
    </div>
  )

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Deliveries" subtitle="COURIER BOOKINGS · ENNERDALE LOCAL DELIVERIES" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 8 }}>
        {stat('COURIER · TO BOOK', toBook.length, '#3B82F6')}
        {stat('COURIER · IN TRANSIT', inTransit.length, '#3B82F6')}
        {stat('ENNERDALE · TO DELIVER', localOpen.length, '#D90017')}
        {stat('DELIVERED', orders.filter((o) => o.status === 'delivered').length, '#2A9D2A')}
      </div>

      {heading('ENNERDALE — LOCAL DELIVERY (FREE, BY HAND)', 'local')}
      {note('WHATSAPP THE CUSTOMER TO ARRANGE A TIME. MARK “OUT FOR DELIVERY” WHEN IT LEAVES, THEN “DELIVERED”. DO NOT BOOK THESE WITH THE COURIER GUY.')}
      <OrdersTable
        orders={local}
        statusTabs={['paid', 'shipped', 'delivered']}
        initialStatus="paid"
        emptyLabel="NO ENNERDALE ORDERS WAITING"
      />

      {heading('THE COURIER GUY — NATIONWIDE')}
      {note('“BOOK COLLECTION” CREATES A REAL SHIPMENT WITH THE COURIER GUY AND EMAILS THE CUSTOMER A TRACKING NUMBER.')}
      <OrdersTable
        orders={courier}
        statusTabs={['paid', 'shipped', 'delivered']}
        initialStatus="paid"
        emptyLabel="NO COURIER ORDERS READY FOR DELIVERY"
      />
    </div>
  )
}
