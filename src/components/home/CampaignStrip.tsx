export default function CampaignStrip() {
  return (
    <section
      style={{
        position: 'relative', height: 620,
        background: '#1E1E20', overflow: 'hidden',
        borderTop: '1px solid #3A3A3C', borderBottom: '1px solid #3A3A3C',
      }}
    >
      <div className="rr-stripe-bg" style={{ position: 'absolute', inset: 0 }} />
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
        }}
      >
        {/* Left — editorial image */}
        <div style={{ borderRight: '1px solid #3A3A3C', position: 'relative', overflow: 'hidden' }}>
          <img
            src="/uploads/editorial-campaign-03.png"
            alt="Rouge Rabbit Editorial Campaign 03"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
          <div className="rr-plus" style={{ top: 20, left: 20 }} />
          <div className="rr-plus" style={{ bottom: 20, right: 20 }} />
          <div style={{ position: 'absolute', bottom: 24, left: 30 }}>
            <div className="rr-mono" style={{ color: '#A6A6A8' }}>EDITORIAL · CAMPAIGN 03</div>
          </div>
        </div>

        {/* Right — manifesto copy */}
        <div
          style={{
            padding: '80px 80px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            background: '#0F0F10',
          }}
        >
          <span className="rr-overline" style={{ color: '#D90017' }}>[ MANIFESTO · 002 ]</span>
          <h2
            className="rr-display"
            style={{ fontSize: 128, margin: '20px 0 28px', color: '#E6E6E6', lineHeight: 0.88 }}
          >
            NOT FOR<br />EVERYONE.
          </h2>
          <p style={{ color: '#A6A6A8', fontSize: 15, lineHeight: 1.7, maxWidth: 460 }}>
            We don&apos;t chase the algorithm. We don&apos;t make safe. Rouge Rabbit is for the kids in the back of the
            room who already know exactly who they are. Wear it loud. Or don&apos;t wear it at all.
          </p>
          <div style={{ marginTop: 36 }}>
            <button className="rr-btn rr-btn--ghost">READ THE MANIFESTO →</button>
          </div>
        </div>
      </div>
    </section>
  )
}
