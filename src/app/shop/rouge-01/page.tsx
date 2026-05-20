import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import PDPHero from '@/components/product/PDPHero'
import StorySpecs from '@/components/product/StorySpecs'
import OnFootStrip from '@/components/product/OnFootStrip'
import Recommended from '@/components/product/Recommended'

export default function ProductPage() {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />

      {/* Breadcrumb */}
      <div
        style={{
          padding: '20px 40px',
          display: 'flex', gap: 14, alignItems: 'center',
          borderBottom: '1px solid #3A3A3C',
        }}
      >
        <span className="rr-mono">SHOP</span>
        <span style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono">FOOTWEAR</span>
        <span style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono">DROP 003</span>
        <span style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono" style={{ color: '#E6E6E6' }}>ROUGE 01</span>
        <span style={{ flex: 1 }} />
        <span className="rr-mono" style={{ color: '#D90017' }}>● 12 SELLING NOW</span>
      </div>

      <PDPHero />
      <StorySpecs />
      <OnFootStrip />
      <Recommended />
      <Footer />
    </div>
  )
}
