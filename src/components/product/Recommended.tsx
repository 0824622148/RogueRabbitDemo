import SectionHead from '@/components/brand/SectionHead'
import ProductCard from '@/components/brand/ProductCard'
import { RECOMMENDED_PRODUCTS } from '@/data/products'

export default function Recommended() {
  return (
    <section style={{ padding: '100px 0' }}>
      <SectionHead index="03" kicker="ALSO WORN" title="WEAR IT WITH." action="Shop the look" />
      <div
        style={{
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: '#3A3A3C',
        }}
      >
        {RECOMMENDED_PRODUCTS.map((p, i) => (
          <ProductCard key={p.id} product={p} mediaHeight={360} indexLabel={`R/02${i + 1}`} />
        ))}
      </div>
    </section>
  )
}
