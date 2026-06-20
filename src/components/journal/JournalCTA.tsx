import Image from 'next/image'

export default function JournalCTA() {
  return (
    <section
      id="join"
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
          style={{
            fontSize: 9,
            letterSpacing: '0.32em',
            color: '#A6A6A8',
            marginBottom: 36,
          }}
        >
          · HIDDEN MESSAGE FOUND ·
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
          JOIN THE
          <br />
          <span style={{ color: '#D90017' }}>RABBIT RUN</span>
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: '#E6E6E6',
            lineHeight: 1.7,
            margin: '0 0 10px',
            maxWidth: 360,
          }}
        >
          Become part of South Africa&apos;s fastest growing sneaker movement.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: '#A6A6A8',
            lineHeight: 1.7,
            margin: '0 0 44px',
            maxWidth: 360,
          }}
        >
          Not everyone discovers Rouge Rabbit. Those who do, stay.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="#" className="rr-btn" style={{ letterSpacing: '0.16em' }}>
            JOIN THE COMMUNITY →
          </a>
          <a href="#" className="rr-btn rr-btn--ghost" style={{ letterSpacing: '0.16em' }}>
            GET EARLY ACCESS →
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
        {/* Background image with heavy dark overlay for silhouette effect */}
        <Image
          src="/uploads/editorial-campaign-03.png"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'top', filter: 'brightness(0.18)' }}
          aria-hidden="true"
        />

        {/* Gradient vignette left-to-right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #0F0F10 0%, transparent 60%)',
          }}
        />

        {/* YOU'RE EARLY label */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            textAlign: 'right',
          }}
        >
          <span
            className="rr-mono"
            style={{ fontSize: 9, letterSpacing: '0.28em', color: '#3A3A3C' }}
          >
            YOU&apos;RE EARLY.
          </span>
        </div>
      </div>
    </section>
  )
}
