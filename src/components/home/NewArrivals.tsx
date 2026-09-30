import Link from 'next/link'
import SectionHead from '@/components/brand/SectionHead'
import ProductCard from '@/components/brand/ProductCard'
import type { Product } from '@/types'

interface Props {
  products: Product[]
}

export default function NewArrivals({ products }: Props) {
  return (
    <section className="rr-section-pad" style={{ background: '#0F0F10' }}>
      <SectionHead
        index="01"
        kicker="BAGGED LEAGUE × ROUGE RABBIT · AIR DOWN + PAINT SHOP · IN STOCK NOW"
        title="NEW ARRIVALS."
        action="Shop the collab"
        actionHref="/shop/apparel"
      />
      <div className="rr-4col-grid-gap rr-section-inner-pad">
        {products.map((p, i) => (
          <Link key={p.id} href={`/shop/${p.slug}${p.colourwayId ? `?colour=${p.colourwayId}` : ''}`} style={{ display: 'block', textDecoration: 'none' }}>
            <ProductCard product={p} mediaHeight={340} indexLabel={`R/01${i + 1}`} />
          </Link>
        ))}
      </div>
    </section>
  )
}
