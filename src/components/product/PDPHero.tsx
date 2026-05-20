'use client'

import { useState } from 'react'
import Arrow from '@/components/brand/Arrow'
import { COLOURWAYS, SIZES } from '@/data/products'
import type { Colourway } from '@/types'

const THUMB_IMAGES = [
  '/assets/shoe-black.jpg',
  '/assets/shoe-red.jpg',
  '/assets/shoe-blue.jpg',
  '/assets/shoe-pink.jpg',
]

const META_ROWS = [
  ['SHIPPING', 'FREE EXPRESS · OVER $250'],
  ['RETURNS',  '30 DAYS · NO QUESTIONS'],
  ['EDITION',  'NUMBERED · 250 PAIRS'],
  ['RELEASE',  'MAR 14 · 2026'],
]

export default function PDPHero() {
  const [cw, setCw] = useState<Colourway>(COLOURWAYS[0])
  const [sz, setSz] = useState('US 9')
  const [thumb, setThumb] = useState(0)

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: '70px 1fr 1fr 460px',
        minHeight: 880,
        borderBottom: '1px solid #3A3A3C',
      }}
    >
      {/* Thumbnails rail */}
      <div
        style={{
          borderRight: '1px solid #3A3A3C',
          padding: '30px 12px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        {THUMB_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`rr-thumb ${thumb === i ? 'rr-thumb--active' : ''}`}
            onClick={() => { setThumb(i); if (i < COLOURWAYS.length) setCw(COLOURWAYS[i]) }}
          >
            <img src={i === 0 ? cw.image : src} alt="" />
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div className="rr-vtext" style={{ alignSelf: 'center' }}>
          R/001 · {cw.name}
        </div>
      </div>

      {/* Main image */}
      <div
        style={{
          background: '#fff', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRight: '1px solid #3A3A3C',
        }}
      >
        <img
          src={cw.image}
          alt={`Rouge 01 ${cw.name}`}
          style={{ width: '92%', height: '92%', objectFit: 'contain', transform: 'rotate(-4deg)' }}
        />
        <div className="rr-plus" style={{ top: 18, left: 18 }} />
        <div className="rr-plus" style={{ top: 18, right: 18 }} />
        <div className="rr-plus" style={{ bottom: 18, left: 18 }} />
        <div className="rr-plus" style={{ bottom: 18, right: 18 }} />
        <div style={{ position: 'absolute', top: 18, left: 40, color: '#0F0F10' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em' }}>VIEW · 01 / 04</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em', marginTop: 4 }}>3/4 ROTATION</div>
        </div>
        <div style={{ position: 'absolute', bottom: 18, right: 40, color: '#0F0F10' }}>
          <span className="rr-chip" style={{ borderColor: '#0F0F10', color: '#0F0F10' }}>+ ZOOM</span>
        </div>
      </div>

      {/* Lifestyle image */}
      <div
        style={{
          background: '#0a0a0a', position: 'relative', overflow: 'hidden',
          borderRight: '1px solid #3A3A3C',
        }}
      >
        <img
          src="/uploads/r-011.png"
          alt="Rouge 01 Editorial Lifestyle"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.88)',
          }}
        />
        <div className="rr-plus" style={{ top: 18, left: 18 }} />
        <div className="rr-plus" style={{ bottom: 18, right: 18 }} />
        <div style={{ position: 'absolute', bottom: 18, left: 30 }}>
          <div className="rr-mono" style={{ color: '#A6A6A8', fontSize: 9 }}>MODEL · 6&apos;1&quot; / WEARS US 10</div>
        </div>
      </div>

      {/* Purchase column */}
      <div
        style={{
          padding: '40px 36px',
          display: 'flex', flexDirection: 'column',
          background: '#0F0F10',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
          <span className="rr-overline" style={{ color: '#D90017' }}>DROP 003 · 001 OF 04</span>
          <span className="rr-mono">RR-01-{cw.id.toUpperCase()}</span>
        </div>

        <h1
          className="rr-display"
          style={{ fontSize: 76, margin: 0, lineHeight: 0.88, letterSpacing: '-.01em' }}
        >
          ROUGE 01<br /><span style={{ color: '#D90017' }}>{cw.name}.</span>
        </h1>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 24 }}>
          <span className="rr-display" style={{ fontSize: 44 }}>$240</span>
          <span className="rr-mono">USD · TAX INCL.</span>
        </div>

        {/* Colourway selector */}
        <div style={{ marginTop: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="rr-overline" style={{ color: '#E6E6E6' }}>COLOURWAY</span>
            <span className="rr-mono">{cw.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {COLOURWAYS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCw(c)}
                style={{
                  width: 54, height: 54, background: '#fff', padding: 4,
                  border: `1px solid ${cw.id === c.id ? '#D90017' : '#3A3A3C'}`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Size selector */}
        <div style={{ marginTop: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="rr-overline" style={{ color: '#E6E6E6' }}>SIZE · UNISEX US</span>
            <a className="rr-mono" style={{ color: '#E6E6E6', textDecoration: 'underline', cursor: 'pointer' }}>
              SIZE GUIDE
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {SIZES.map((s) => (
              <button
                key={s.v}
                onClick={() => !s.oos && setSz(s.v)}
                disabled={s.oos}
                className={`rr-size ${sz === s.v && !s.oos ? 'rr-size--active' : ''} ${s.oos ? 'rr-size--oos' : ''}`}
              >
                {s.v}
              </button>
            ))}
          </div>
          <div className="rr-mono" style={{ marginTop: 12, color: '#D90017' }}>
            ▲ ONLY 03 LEFT IN US 9
          </div>
        </div>

        {/* CTAs */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="rr-btn" style={{ justifyContent: 'space-between', padding: '20px 26px' }}>
            <span>ADD TO BAG · $240</span>
            <Arrow size={16} />
          </button>
          <button className="rr-btn rr-btn--ghost" style={{ justifyContent: 'center' }}>
            ♡ ADD TO WISHLIST
          </button>
        </div>

        {/* Meta rows */}
        <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', borderTop: '1px solid #3A3A3C' }}>
          {META_ROWS.map(([k, v]) => (
            <div
              key={k}
              style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '14px 0', borderBottom: '1px solid #3A3A3C',
              }}
            >
              <span className="rr-mono">{k}</span>
              <span className="rr-mono" style={{ color: '#E6E6E6' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
