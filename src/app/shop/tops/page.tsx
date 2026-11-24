import type { Metadata } from 'next'
import CategoryPage from '@/components/shop/CategoryPage'
import { NATIONWIDE_DELIVERY_LIVE } from '@/lib/store-status'

export const metadata: Metadata = {
  title: 'Tops — Rouge Rabbit',
  description: 'Rouge Rabbit tees and tops — in stock now. Free nationwide delivery on orders of R900+.',
}

// Stock and prices come from Supabase; refresh every minute so a sell-out
// shows quickly without making every request hit the DB.
export const revalidate = 60

// Category is still APPAREL in the database — "Tops" is the shop-facing name.
// /shop/apparel redirects here (next.config.ts).

export default function TopsPage() {
  return (
    <CategoryPage
      category="APPAREL"
      title="Tops"
      blurb={NATIONWIDE_DELIVERY_LIVE
        ? 'Rouge Rabbit tees — in stock and shipping now. Nationwide with The Courier Guy, free on orders of R900+.'
        : 'Rouge Rabbit tees — in stock now. Nationwide delivery coming soon.'}
    />
  )
}
