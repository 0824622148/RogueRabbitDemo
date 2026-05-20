import SectionHead from '@/components/brand/SectionHead'
import ProductCard from '@/components/brand/ProductCard'
import { NEW_ARRIVALS } from '@/data/products'

export default function NewArrivals() {
  return (
    <section style={{ padding: '100px 0', background: '#0F0F10' }}>
      <SectionHead
        index="02"
        kicker="JUST LANDED · APPAREL & FW"
        title="NEW ARRIVALS."
        action="Browse all 38"
      />
      <div
        style={{
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
        }}
      >
        {NEW_ARRIVALS.map((p, i) => (
          <ProductCard key={p.id} product={p} mediaHeight={340} indexLabel={`R/01${i + 1}`} />
        ))}
      </div>
    </section>
  )
}
