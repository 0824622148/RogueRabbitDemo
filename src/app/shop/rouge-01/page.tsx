import { notFound } from 'next/navigation'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import PDPHero from '@/components/product/PDPHero'
import StorySpecs from '@/components/product/StorySpecs'
import OnFootStrip from '@/components/product/OnFootStrip'
import Recommended from '@/components/product/Recommended'
import { getProduct } from '@/lib/queries/products'
import type { Product } from '@/types'

export default async function ProductPage() {
  const data = await getProduct('rouge-01')
  if (!data) notFound()

  const { name, price, colourways } = data

  const recommendedProducts: Product[] = colourways.slice(0, 4).map(cw => ({
    id: cw.sort_order,
    name: `ROUGE 01 · ${cw.name}`,
    slug: 'rouge-01',
    cat: 'FOOTWEAR / DROP 003',
    drop_label: 'DROP 003',
    price,
    image: cw.image,
    mediaBg: '#fff',
  }))

  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />

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
        <span className="rr-mono" style={{ color: '#E6E6E6' }}>{name}</span>
        <span style={{ flex: 1 }} />
        <span className="rr-mono" style={{ color: '#D90017' }}>● 12 SELLING NOW</span>
      </div>

      <PDPHero colourways={colourways} />
      <StorySpecs />
      <OnFootStrip />
      <Recommended products={recommendedProducts} />
      <Footer />
    </div>
  )
}
