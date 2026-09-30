import PageHeader from '@/components/admin/PageHeader'
import OrdersTable from '@/components/admin/OrdersTable'
import { getPaidOrders } from '@/lib/admin/queries'
import { ADMIN_STATUS_TABS } from '@/lib/admin/format'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = await getPaidOrders()

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px' }}>
      <PageHeader title="Orders" subtitle={`PAID ORDERS · ${orders.length}`} />
      <OrdersTable
        orders={orders}
        statusTabs={ADMIN_STATUS_TABS}
        emptyLabel="NO PAID ORDERS YET"
      />
    </div>
  )
}
