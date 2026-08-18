'use client'

import { useState, useEffect } from 'react'

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
    { uk: 'UK 3',  eu: 'EU 34', cm: '21.5 cm' },
    { uk: 'UK 4',  eu: 'EU 35', cm: '22.0 cm' },
    { uk: 'UK 5',  eu: 'EU 36', cm: '22.5 cm' },
    { uk: 'UK 6',  eu: 'EU 37', cm: '23.5 cm' },
    { uk: 'UK 7',  eu: 'EU 38', cm: '24.0 cm' },
    { uk: 'UK 8',  eu: 'EU 39', cm: '25.0 cm' },
    { uk: 'UK 9',  eu: 'EU 40', cm: '25.5 cm' },
    { uk: 'UK 10', eu: 'EU 41', cm: '26.5 cm' },
  ],
}

function Modal({ onClose }: { onClose: () => void }) {
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE')
  const rows = SIZE_GUIDE[gender]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#1E1E20', border: '1px solid #3A3A3C',
          width: '100%', maxWidth: 400,
          padding: 'clamp(24px, 4vw, 36px) clamp(18px, 4vw, 32px)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'none', border: 'none', color: '#A6A6A8',
            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em',
          }}
        >
          ✕ CLOSE
        </button>

        <span className="rr-overline" style={{ color: '#D90017' }}>[ SIZING GUIDE ]</span>
        <p style={{ color: '#A6A6A8', fontSize: 12, lineHeight: 1.7, margin: '12px 0 20px' }}>
          Measure your foot from heel to longest toe while standing. If between sizes, go up.
          The Rouge 01 runs true to size.
        </p>

        <div style={{ display: 'flex', marginBottom: 20 }}>
          {(['MALE', 'FEMALE'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              style={{
                flex: 1, padding: '8px 0',
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em',
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

export default function SizingGuide() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && <Modal onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none', border: 'none', padding: 0,
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em',
          color: '#A6A6A8', cursor: 'pointer', textDecoration: 'underline',
        }}
      >
        SIZING
      </button>
    </>
  )
}
