'use client'

import { useState } from 'react'

export default function SplitCTA() {
  const [email, setEmail] = useState('')

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
        <div style={{ marginTop: 36, display: 'flex', maxWidth: 460 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR.EMAIL@HERE"
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,.5)',
              borderRight: 'none',
              padding: '16px 18px',
              color: '#E6E6E6',
              fontFamily: 'var(--font-mono)',
              fontSize: 11, letterSpacing: '.18em',
              textTransform: 'uppercase', outline: 'none',
              minWidth: 0,
            }}
          />
          <button
            style={{
              background: '#0F0F10', color: '#E6E6E6', border: 'none',
              padding: '0 22px', fontFamily: 'var(--font-mono)',
              fontSize: 11, letterSpacing: '.22em', cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            JOIN →
          </button>
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
          <span className="rr-overline">[ FROM THE FEED · @ROUGE.RABBIT ]</span>
          <h2
            className="rr-display"
            style={{ fontSize: 'clamp(44px, 5vw, 76px)', margin: '20px 0 12px', color: '#E6E6E6' }}
          >
            SEEN IN<br />THE STREETS.
          </h2>
          <p style={{ color: '#A6A6A8', fontSize: 13, maxWidth: 400, lineHeight: 1.7 }}>
            Tag your fit with #ROUGEONFOOT for a chance to land on the wall.
          </p>
        </div>
        <div className="rr-ig-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <a
              key={i}
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
                src={`/assets/ig-0${i}.png`}
                alt={`Rouge Rabbit IG post ${i}`}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
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
                }}
              >
                IG/{String(i).padStart(2, '0')}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
