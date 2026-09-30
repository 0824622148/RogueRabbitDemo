import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import ProductCard from '@/components/brand/ProductCard'
import DroppingSoon from '@/components/brand/DroppingSoon'
import CatalogHeader from '@/components/shop/CatalogHeader'
import { getProductsByCategory } from '@/lib/queries/products'
import { NATIONWIDE_DELIVERY_LIVE } from '@/lib/store-status'

interface Props {
  /** products.category value, e.g. APPAREL */
  category: string
  /** Display title, e.g. "Apparel" */
  title: string
  blurb: string
  /** Third header stat — defaults to in-stock; footwear shows pre-order status. */
  status?: { n: string; l: string }
  /** Line under the grid. */
  footnote?: string
}

/**
 * Product grid for one category. Falls back to the "Dropping Soon" page
 * while the category has no active products.
 */
export default async function CategoryPage({
  category,
  title,
  blurb,
  status = { n: 'IN', l: 'STOCK · SHIPS NOW' },
  footnote = NATIONWIDE_DELIVERY_LIVE
    ? 'FREE DELIVERY IN ENNERDALE · NATIONWIDE WITH THE COURIER GUY'
    : 'BORN IN ENNERDALE · FREE HOME-TOWN DELIVERY · NATIONWIDE COMING SOON',
}: Props) {
  const products = await getProductsByCategory(category)

  if (products.length === 0) {
    return <DroppingSoon title={title} eyebrow={`Rouge Rabbit · ${title}`} />
  }

  const pieces = new Set(products.map((p) => p.productId)).size

  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <CatalogHeader
        crumb={`SHOP — ${title.toUpperCase()}`}
        title={`${title.toUpperCase()}/`}
        accent="26"
        blurb={blurb}
        stats={[
          { n: String(pieces).padStart(2, '0'), l: 'PIECES' },
          { n: String(products.length).padStart(2, '0'), l: 'COLOURWAYS' },
          status,
        ]}
      />

      <section style={{ borderBottom: '1px solid #3A3A3C', padding: '40px' }} className="rr-catalog-grid-pad">
        <div className="rr-3col-grid">
          {products.map((p, i) => (
            <Link
              key={p.colourwayId ?? `${p.productId}-${i}`}
              href={`/shop/${p.slug}${p.colourwayId ? `?colour=${p.colourwayId}` : ''}`}
              style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}
            >
              <ProductCard
                product={p}
                mediaHeight={420}
                indexLabel={`R/${String(i + 1).padStart(3, '0')}`}
              />
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: '56px 40px', textAlign: 'center' }}>
        <div className="rr-mono" style={{ opacity: 0.6, letterSpacing: '0.12em', fontSize: 12, lineHeight: 1.9 }}>
          {footnote}
        </div>
      </section>

      <Footer />
    </div>
  )
}
