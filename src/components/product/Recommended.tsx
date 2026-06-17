import Link from 'next/link'
import SectionHead from '@/components/brand/SectionHead'
import ProductCard from '@/components/brand/ProductCard'
import type { Product } from '@/types'

interface Props {
  products: Product[]
}

export default function Recommended({ products }: Props) {
  return (
    <section className="rr-recommended" style={{ padding: '100px 0' }}>
      <SectionHead index="03" kicker="MORE COLOURWAYS" title="SAME SHOE. DIFFERENT ENERGY." action="View all" actionHref="/shop" />
      <div
        style={{
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: '#3A3A3C',
        }}
      >
        {products.map((p, i) => (
          <Link
            key={p.id}
            href={`/shop/${p.slug}${p.colourwayId ? `?colour=${p.colourwayId}` : ''}`}
            style={{ display: 'block', textDecoration: 'none' }}
          >
            <ProductCard product={p} mediaHeight={360} indexLabel={`R/02${i + 1}`} />
          </Link>
        ))}
      </div>
    </section>
  )
}
