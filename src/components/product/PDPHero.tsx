'use client'

import { useState, useEffect } from 'react'
import Arrow from '@/components/brand/Arrow'
import { COLOURWAYS, SIZES } from '@/data/products'
import type { Colourway } from '@/types'

const VIEWS = ['FRONT', 'SIDE', 'BACK', 'TOP'] as const
type View = typeof VIEWS[number]

// One image per colourway per view — swap in real angle shots when available
const VIEW_IMAGES: Record<string, Record<View, string>> = {
  obs: { FRONT: '/assets/shoe-black-front.png', SIDE: '/assets/shoe-black.jpg', BACK: '/assets/shoe-black-rear.png', TOP: '/assets/shoe-black-top.png' },
  car: { FRONT: '/assets/shoe-red-front.png', SIDE: '/assets/shoe-red.jpg', BACK: '/assets/shoe-red-rear.png', TOP: '/assets/shoe-red-top.png' },
  ice: { FRONT: '/assets/shoe-blue-front.png', SIDE: '/assets/shoe-blue.jpg', BACK: '/assets/shoe-blue-rear.png', TOP: '/assets/shoe-blue-top.png' },
  ros: { FRONT: '/assets/shoe-pink-front.png', SIDE: '/assets/shoe-pink.jpg', BACK: '/assets/shoe-pink-rear.png', TOP: '/assets/shoe-pink-top.png' },
}

const META_ROWS = [
  ['SHIPPING', 'DELIVERY COMING SOON · PRE-ORDER NOW'],
  ['RETURNS',  '30 DAYS · NO QUESTIONS'],
  ['EDITION',  'NUMBERED · 250 PAIRS'],
  ['RELEASE',  'JUL 31 · 2026'],
]

export default function PDPHero() {
  const [cw, setCw] = useState<Colourway>(COLOURWAYS[0])
  const [sz, setSz] = useState('US 9')
  const [view, setView] = useState<View>('FRONT')
  const [zoomed, setZoomed] = useState(false)

  const activeImage = VIEW_IMAGES[cw.id]?.[view] ?? cw.image

  useEffect(() => {
    if (!zoomed) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomed(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [zoomed])

  return (
    <>
    {zoomed && (
      <div
        onClick={() => setZoomed(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'zoom-out',
        }}
      >
        <div style={{ position: 'absolute', top: 28, right: 36 }}>
          <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 12, letterSpacing: '.2em' }}>
            ESC TO CLOSE
          </span>
        </div>
        <div style={{ position: 'absolute', top: 28, left: 36 }}>
          <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 11, letterSpacing: '.2em' }}>
            ROUGE 01 · {cw.name} · {view}
          </span>
        </div>
        <img
          src={activeImage}
          alt={`Rouge 01 ${cw.name} — ${view}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '88vw', maxHeight: '88vh',
            objectFit: 'contain',
            cursor: 'default',
          }}
        />
      </div>
    )}
    <section
      className="rr-pdp-grid"
      style={{ borderBottom: '1px solid #3A3A3C' }}
    >
      {/* View selector rail */}
      <div
        className="rr-pdp-thumb-rail"
        style={{
          borderRight: '1px solid #3A3A3C',
          padding: '30px 8px',
          flexDirection: 'column', gap: 8,
        }}
      >
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}
          >
            <div className={`rr-thumb ${view === v ? 'rr-thumb--active' : ''}`} style={{ width: '100%' }}>
              <img src={VIEW_IMAGES[cw.id][v]} alt={v} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.14em',
                color: view === v ? '#D90017' : '#A6A6A8',
              }}
            >
              {v}
            </span>
          </button>
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
          src={activeImage}
          alt={`Rouge 01 ${cw.name} — ${view}`}
          onClick={() => setZoomed(true)}
          style={{ width: '75%', height: '75%', objectFit: 'contain', cursor: 'zoom-in' }}
        />
        <div className="rr-plus" style={{ top: 18, left: 18 }} />
        <div className="rr-plus" style={{ top: 18, right: 18 }} />
        <div className="rr-plus" style={{ bottom: 18, left: 18 }} />
        <div className="rr-plus" style={{ bottom: 18, right: 18 }} />
        <div style={{ position: 'absolute', top: 18, left: 40, color: '#0F0F10' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em' }}>
            VIEW · {view}
          </div>
        </div>
        <div
          style={{ position: 'absolute', bottom: 18, right: 40, color: '#0F0F10', cursor: 'zoom-in' }}
          onClick={() => setZoomed(true)}
        >
          <span className="rr-chip" style={{ borderColor: '#0F0F10', color: '#0F0F10' }}>+ ZOOM</span>
        </div>
      </div>

      {/* Purchase column */}
      <div
        className="rr-pdp-purchase-col"
        style={{
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
          <span className="rr-display" style={{ fontSize: 44 }}>R1800</span>
          <span className="rr-mono">ZAR · TAX INCL.</span>
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
            <span>ADD TO BAG · R1800</span>
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
    </>
  )
}
