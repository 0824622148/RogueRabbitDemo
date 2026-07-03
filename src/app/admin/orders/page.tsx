import PageHeader from '@/components/admin/PageHeader'
import OrdersTable from '@/components/admin/OrdersTable'
import { getOrders } from '@/lib/admin/queries'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Orders" subtitle={`ALL ORDERS · ${orders.length}`} />
      <OrdersTable
        orders={orders}
        statusTabs={['pending', 'paid', 'shipped', 'delivered', 'cancelled']}
        emptyLabel="NO ORDERS YET"
      />
    </div>
  )
}
