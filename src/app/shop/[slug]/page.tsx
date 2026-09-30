import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import ApparelPDP from '@/components/product/ApparelPDP'
import { getProduct } from '@/lib/queries/products'

// Product pages for in-stock apparel and accessories. ROUGE 01 has its own
// static route (/shop/rouge-01), which takes precedence over this one.

type Params = Promise<{ slug: string }>
type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Not found — Rouge Rabbit' }
  return {
    title: `${product.name} — Rouge Rabbit`,
    description: `${product.name} by Rouge Rabbit. In stock now — free delivery in Ennerdale.`,
  }
}

export default async function ShopProductPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const product = await getProduct(slug)

  // Footwear is pre-order only and lives on its own page.
  if (!product || String(product.category ?? '').toUpperCase() === 'FOOTWEAR' || product.colourways.length === 0) {
    notFound()
  }

  const initialColourwayId = typeof query.colour === 'string' ? query.colour : undefined
  const categoryHref = String(product.category).toUpperCase() === 'ACCESSORIES' ? '/shop/accessories' : '/shop/apparel'

  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />

      <div
        className="rr-breadcrumb"
        style={{
          padding: '20px 40px',
          display: 'flex', gap: 14, alignItems: 'center',
          borderBottom: '1px solid #3A3A3C',
        }}
      >
        <Link href="/shop" className="rr-mono" style={{ textDecoration: 'none', color: 'inherit' }}>SHOP</Link>
        <span style={{ color: '#3A3A3C' }}>/</span>
        <Link href={categoryHref} className="rr-mono rr-breadcrumb-hide" style={{ textDecoration: 'none', color: 'inherit' }}>
          {product.category}
        </Link>
        <span className="rr-breadcrumb-hide" style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono" style={{ color: '#E6E6E6' }}>{product.name}</span>
      </div>

      <ApparelPDP key={initialColourwayId ?? 'default'} product={product} initialColourwayId={initialColourwayId} />
      <Footer />
    </div>
  )
}
