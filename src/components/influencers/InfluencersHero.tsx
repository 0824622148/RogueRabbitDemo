export default function InfluencersHero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '80px 40px',
        background: '#0F0F10',
        overflow: 'hidden',
      }}
    >
      {/* Background photo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/assets/influencers-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.55,
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(15,15,16,0.98) 0%, rgba(15,15,16,0.65) 45%, rgba(15,15,16,0.35) 100%)',
        }}
      />

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
        <p
          className="rr-mono"
          style={{ color: '#D90017', fontSize: 11, letterSpacing: '0.28em', marginBottom: 28 }}
        >
          ROUGE RABBIT · INFLUENCERS
        </p>

        <h1
          className="rr-display"
          style={{
            fontSize: 'clamp(72px, 14vw, 188px)',
            lineHeight: 0.86,
            color: '#E6E6E6',
            margin: '0 0 36px',
          }}
        >
          THE
          <br />
          COLLECTIVE
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: '#A6A6A8',
            lineHeight: 1.8,
            maxWidth: 460,
            margin: '0 0 10px',
          }}
        >
          Four creators. One rabbit. We&apos;re partnering with a new generation
          of ambassadors — get to know the personalities behind the movement
          while their content cooks behind the scenes.
        </p>

        <p
          className="rr-mono"
          style={{ fontSize: 11, color: '#D90017', letterSpacing: '0.18em', marginBottom: 44 }}
        >
          Testimonials dropping soon.
        </p>

        <a href="#collabs" className="rr-btn rr-btn--ghost" style={{ letterSpacing: '0.18em' }}>
          SEE THE COLLABS ↓
        </a>
      </div>
    </section>
  )
}
