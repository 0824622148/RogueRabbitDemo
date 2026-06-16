'use client'

import { useState, useEffect, useRef } from 'react'
import Arrow from '@/components/brand/Arrow'
import type { ColourwayDB, Size } from '@/types'
import PreOrderModal from '@/components/shop/PreOrderModal'
import { useWishlist } from '@/context/WishlistContext'

const VIEWS = ['FRONT', 'SIDE', 'BACK', 'TOP'] as const
type View = typeof VIEWS[number]

const META_ROWS = [
  ['COLLECTION', 'ROSEBANK · V&A · GATEWAY'],
  ['DELIVERY',   'COMING SOON'],
  ['RETURNS',    '30 DAYS · NO QUESTIONS'],
  ['EDITION',    'NUMBERED · 250 PAIRS'],
  ['RELEASE',    'JUL 31 · 2026'],
]

interface Props {
  colourways: ColourwayDB[]
}

function ZoomModal({ src, alt, label, onClose }: { src: string; alt: string; label: string; onClose: () => void }) {
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setScale(s => Math.min(5, Math.max(1, s * (e.deltaY < 0 ? 1.12 : 0.9))))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const reset = () => { setScale(1); setPos({ x: 0, y: 0 }) }

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    e.preventDefault()
    setDragging(true)
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    const { mx, my, px, py } = dragOrigin.current
    setPos({ x: px + (e.clientX - mx), y: py + (e.clientY - my) })
  }

  const onMouseUp = () => setDragging(false)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ position: 'absolute', top: 28, left: 36 }}>
        <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 11, letterSpacing: '.2em' }}>
          {label}
        </span>
      </div>
      <div style={{ position: 'absolute', top: 28, right: 36, display: 'flex', gap: 28, alignItems: 'center' }}>
        <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 10, letterSpacing: '.18em' }}>
          SCROLL TO ZOOM · DRAG TO PAN · DBL-CLICK TO RESET
        </span>
        <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 10, letterSpacing: '.18em' }}>
          ESC TO CLOSE
        </span>
      </div>

      <div
        ref={containerRef}
        onClick={e => e.stopPropagation()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onDoubleClick={reset}
        style={{
          width: '88vw', height: '88vh', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: dragging ? 'grabbing' : scale > 1 ? 'grab' : 'zoom-in',
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            maxWidth: '100%', maxHeight: '100%',
            objectFit: 'contain',
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: dragging ? 'none' : 'transform 0.12s ease',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>

      {scale > 1 && (
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)' }}>
          <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 11, letterSpacing: '.2em' }}>
            {Math.round(scale * 10) / 10}×
          </span>
        </div>
      )}
    </div>
  )
}

const SIZE_GUIDE = {
  MALE: [
    { uk: 'UK 6',  eu: 'EU 39', cm: '24.0 cm' },
    { uk: 'UK 7',  eu: 'EU 40', cm: '25.0 cm' },
    { uk: 'UK 8',  eu: 'EU 41', cm: '26.0 cm' },
    { uk: 'UK 9',  eu: 'EU 42', cm: '27.0 cm' },
    { uk: 'UK 10', eu: 'EU 43', cm: '28.0 cm' },
    { uk: 'UK 11', eu: 'EU 44', cm: '29.0 cm' },
    { uk: 'UK 12', eu: 'EU 45', cm: '30.0 cm' },
    { uk: 'UK 13', eu: 'EU 46', cm: '31.0 cm' },
  ],
  FEMALE: [
    { uk: 'UK 4',  eu: 'EU 35', cm: '22.0 cm' },
    { uk: 'UK 5',  eu: 'EU 36', cm: '22.5 cm' },
    { uk: 'UK 6',  eu: 'EU 37', cm: '23.5 cm' },
    { uk: 'UK 7',  eu: 'EU 38', cm: '24.0 cm' },
    { uk: 'UK 8',  eu: 'EU 39', cm: '25.0 cm' },
    { uk: 'UK 9',  eu: 'EU 40', cm: '25.5 cm' },
    { uk: 'UK 10', eu: 'EU 41', cm: '26.5 cm' },
    { uk: 'UK 11', eu: 'EU 42', cm: '27.0 cm' },
  ],
}

