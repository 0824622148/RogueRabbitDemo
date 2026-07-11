import Image from 'next/image'

export default function InfluencersCTA() {
  return (
    <section
      className="rr-journal-cta"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid #3A3A3C',
        minHeight: 480,
      }}
    >
      {/* Left: content */}
      <div
        className="rr-journal-cta-left"
        style={{
          padding: '80px 60px',
          borderRight: '1px solid #3A3A3C',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          className="rr-mono"
          style={{ fontSize: 9, letterSpacing: '0.32em', color: '#A6A6A8', marginBottom: 36 }}
        >
          · MORE DROPPING SOON ·
        </div>

        <h2
          className="rr-display"
          style={{
            fontSize: 'clamp(44px, 5.5vw, 80px)',
            lineHeight: 0.9,
            color: '#E6E6E6',
            margin: '0 0 36px',
          }}
        >
          FOLLOW THE
          <br />
          <span style={{ color: '#D90017' }}>MOVEMENT</span>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: '#E6E6E6',
            lineHeight: 1.7,
            margin: '0 0 10px',
            maxWidth: 380,
          }}
        >
          The testimonials are still in production. Follow along and you&apos;ll
          be first to see each collab go live.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: '#A6A6A8',
            lineHeight: 1.7,
            margin: '0 0 44px',
            maxWidth: 380,
          }}
        >
          Built in South Africa. Worn everywhere.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a
            href="https://www.instagram.com/rougerabbit.za"
            target="_blank"
            rel="noopener noreferrer"
            className="rr-btn"
            style={{ letterSpacing: '0.16em' }}
          >
            FOLLOW ON INSTAGRAM →
          </a>
        </div>
      </div>

      {/* Right: visual panel */}
      <div
        className="rr-journal-cta-visual"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#0A0A0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src="/assets/podcast-studio-outdoor.png"
          alt="Rouge Rabbit podcast studio activation"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.72)' }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #0F0F10 0%, rgba(15,15,16,0.15) 42%, transparent 70%)',
          }}
        />

        <div style={{ position: 'absolute', bottom: 32, right: 32, textAlign: 'right' }}>
          <span className="rr-mono" style={{ fontSize: 9, letterSpacing: '0.28em', color: '#3A3A3C' }}>
            YOU&apos;RE EARLY.
          </span>
        </div>
      </div>
    </section>
  )
}
