import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import DroppingSoon from '@/components/brand/DroppingSoon'
import CatalogHeader from '@/components/shop/CatalogHeader'
import { getDrops, dropHref } from '@/lib/queries/collections'
import type { Collection } from '@/types'

export const metadata: Metadata = {
  title: 'Drops — Rouge Rabbit',
  description: 'Every Rouge Rabbit drop and collab — the visuals, the story and the pieces.',
}

// Collections (and their status) come from Supabase.
export const revalidate = 300

function DropTile({ drop, hero = false }: { drop: Collection; hero?: boolean }) {
  const soon = drop.status === 'coming_soon'
  return (
    <Link
      href={dropHref(drop)}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        minHeight: hero ? 'clamp(420px, 60vh, 640px)' : 380,
        padding: hero ? 'clamp(24px, 4vw, 56px)' : 28,
        background: '#141416', color: '#E6E6E6', textDecoration: 'none', overflow: 'hidden',
      }}
    >
      {drop.hero_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={drop.hero_image}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: soon ? 0.35 : 0.7 }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(15,15,16,.9))' }} />
      <div style={{ position: 'relative' }}>
        <span className="rr-overline" style={{ color: '#D90017' }}>
          [ {soon ? 'COMING SOON' : drop.kind === 'collab' ? 'COLLAB · LIVE' : 'DROP · LIVE'} ]
        </span>
        <h2 className="rr-display" style={{ fontSize: hero ? 'clamp(64px, 11vw, 160px)' : 72, lineHeight: 0.88, margin: '14px 0 0' }}>
          {drop.name}
        </h2>
        {drop.tagline && (
          <div className="rr-mono" style={{ marginTop: 14, color: '#A6A6A8' }}>{drop.tagline}</div>
        )}
        <div className="rr-mono" style={{ marginTop: 18, color: '#E6E6E6' }}>
          {soon ? 'GET THE STORY FIRST →' : 'SEE THE DROP →'}
        </div>
      </div>
    </Link>
  )
}

export default async function DropsPage() {
  const drops = await getDrops()
  if (drops.length === 0) {
    return <DroppingSoon title="Drops" eyebrow="Rouge Rabbit · Drops" />
  }

  const [hero, ...rest] = drops
  const live = drops.filter((d) => d.status === 'live').length
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <CatalogHeader
        crumb="DROPS"
        title="DROPS/"
        blurb="Every Rouge Rabbit drop and collab — the visuals, the story and the pieces. Members hear first."
        stats={[
          { n: pad(live), l: 'LIVE' },
          { n: pad(drops.length - live), l: 'COMING SOON' },
        ]}
      />

      <section style={{ borderBottom: '1px solid #3A3A3C' }}>
        <DropTile drop={hero} hero />
      </section>

      {rest.length > 0 && (
        <section style={{ borderBottom: '1px solid #3A3A3C', padding: 40 }} className="rr-catalog-grid-pad">
          {/* auto-fit so two teasers fill the row instead of leaving an empty third cell */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: '#3A3A3C' }}>
            {rest.map((d) => <DropTile key={d.id} drop={d} />)}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
