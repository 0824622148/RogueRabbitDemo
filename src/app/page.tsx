import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import FeaturedDrop from '@/components/home/FeaturedDrop'
import CampaignStrip from '@/components/home/CampaignStrip'
import NewArrivals from '@/components/home/NewArrivals'
import SplitCTA from '@/components/home/SplitCTA'
import { getProducts } from '@/lib/queries/products'

// Card prices come from Supabase products.price. Without this the page is
// prerendered once at build time and a price change in the DB stays invisible
// until the next deploy. 5 minutes keeps it effectively static but self-healing.
export const revalidate = 300

export default async function HomePage() {
  const [sideProducts, frontProducts] = await Promise.all([
    getProducts('SIDE'),
    getProducts('FRONT'),
  ])

  return (
    <div className="rr-home-wrap" style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <Hero />
      <div><TrustStrip /></div>
      <div><FeaturedDrop products={sideProducts} /></div>
      <CampaignStrip />
      <NewArrivals products={frontProducts} />
      <SplitCTA />
      <Footer />
    </div>
  )
}
