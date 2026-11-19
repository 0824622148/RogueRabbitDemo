import Link from 'next/link'
import SectionHead from '@/components/brand/SectionHead'
import ProductCard from '@/components/brand/ProductCard'
import type { Product } from '@/types'

interface Props {
  products: Product[]
}

export default function NewArrivals({ products }: Props) {
  const pair = products.length <= 2
  return (
    <section className="rr-section-pad" style={{ background: '#0F0F10' }}>
      <SectionHead
        index="01"
        kicker="LATEST RELEASES · SIGNAL + BEAUTY IN CONTRAST · IN STOCK NOW"
        title="NEW ARRIVALS."
        action="All drops"
        actionHref="/drops"
      />
      {/* One or two drop tees get a wide two-up instead of half an empty row. */}
      <div className={`rr-4col-grid-gap rr-section-inner-pad${pair ? ' rr-pair' : ''}`}>
        {products.map((p, i) => (
          <Link key={p.id} href={`/shop/${p.slug}${p.colourwayId ? `?colour=${p.colourwayId}` : ''}`} style={{ display: 'block', textDecoration: 'none' }}>
            <ProductCard product={p} mediaHeight={pair ? 560 : 340} indexLabel={`R/01${i + 1}`} />
          </Link>
        ))}
      </div>
    </section>
  )
}
