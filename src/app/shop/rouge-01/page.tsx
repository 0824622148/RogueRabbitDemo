import { notFound } from 'next/navigation'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import PDPHero from '@/components/product/PDPHero'
import StorySpecs from '@/components/product/StorySpecs'
import OnFootStrip from '@/components/product/OnFootStrip'
import Recommended from '@/components/product/Recommended'
import { getProduct } from '@/lib/queries/products'
import type { Product } from '@/types'

import type { SearchParams } from 'next/dist/server/request/search-params'

export default async function ProductPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [data, params] = await Promise.all([getProduct('rouge-01'), searchParams])
  if (!data) notFound()

  const { name, price, colourways } = data
  const initialColourwayId = typeof params.colour === 'string' ? params.colour : undefined

  const activeId = initialColourwayId ?? colourways[0]?.id
  const recommendedProducts: Product[] = colourways
    .filter(cw => cw.id !== activeId)
    .slice(0, 4)
    .map(cw => ({
      id: cw.sort_order,
      name: `ROUGE 01 · ${cw.name}`,
      slug: 'rouge-01',
      colourwayId: cw.id,
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
        className="rr-breadcrumb"
        style={{
          padding: '20px 40px',
          display: 'flex', gap: 14, alignItems: 'center',
          borderBottom: '1px solid #3A3A3C',
        }}
      >
        <span className="rr-mono">SHOP</span>
        <span style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono rr-breadcrumb-hide">FOOTWEAR</span>
        <span className="rr-breadcrumb-hide" style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono rr-breadcrumb-hide">DROP 003</span>
        <span className="rr-breadcrumb-hide" style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono" style={{ color: '#E6E6E6' }}>{name}</span>
        <span style={{ flex: 1 }} />
        <span className="rr-mono rr-breadcrumb-live">● 12 SELLING NOW</span>
      </div>

      <PDPHero key={initialColourwayId ?? 'default'} colourways={colourways} initialColourwayId={initialColourwayId} />
      <StorySpecs />
      <OnFootStrip />
      <Recommended products={recommendedProducts} />
      <Footer />
    </div>
  )
}
