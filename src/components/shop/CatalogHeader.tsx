interface CatalogHeaderProps {
  /** Breadcrumb label after HOME /, e.g. "SHOP — ALL". */
  crumb?: string
  /** Big title; the accent is rendered in red after it. */
  title?: string
  accent?: string
  blurb?: string
  stats?: { n: string; l: string }[]
}

export default function CatalogHeader({
  crumb = 'SHOP — ALL',
  title = 'CATALOG/',
  accent = '26',
  blurb = 'Footwear, apparel and accessories. The Bagged League × Rouge Rabbit tees and caps are ' +
    'in stock now — free delivery in Ennerdale. Rouge 01 sneakers coming soon.',
  stats = [
    { n: '05', l: 'COLOURWAYS' },
    { n: '01', l: 'DROP · ACTIVE' },
    { n: '08', l: 'SIZES · UNISEX' },
  ],
}: CatalogHeaderProps) {
  return (
    <section
      className="rr-catalog-pad"
      style={{ borderBottom: '1px solid #3A3A3C' }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <span className="rr-mono">[ INDEX ]</span>
        <span className="rr-mono">HOME</span>
        <span style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono" style={{ color: '#E6E6E6' }}>{crumb}</span>
      </div>
      <div className="rr-catalog-header">
        <h1
          className="rr-display rr-catalog-title"
          style={{ margin: 0, lineHeight: 0.85, letterSpacing: '-.01em' }}
        >
          {title}<span style={{ color: '#D90017' }}>{accent}</span>
        </h1>
        <div>
          <p style={{ color: '#A6A6A8', fontSize: 14, lineHeight: 1.7, maxWidth: 460 }}>
            {blurb}
          </p>
          {stats.length > 0 && (
            <div style={{ display: 'flex', gap: 30, marginTop: 24, flexWrap: 'wrap' }}>
              {stats.map((s) => <StatItem key={s.l} n={s.n} l={s.l} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function StatItem({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="rr-display" style={{ fontSize: 36, color: '#E6E6E6', lineHeight: 1 }}>{n}</div>
      <div className="rr-mono" style={{ marginTop: 4 }}>{l}</div>
    </div>
  )
}
