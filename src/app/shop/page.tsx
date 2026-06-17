import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import ProductCard from '@/components/brand/ProductCard'
import CatalogHeader from '@/components/shop/CatalogHeader'
import FilterBar from '@/components/shop/FilterBar'
import SideRail from '@/components/shop/SideRail'
import { getProducts } from '@/lib/queries/products'

export default async function ShopPage() {
  const products = await getProducts('FRONT')

  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <CatalogHeader />
      <FilterBar />

      <section className="rr-shop-layout" style={{ borderBottom: '1px solid #3A3A3C' }}>
        <div className="rr-shop-sidebar">
          <SideRail products={products} />
        </div>
        <div className="rr-3col-grid">
          {products.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href={`/shop/${p.slug}${p.colourwayId ? `?colour=${p.colourwayId}` : ''}`}
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

      <section className="rr-shop-loadmore" style={{ padding: '70px 40px', textAlign: 'center' }}>
        <div className="rr-mono" style={{ marginBottom: 18 }}>SHOWING {products.length} OF {products.length}</div>
        <div className="rr-mono" style={{ opacity: 0.45, letterSpacing: '0.12em', fontSize: 13 }}>MORE DROPPING SOON</div>
      </section>

      <Footer />
    </div>
  )
}
