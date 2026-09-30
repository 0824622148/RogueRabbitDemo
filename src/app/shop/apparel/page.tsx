import type { Metadata } from 'next'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Apparel — Rouge Rabbit',
  description: 'Rouge Rabbit tees and apparel — in stock now. Free delivery in Ennerdale.',
}

// Stock and prices come from Supabase; refresh every minute so a sell-out
// shows quickly without making every request hit the DB.
export const revalidate = 60

export default function ApparelPage() {
  return (
    <CategoryPage
      category="APPAREL"
      title="Apparel"
      blurb="Rouge Rabbit tees — in stock and shipping now. Free delivery in Ennerdale, nationwide with The Courier Guy."
    />
  )
}
