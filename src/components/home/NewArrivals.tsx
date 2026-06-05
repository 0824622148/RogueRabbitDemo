import SectionHead from '@/components/brand/SectionHead'
import ProductCard from '@/components/brand/ProductCard'
import { NEW_ARRIVALS } from '@/data/products'

export default function NewArrivals() {
  return (
    <section className="rr-section-pad" style={{ background: '#0F0F10' }}>
      <SectionHead
        index="02"
        kicker="ROUGE 01 EDITION · NOW AVAILABLE · MORE DROPS COMING"
        title="NEW ARRIVALS."
        action="Shop Rouge 01"
      />
      <div className="rr-4col-grid-gap rr-section-inner-pad">
        {NEW_ARRIVALS.map((p, i) => (
          <ProductCard key={p.id} product={p} mediaHeight={340} indexLabel={`R/01${i + 1}`} />
        ))}
      </div>
    </section>
  )
}
