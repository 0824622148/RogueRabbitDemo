import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import ProductCard from '@/components/brand/ProductCard'
import CatalogHeader from '@/components/shop/CatalogHeader'
import FilterBar from '@/components/shop/FilterBar'
import SideRail from '@/components/shop/SideRail'
import { SHOP_PRODUCTS } from '@/data/products'

export default function ShopPage() {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <CatalogHeader />
      <FilterBar />

      {/* Grid with side filter rail */}
      <section className="rr-shop-layout" style={{ borderBottom: '1px solid #3A3A3C' }}>
        <div className="rr-shop-sidebar">
          <SideRail />
        </div>
        <div
          className="rr-3col-grid"
        >
          {SHOP_PRODUCTS.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href="/shop/rouge-01"
              style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}
            >
              <ProductCard
                product={p}
                mediaHeight={420}
                indexLabel={`R/0${String(i + 1).padStart(2, '0')}`}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Load more */}
      <section style={{ padding: '70px 40px', textAlign: 'center' }}>
        <div className="rr-mono" style={{ marginBottom: 18 }}>SHOWING 08 OF 38</div>
        <button className="rr-btn rr-btn--ghost">LOAD NEXT 12 →</button>
      </section>

      <Footer />
    </div>
  )
}
