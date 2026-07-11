export default function CatalogHeader() {
  return (
    <section
      className="rr-catalog-pad"
      style={{ borderBottom: '1px solid #3A3A3C' }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <span className="rr-mono">[ INDEX ]</span>
        <span className="rr-mono">HOME</span>
        <span style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono" style={{ color: '#E6E6E6' }}>SHOP — ALL</span>
      </div>
      <div className="rr-catalog-header">
        <h1
          className="rr-display rr-catalog-title"
          style={{ margin: 0, lineHeight: 0.85, letterSpacing: '-.01em' }}
        >
          CATALOG/<span style={{ color: '#D90017' }}>26</span>
        </h1>
        <div>
          <p style={{ color: '#A6A6A8', fontSize: 14, lineHeight: 1.7, maxWidth: 460 }}>
            The Rouge 1 — 5 colourways, one silhouette. Built for the ones who move without
            permission. Apparel and accessories dropping soon. Stay close.
          </p>
          <div style={{ display: 'flex', gap: 30, marginTop: 24, flexWrap: 'wrap' }}>
            <StatItem n="05" l="COLOURWAYS" />
            <StatItem n="01" l="DROP · ACTIVE" />
            <StatItem n="08" l="SIZES · UNISEX" />
          </div>
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
