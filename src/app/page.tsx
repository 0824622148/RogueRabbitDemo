import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import FeaturedDrop from '@/components/home/FeaturedDrop'
import CampaignStrip from '@/components/home/CampaignStrip'
import NewArrivals from '@/components/home/NewArrivals'
import SplitCTA from '@/components/home/SplitCTA'
import UpcomingDrops from '@/components/home/UpcomingDrops'
import { getProductsByCategory } from '@/lib/queries/products'
import { getCollection, getUpcomingDrops } from '@/lib/queries/collections'
import { SNEAKERS_HIDDEN } from '@/lib/store-status'

// Card prices come from Supabase products.price. Without this the page is
// prerendered once at build time and a price change in the DB stays invisible
// until the next deploy. 5 minutes keeps it effectively static but self-healing.
export const revalidate = 300

export default async function HomePage() {
  // The client wants the home page on the latest releases only, so New Arrivals
  // is just Signal and Beauty in Contrast. The rest of the range stays in /shop.
  const [sideProducts, signal, bic, upcoming] = await Promise.all([
    getProductsByCategory('FOOTWEAR', 'SIDE'),
    getCollection('signal'),
    getCollection('beauty-in-contrast'),
    getUpcomingDrops(),
  ])
  const latest = [signal, bic].flatMap((d) =>
    d ? [...d.products, ...d.children.flatMap((c) => c.products)] : [],
  )

  return (
    <div className="rr-home-wrap" style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <Hero />
      <div className="rr-home-trust"><TrustStrip /></div>
      <UpcomingDrops drops={upcoming} />
      <NewArrivals products={latest} />
      {/* Everything below New Arrivals — one block so mobile ordering stays put */}
      <div className="rr-home-rest">
        <CampaignStrip />
        {!SNEAKERS_HIDDEN && <FeaturedDrop products={sideProducts} />}
        <SplitCTA />
        <Footer />
      </div>
    </div>
  )
}
