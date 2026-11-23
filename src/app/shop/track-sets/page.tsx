import type { Metadata } from 'next'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Track Sets — Rouge Rabbit',
  description:
    'Frequency short set — hooded half-zip top and cargo shorts. Free delivery on orders of R900+.',
}

// Stock and prices come from Supabase; refresh every minute so a sell-out or
// a price change shows quickly without making every request hit the DB.
export const revalidate = 60

export default function TrackSetsPage() {
  return (
    <CategoryPage
      category="TRACK SETS"
      title="Track Sets"
      blurb="Frequency — a short-sleeve hooded half-zip and matching cargo shorts, sold as a set. Move different. Free nationwide delivery: this set qualifies for free shipping on its own."
    />
  )
}
