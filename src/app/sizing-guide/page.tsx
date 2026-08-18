'use client'

import { useState } from 'react'
import PolicyLayout from '@/components/brand/PolicyLayout'

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

const S = {
  h2: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(20px, 3vw, 28px)',
    letterSpacing: '0.01em',
    textTransform: 'uppercase' as const,
    color: '#E6E6E6',
    margin: '48px 0 16px',
    borderBottom: '1px solid #3A3A3C',
    paddingBottom: 10,
  },
  p: { margin: '0 0 14px' },
}

export default function SizingGuidePage() {
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE')
  const rows = SIZE_GUIDE[gender]

  return (
    <PolicyLayout title="Sizing Guide" lastUpdated="June 2026">

      <p style={S.p}>
        All Rouge Rabbit footwear is sized in UK sizing. Use the guide below to find your
        perfect fit. If you are between sizes, we recommend sizing up.
      </p>

      <h2 style={S.h2}>How to Measure</h2>
      <p style={S.p}>
        Stand on a flat surface and measure the distance from the back of your heel to the
        tip of your longest toe. Do this in the afternoon when your feet are at their largest.
        The Rouge 01 runs true to size.
      </p>

      <h2 style={S.h2}>Footwear Size Chart</h2>

      {/* Gender toggle */}
      <div style={{ display: 'flex', maxWidth: 320, marginBottom: 24 }}>
        {(['MALE', 'FEMALE'] as const).map((g, i) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            style={{
              flex: 1, padding: '10px 0',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em',
              border: '1px solid #3A3A3C',
              borderRight: i === 0 ? 'none' : '1px solid #3A3A3C',
              background: gender === g ? '#D90017' : 'transparent',
              color: gender === g ? '#fff' : '#A6A6A8',
              cursor: 'pointer',
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Size table */}
      <div style={{ border: '1px solid #3A3A3C', maxWidth: 480 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          padding: '12px 20px',
          borderBottom: '1px solid #3A3A3C',
          background: '#1E1E20',
        }}>
          {['UK', 'EU', 'FOOT LENGTH'].map(h => (
            <span key={h} className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', letterSpacing: '.16em' }}>{h}</span>
          ))}
        </div>
        {rows.map((r, idx) => (
          <div
            key={r.uk}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              padding: '12px 20px',
              borderBottom: idx < rows.length - 1 ? '1px solid #3A3A3C' : 'none',
              background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
            }}
          >
            <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 12 }}>{r.uk}</span>
            <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 12 }}>{r.eu}</span>
            <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 12 }}>{r.cm}</span>
          </div>
        ))}
      </div>

      <h2 style={S.h2}>Fit Tips</h2>
      <ul style={{ margin: '0 0 14px', paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <li>Measure both feet — use the larger measurement.</li>
        <li>Wear the socks you intend to pair with the shoe when measuring.</li>
        <li>If between sizes, size up for a more comfortable fit.</li>
        <li>The Rouge 01 features a standard-width last. Wide-foot wearers may prefer to size up half a size.</li>
      </ul>

      <div style={{ marginTop: 56, padding: 32, background: '#1E1E20', border: '1px solid #3A3A3C' }}>
        <p style={{ ...S.p, fontWeight: 600, color: '#E6E6E6', marginBottom: 8 }}>Still unsure of your size?</p>
        <p style={{ ...S.p, marginBottom: 0 }}>
          Contact our team at{' '}
          <a href="mailto:support@rougerabbit.co.za" style={{ color: '#D90017', textDecoration: 'none' }}>
            support@rougerabbit.co.za
          </a>{' '}
          and we&apos;ll help you find the right fit.
        </p>
      </div>

    </PolicyLayout>
  )
}
