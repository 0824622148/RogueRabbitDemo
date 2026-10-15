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
import { getUpcomingDrops } from '@/lib/queries/collections'

// Card prices come from Supabase products.price. Without this the page is
// prerendered once at build time and a price change in the DB stays invisible
// until the next deploy. 5 minutes keeps it effectively static but self-healing.
export const revalidate = 300

export default async function HomePage() {
  // Sneaker carousel stays footwear-only; New Arrivals shows the in-stock range.
  const [sideProducts, apparel, accessories, upcoming] = await Promise.all([
    getProductsByCategory('FOOTWEAR', 'SIDE'),
    getProductsByCategory('APPAREL'),
    getProductsByCategory('ACCESSORIES'),
    getUpcomingDrops(),
  ])

  return (
    <div className="rr-home-wrap" style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <Hero />
      <div className="rr-home-trust"><TrustStrip /></div>
      <UpcomingDrops drops={upcoming} />
      <NewArrivals products={[...apparel, ...accessories]} />
      {/* Everything below New Arrivals — one block so mobile ordering stays put */}
      <div className="rr-home-rest">
        <CampaignStrip />
        <FeaturedDrop products={sideProducts} />
        <SplitCTA />
        <Footer />
      </div>
    </div>
  )
}
