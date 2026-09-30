'use client'

import SubscribeButton from '@/components/brand/SubscribeButton'

const INSTAGRAM_URL = 'https://www.instagram.com/rougerabbit.za'

// Street wall — 6 tiles. pos keeps faces in frame on the square crop.
const STREET_POSTS = [
  { src: '/assets/street/street-01.jpg', alt: 'Paint Shop Overspray tee on the street', pos: 'center 12%' },
  { src: '/assets/street/street-02.jpg', alt: 'Paint Shop tee back print — Colour outside the lines', pos: 'center 40%' },
  { src: '/assets/street/street-03.jpg', alt: 'Bagged League x Rouge Rabbit Paint Shop Splash tee', pos: 'center 5%' },
  { src: '/assets/street/street-04.jpg', alt: 'Rouge Rabbit 5-panel cap in Snow', pos: 'center 30%' },
  { src: '/assets/street/street-05.jpg', alt: 'Air Down tee at the Bagged League x Rouge Rabbit garage', pos: 'center 15%' },
  { src: '/assets/street/street-06.jpg', alt: 'Rouge Rabbit 5-panel cap in Cardinal', pos: 'center' },
]

export default function SplitCTA() {
  return (
    <section
      className="rr-split-cta"
      style={{ borderBottom: '1px solid #3A3A3C' }}
    >
      {/* Left — members signup */}
      <div
        className="rr-split-left-pad"
        style={{
          background: '#D90017',
          color: '#E6E6E6',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span className="rr-overline" style={{ color: '#E6E6E6' }}>[ MEMBERS · ONLY ]</span>
        <h2
          className="rr-display"
          style={{ fontSize: 'clamp(56px, 7vw, 96px)', margin: '20px 0 24px', lineHeight: 0.9 }}
        >
          GET IN<br />EARLY.
        </h2>
        <p style={{ maxWidth: 360, fontSize: 14, lineHeight: 1.7, opacity: 0.9 }}>
          48-hour early access to every drop. Numbered pairs reserved. No spam, no noise.
        </p>
        <div style={{ marginTop: 36 }}>
          <SubscribeButton source="homepage" tone="onRed" label="GET IN EARLY" />
        </div>
        {/* Ghost R */}
        <div
          style={{
            position: 'absolute', right: -60, bottom: -100,
            fontFamily: 'var(--font-display)', fontSize: 380,
            color: 'rgba(0,0,0,.18)', lineHeight: 1, pointerEvents: 'none',
          }}
        >
          R
        </div>
      </div>

      {/* Right — IG feed */}
      <div
        className="rr-stripe-bg rr-split-right-pad"
        style={{
          position: 'relative',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          gap: 32,
        }}
      >
        <div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="rr-overline" style={{ textDecoration: 'none' }}>
            [ FROM THE FEED · @ROUGERABBIT.ZA ]
          </a>
          <h2
            className="rr-display"
            style={{ fontSize: 'clamp(44px, 5vw, 76px)', margin: '20px 0 12px', color: '#E6E6E6' }}
          >
            SEEN IN<br />THE STREETS.
          </h2>
          <p style={{ color: '#A6A6A8', fontSize: 13, maxWidth: 400, lineHeight: 1.7 }}>
            Tag your fit with #ROUGEINMOTION &amp; #WEARINGROUGE for a chance to land on the wall.
          </p>
        </div>
        <div className="rr-ig-grid">
          {STREET_POSTS.map((post, idx) => (
            <a
              key={post.src}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${post.alt} — view on Instagram`}
              style={{
                aspectRatio: '1',
                position: 'relative',
                border: '1px solid #3A3A3C',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#0a0a0a',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img') as HTMLImageElement
                if (img) { img.style.transform = 'scale(1.08)'; img.style.filter = 'grayscale(0%)' }
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img') as HTMLImageElement
                if (img) { img.style.transform = 'scale(1)'; img.style.filter = 'grayscale(15%)' }
              }}
            >
              <img
                src={post.src}
                alt={post.alt}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: post.pos,
                  transition: 'transform .6s cubic-bezier(.2,.7,.2,1), filter .4s ease',
                  filter: 'grayscale(15%)',
                }}
              />
              <div
                style={{
                  position: 'absolute', top: 6, left: 6,
                  color: '#E6E6E6',
                  fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em',
                  textShadow: '0 1px 4px rgba(0,0,0,.6)',
                  background: 'rgba(15,15,16,.45)', padding: '2px 4px',
                }}
              >
                IG/{String(idx + 1).padStart(2, '0')}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
