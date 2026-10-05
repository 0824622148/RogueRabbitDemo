'use client'

import { useEffect, useState } from 'react'
import {
  CAP_FIT_NOTE, CAP_MEASURE_TIPS, TEE_FIT_NOTE, TEE_MEASURE_TIPS, TEE_SIZES,
  type ApparelKind,
} from '@/lib/apparel-sizing'

const muted = { color: '#A6A6A8', fontSize: 12, lineHeight: 1.7 }

/** Tee size chart in cm — used in the product page modal and on /sizing-guide. */
export function TeeSizeChart() {
  return (
    <div style={{ border: '1px solid #3A3A3C', maxWidth: 480 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.4fr', padding: '12px 20px', borderBottom: '1px solid #3A3A3C', background: '#1E1E20' }}>
        {['SIZE', 'CHEST (FLAT)', 'LENGTH'].map((h) => (
          <span key={h} className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', letterSpacing: '.16em' }}>{h}</span>
        ))}
      </div>
      {TEE_SIZES.map((r, i) => (
        <div
          key={r.size}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.4fr', padding: '12px 20px',
            borderBottom: i < TEE_SIZES.length - 1 ? '1px solid #3A3A3C' : 'none',
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
          }}
        >
          <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 12 }}>{r.size}</span>
          <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 12 }}>{r.chest} cm</span>
          <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 12 }}>{r.length} cm</span>
        </div>
      ))}
    </div>
  )
}

function Tips({ items }: { items: string[] }) {
  return (
    <ul style={{ ...muted, margin: '16px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  )
}

/** Body of the guide for one product type. */
export function ApparelSizeContent({ kind }: { kind: Exclude<ApparelKind, null> }) {
  if (kind === 'cap') {
    return (
      <>
        <p style={{ ...muted, margin: '0 0 4px' }}>{CAP_FIT_NOTE}</p>
        <Tips items={CAP_MEASURE_TIPS} />
      </>
    )
  }
  return (
    <>
      <p style={{ ...muted, margin: '0 0 18px' }}>{TEE_FIT_NOTE}</p>
      <TeeSizeChart />
      <Tips items={TEE_MEASURE_TIPS} />
    </>
  )
}

/** "SIZE GUIDE" link + modal on the tee / cap product page. */
export default function ApparelSizeGuide({ kind }: { kind: Exclude<ApparelKind, null> }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none', border: 'none', padding: 0,
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em',
          color: '#A6A6A8', cursor: 'pointer', textDecoration: 'underline',
        }}
      >
        SIZE GUIDE
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px',
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={kind === 'cap' ? 'Cap fit guide' : 'Tee size guide'}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1E1E20', border: '1px solid #3A3A3C', position: 'relative',
              width: '100%', maxWidth: 480, maxHeight: '92dvh', overflowY: 'auto',
              padding: 'clamp(24px, 4vw, 36px) clamp(18px, 4vw, 32px)',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 20, background: 'none', border: 'none',
                color: '#A6A6A8', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em',
              }}
            >
              ✕ CLOSE
            </button>
            <span className="rr-overline" style={{ color: '#D90017', display: 'block', marginBottom: 14 }}>
              [ {kind === 'cap' ? 'CAP FIT' : 'TEE SIZE GUIDE'} ]
            </span>
            <ApparelSizeContent kind={kind} />
            <a
              href="/sizing-guide"
              className="rr-mono"
              style={{ display: 'inline-block', marginTop: 20, fontSize: 10, letterSpacing: '.14em', color: '#E6E6E6' }}
            >
              FULL SIZING GUIDE →
            </a>
          </div>
        </div>
      )}
    </>
  )
}
