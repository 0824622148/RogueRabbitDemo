import type { Metadata } from 'next'
import CategoryPage from '@/components/shop/CategoryPage'
import { NATIONWIDE_DELIVERY_LIVE } from '@/lib/store-status'

export const metadata: Metadata = {
  title: 'Accessories — Rouge Rabbit',
  description: 'Rouge Rabbit caps and accessories — in stock now. Free nationwide delivery on orders of R900+.',
}

// Stock and prices come from Supabase; refresh every minute so a sell-out
// shows quickly without making every request hit the DB.
export const revalidate = 60

export default function AccessoriesPage() {
  return (
    <CategoryPage
      category="ACCESSORIES"
      title="Accessories"
      blurb={NATIONWIDE_DELIVERY_LIVE
        ? 'Rouge Rabbit caps — in stock and shipping now. Nationwide with The Courier Guy, free on orders of R900+.'
        : 'Rouge Rabbit caps — in stock now. Nationwide delivery coming soon.'}
    />
  )
}
