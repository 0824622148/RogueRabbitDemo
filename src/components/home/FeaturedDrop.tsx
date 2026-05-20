import SectionHead from '@/components/brand/SectionHead'
import ProductCard from '@/components/brand/ProductCard'
import { HOME_PRODUCTS } from '@/data/products'

export default function FeaturedDrop() {
  return (
    <section className="rr-section-pad" style={{ background: '#0F0F10', position: 'relative' }}>
      <SectionHead
        index="01"
        kicker="DROP · 003 · FEATURED"
        title="THE ROUGE 01."
        action="See all colourways"
      />
      <div className="rr-4col-grid rr-section-inner-pad">
        {HOME_PRODUCTS.map((p, i) => (
          <ProductCard key={p.id} product={p} mediaHeight={420} indexLabel={`R/00${i + 1}`} />
        ))}
      </div>
    </section>
  )
}
