import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import FeaturedDrop from '@/components/home/FeaturedDrop'
import CampaignStrip from '@/components/home/CampaignStrip'
import NewArrivals from '@/components/home/NewArrivals'
import SplitCTA from '@/components/home/SplitCTA'

export default function HomePage() {
  return (
    <div className="rr-home-wrap" style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <Hero />
      <div><TrustStrip /></div>
      <div><FeaturedDrop /></div>
      <CampaignStrip />
      <NewArrivals />
      <SplitCTA />
      <Footer />
    </div>
  )
}