function SizeGuideModal({ gender, onClose }: { gender: 'MALE' | 'FEMALE'; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const rows = SIZE_GUIDE[gender]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1E1E20', border: '1px solid #3A3A3C',
          width: '100%', maxWidth: 400, padding: '36px 32px',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: '#A6A6A8', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em' }}
        >
          ✕ CLOSE
        </button>

        <span className="rr-overline" style={{ color: '#D90017' }}>[ UK SIZE GUIDE · {gender} ]</span>
        <p style={{ color: '#A6A6A8', fontSize: 12, lineHeight: 1.7, margin: '12px 0 20px' }}>
          Measure your foot from heel to longest toe while standing. If between sizes, go up.
          The Rouge 01 runs true to size.
        </p>

        <div style={{ borderTop: '1px solid #3A3A3C' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 0', borderBottom: '1px solid #3A3A3C' }}>
            {['UK', 'EU', 'FOOT LENGTH'].map(h => (
              <span key={h} className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', letterSpacing: '.16em' }}>{h}</span>
            ))}
          </div>
          {rows.map(r => (
            <div key={r.uk} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 0', borderBottom: '1px solid #3A3A3C' }}>
              <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 11 }}>{r.uk}</span>
              <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 11 }}>{r.eu}</span>
              <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 11 }}>{r.cm}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PDPHero({ colourways }: Props) {
  const [cw, setCw] = useState<ColourwayDB>(colourways[0])
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE')
  const [sz, setSz] = useState('')
  const [view, setView] = useState<View>('FRONT')
  const [zoomed, setZoomed] = useState(false)
  const [sizeGuide, setSizeGuide] = useState(false)
  const [preOrder, setPreOrder] = useState(false)
  const { addItem, removeItem, isWishlisted } = useWishlist()

  const sizes: Size[] = cw.inventory
    .filter(i => i.gender === (gender === 'MALE' ? 'M' : 'F'))
    .map(i => ({ v: i.size_value, oos: !i.in_stock }))

  const activeImage = cw.images.find(i => i.view === view)?.url ?? cw.image

  return (
    <>
      {preOrder && (
        <PreOrderModal
          initialColourway={cw}
          initialSize={sz}
          initialGender={gender}
          colourways={colourways}
          onClose={() => setPreOrder(false)}
        />
      )}
      {sizeGuide && <SizeGuideModal gender={gender} onClose={() => setSizeGuide(false)} />}
      {zoomed && (
        <ZoomModal
          src={activeImage}
          alt={`Rouge 01 ${cw.name} — ${view}`}
          label={`ROUGE 01 · ${cw.name} · ${view}`}
          onClose={() => setZoomed(false)}
        />
      )}

      <section className="rr-pdp-grid" style={{ borderBottom: '1px solid #3A3A3C' }}>
        {/* View selector rail */}
        <div
          className="rr-pdp-thumb-rail"
          style={{ borderRight: '1px solid #3A3A3C', padding: '30px 8px', flexDirection: 'column', gap: 8 }}
        >
          {VIEWS.map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <div className={`rr-thumb ${view === v ? 'rr-thumb--active' : ''}`} style={{ width: '100%' }}>
                <img src={cw.images.find(i => i.view === v)?.url ?? cw.image} alt={v} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.14em', color: view === v ? '#D90017' : '#A6A6A8' }}>
                {v}
              </span>
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div className="rr-vtext" style={{ alignSelf: 'center' }}>R/001 · {cw.name}</div>
        </div>

        {/* Main image + mobile view strip */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #3A3A3C' }}>
          <div
            className="rr-pdp-main-image"
            style={{ background: '#fff', position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.22em' }}>VIEW · {view}</div>
            </div>
            <div style={{ position: 'absolute', bottom: 18, right: 40, color: '#0F0F10', cursor: 'zoom-in' }} onClick={() => setZoomed(true)}>
              <span className="rr-chip" style={{ borderColor: '#0F0F10', color: '#0F0F10' }}>+ ZOOM</span>
            </div>
          </div>

          {/* View selector strip — hidden on desktop (thumb rail handles it), shown on tablet/mobile */}
          <div className="rr-pdp-view-strip">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  flexShrink: 0,
                }}
              >
                <div className={`rr-thumb ${view === v ? 'rr-thumb--active' : ''}`} style={{ width: 64, height: 64 }}>
                  <img src={cw.images.find(i => i.view === v)?.url ?? cw.image} alt={v} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.14em', color: view === v ? '#D90017' : '#A6A6A8' }}>
                  {v}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Purchase column */}
        <div className="rr-pdp-purchase-col" style={{ display: 'flex', flexDirection: 'column', background: '#0F0F10' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <span className="rr-overline" style={{ color: '#D90017' }}>DROP 003 · 001 OF 04</span>
            <span className="rr-mono">RR-01-{cw.id.toUpperCase()}</span>
          </div>

          <h1 className="rr-display" style={{ fontSize: 76, margin: 0, lineHeight: 0.88, letterSpacing: '-.01em' }}>
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
              {colourways.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCw(c); setSz('') }}
                  style={{ width: 54, height: 54, background: '#fff', padding: 4, border: `1px solid ${cw.id === c.id ? '#D90017' : '#3A3A3C'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div style={{ marginTop: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span className="rr-overline" style={{ color: '#E6E6E6' }}>SIZE · UK</span>
              <a className="rr-mono" style={{ color: '#E6E6E6', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setSizeGuide(true)}>UK SIZE GUIDE</a>
            </div>

            <div style={{ display: 'flex', gap: 0, marginBottom: 14 }}>
              {(['MALE', 'FEMALE'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => { setGender(g); setSz('') }}
                  style={{
                    flex: 1, padding: '10px 0',
                    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em',
                    border: '1px solid #3A3A3C',
                    borderRight: g === 'MALE' ? 'none' : '1px solid #3A3A3C',
                    background: gender === g ? '#D90017' : 'transparent',
                    color: gender === g ? '#fff' : '#A6A6A8',
                    cursor: 'pointer',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {sizes.map((s) => (
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
          </div>

          {/* CTAs */}
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="rr-btn"
              style={{ justifyContent: 'space-between', padding: '20px 26px' }}
              onClick={() => setPreOrder(true)}
            >
              <span>PRE-ORDER NOW · R1800</span>
              <Arrow size={16} />
            </button>
            <button
              className="rr-btn rr-btn--ghost"
              style={{ justifyContent: 'center' }}
              onClick={() => {
                const wishlisted = isWishlisted(cw.product_id, cw.id)
                wishlisted ? removeItem(cw.product_id, cw.id) : addItem(cw.product_id, cw.id)
              }}
            >
              {isWishlisted(cw.product_id, cw.id) ? '♥ WISHLISTED' : '♡ ADD TO WISHLIST'}
            </button>
          </div>

          {/* Meta rows */}
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', borderTop: '1px solid #3A3A3C' }}>
            {META_ROWS.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #3A3A3C' }}>
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
