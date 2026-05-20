export default function CatalogHeader() {
  return (
    <section
      style={{
        position: 'relative',
        padding: '70px 40px 50px',
        borderBottom: '1px solid #3A3A3C',
      }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 24 }}>
        <span className="rr-mono">[ INDEX ]</span>
        <span className="rr-mono">HOME</span>
        <span style={{ color: '#3A3A3C' }}>/</span>
        <span className="rr-mono" style={{ color: '#E6E6E6' }}>SHOP — ALL</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          alignItems: 'flex-end',
          gap: 40,
        }}
      >
        <h1
          className="rr-display"
          style={{ fontSize: 220, margin: 0, lineHeight: 0.85, letterSpacing: '-.01em' }}
        >
          CATALOG/<span style={{ color: '#D90017' }}>26</span>
        </h1>
        <div>
          <p style={{ color: '#A6A6A8', fontSize: 14, lineHeight: 1.7, maxWidth: 460 }}>
            Every piece in the active roster. 38 styles across footwear, apparel and accessories.
            Numbered and dispatched from the warehouse the day it ships.
          </p>
          <div style={{ display: 'flex', gap: 30, marginTop: 24 }}>
            <StatItem n="38" l="STYLES" />
            <StatItem n="04" l="DROPS · ACTIVE" />
            <StatItem n="07" l="SIZES · UNISEX" />
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
