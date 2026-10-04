import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import ProductCard from '@/components/brand/ProductCard'
import DroppingSoon from '@/components/brand/DroppingSoon'
import CollectionHero from '@/components/drops/CollectionHero'
import { getCollection, dropHref } from '@/lib/queries/collections'
import type { Product } from '@/types'

// One page per collection — top-level drops (Bagged League, Caesar, Signal) and
// sub-collections (Air Down, Paint Shop). Content lives in the collections table.

type Params = Promise<{ slug: string }>

export const revalidate = 300

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const detail = await getCollection(slug)
  if (!detail) return { title: 'Not found — Rouge Rabbit' }
  const { collection } = detail
  return {
    title: `${collection.name} — Rouge Rabbit`,
    description: collection.tagline ?? `${collection.name} — a Rouge Rabbit drop.`,
  }
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="rr-3col-grid">
      {products.map((p, i) => (
        <Link
          key={p.colourwayId ?? `${p.productId}-${i}`}
          href={`/shop/${p.slug}${p.colourwayId ? `?colour=${p.colourwayId}` : ''}`}
          style={{ cursor: 'pointer', display: 'block', textDecoration: 'none' }}
        >
          <ProductCard product={p} mediaHeight={420} indexLabel={`R/${String(i + 1).padStart(3, '0')}`} />
        </Link>
      ))}
    </div>
  )
}

export default async function DropPage({ params }: { params: Params }) {
  const { slug } = await params
  const detail = await getCollection(slug)
  if (!detail) notFound()

  const { collection, parent, children, products } = detail

  if (collection.status === 'coming_soon') {
    return <DroppingSoon title={collection.name} eyebrow={`Rouge Rabbit · ${parent ? parent.name : 'Drops'}`} />
  }

  const story = (collection.story ?? '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
  const sections = children.filter((c) => c.products.length > 0)

  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />

      <div
        className="rr-breadcrumb"
        style={{ padding: '20px 40px', display: 'flex', gap: 14, alignItems: 'center', borderBottom: '1px solid #3A3A3C' }}
      >
        <Link href="/drops" className="rr-mono" style={{ textDecoration: 'none', color: 'inherit' }}>DROPS</Link>
        {parent && (
          <>
            <span style={{ color: '#3A3A3C' }}>/</span>
            <Link href={dropHref(parent)} className="rr-mono" style={{ textDecoration: 'none', color: 'inherit' }}>
              {parent.name}
            </Link>
          </>
        )}
        <span style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono" style={{ color: '#E6E6E6' }}>{collection.name}</span>
      </div>

      {/* Hero — panelled campaign photos when set; otherwise one image with the
          logo (once supplied) or the name over it */}
      {collection.hero_panels?.length ? (
        <CollectionHero
          panels={collection.hero_panels}
          eyebrow={collection.kind === 'collab' ? 'THE COLLAB' : 'THE DROP'}
          title={collection.hero_title ?? collection.name}
          subline={collection.tagline}
          ctaHref="#shop"
        />
      ) : (
        <section
          style={{
            position: 'relative', minHeight: 'clamp(420px, 70vh, 760px)', overflow: 'hidden',
            display: 'flex', alignItems: 'flex-end', padding: 'clamp(24px, 4vw, 56px)',
            borderBottom: '1px solid #3A3A3C', background: '#141416',
          }}
        >
          {collection.hero_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={collection.hero_image}
              alt={collection.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(15,15,16,.92))' }} />
          <div style={{ position: 'relative' }}>
            <span className="rr-overline" style={{ color: '#D90017' }}>
              [ {collection.tagline ?? (collection.kind === 'collab' ? 'COLLAB' : 'DROP')} ]
            </span>
            {collection.logo_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={collection.logo_image}
                alt={collection.name}
                style={{ display: 'block', maxWidth: 'min(560px, 80vw)', maxHeight: 220, marginTop: 18 }}
              />
            ) : (
              <h1 className="rr-display" style={{ fontSize: 'clamp(72px, 13vw, 200px)', lineHeight: 0.85, margin: '16px 0 0' }}>
                {collection.name}
              </h1>
            )}
          </div>
        </section>
      )}

      {story.length > 0 && (
        <section className="rr-catalog-pad" style={{ borderBottom: '1px solid #3A3A3C' }}>
          <div style={{ maxWidth: 720 }}>
            <span className="rr-overline">[ THE STORY ]</span>
            {story.map((para, i) => (
              <p key={i} style={{ color: '#A6A6A8', fontSize: 16, lineHeight: 1.8, margin: '20px 0 0' }}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {/* Sub-collections, each with its pieces */}
      {sections.map(({ collection: sub, products: subProducts }, i) => (
        <section key={sub.id} id={i === 0 ? 'shop' : undefined} style={{ borderBottom: '1px solid #3A3A3C', scrollMarginTop: 70 }}>
          <div style={{ padding: '40px 40px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            <h2 className="rr-display" style={{ fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 0.9, margin: 0 }}>{sub.name}</h2>
            <Link href={dropHref(sub)} className="rr-mono" style={{ color: '#D90017', textDecoration: 'none' }}>
              VIEW {sub.name} →
            </Link>
          </div>
          <div style={{ padding: 40 }} className="rr-catalog-grid-pad">
            <ProductGrid products={subProducts} />
          </div>
        </section>
      ))}

      {products.length > 0 && (
        <section id={sections.length === 0 ? 'shop' : undefined} style={{ borderBottom: '1px solid #3A3A3C', scrollMarginTop: 70 }}>
          {sections.length > 0 && (
            <div style={{ padding: '40px 40px 0' }}>
              <h2 className="rr-display" style={{ fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 0.9, margin: 0 }}>
                ALSO IN THE COLLECTION
              </h2>
            </div>
          )}
          <div style={{ padding: 40 }} className="rr-catalog-grid-pad">
            <ProductGrid products={products} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
