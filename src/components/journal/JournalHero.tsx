'use client'

import GalaxyQuotes from './GalaxyQuotes'

export default function JournalHero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '80px 40px',
        background: '#0F0F10',
        overflow: 'hidden',
      }}
    >
      {/* City night background — place your photo at /public/assets/hero-city-night.jpg */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/assets/hero-city-night.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 0.45,
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

      {/* Floating community quotes */}
      <GalaxyQuotes />

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
        <p
          className="rr-mono"
          style={{ color: '#D90017', fontSize: 11, letterSpacing: '0.28em', marginBottom: 28 }}
        >
          WELCOME TO
        </p>

        <h1
          className="rr-display"
          style={{
            fontSize: 'clamp(80px, 16vw, 200px)',
            lineHeight: 0.86,
            color: '#E6E6E6',
            margin: '0 0 36px',
          }}
        >
          THE
          <br />
          RABBIT
          <br />
          RUN
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: '#A6A6A8',
            lineHeight: 1.8,
            maxWidth: 380,
            margin: '0 0 10px',
          }}
        >
          The stories, voices and culture behind Rouge Rabbit.
        </p>

        <p
          className="rr-mono"
          style={{ fontSize: 11, color: '#D90017', letterSpacing: '0.18em', marginBottom: 44 }}
        >
          Built in South Africa. Worn everywhere.
        </p>

        <a href="#join" className="rr-btn rr-btn--ghost" style={{ letterSpacing: '0.18em' }}>
          JOIN THE MOVEMENT →
        </a>
      </div>
    </section>
  )
}
