import type { Metadata } from 'next'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Accessories — Rouge Rabbit',
  description: 'Rouge Rabbit caps and accessories — in stock now. Free delivery in Ennerdale.',
}

// Stock and prices come from Supabase; refresh every minute so a sell-out
// shows quickly without making every request hit the DB.
export const revalidate = 60

export default function AccessoriesPage() {
  return (
    <CategoryPage
      category="ACCESSORIES"
      title="Accessories"
      blurb="Rouge Rabbit caps — in stock now. Born in Ennerdale, so home gets first delivery — free. Nationwide coming soon."
    />
  )
}
