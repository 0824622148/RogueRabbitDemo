import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import Marquee from '@/components/brand/Marquee'
import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import FeaturedDrop from '@/components/home/FeaturedDrop'
import CampaignStrip from '@/components/home/CampaignStrip'
import NewArrivals from '@/components/home/NewArrivals'
import SplitCTA from '@/components/home/SplitCTA'
import { MARQUEE_ITEMS_1, MARQUEE_ITEMS_2 } from '@/data/products'

export default function HomePage() {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <Hero />
      <TrustStrip />
      <Marquee items={MARQUEE_ITEMS_1} speed={22} accent="rouge" />
      <FeaturedDrop />
      <CampaignStrip />
      <NewArrivals />
      <Marquee items={MARQUEE_ITEMS_2} speed={28} accent="bone" />
      <SplitCTA />
      <Footer />
    </div>
  )
}
