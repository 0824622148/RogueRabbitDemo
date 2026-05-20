'use client'

import { useState } from 'react'

const FILTERS = ['ALL', 'FOOTWEAR', 'APPAREL', 'ACCESSORIES', 'NEW', 'SALE']

export default function FilterBar() {
  const [active, setActive] = useState('ALL')

  return (
    <section
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        padding: '18px 40px',
        background: 'rgba(15,15,16,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #3A3A3C',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
      }}
    >
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rr-pill ${active === f ? 'rr-pill--active' : ''}`}
          >
            {f}
            {f === 'ALL' && <span style={{ opacity: 0.6 }}>· 38</span>}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <button className="rr-pill">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 2H9M2 5H8M3 8H7" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          FILTERS
        </button>
        <span className="rr-mono">SORT ·</span>
        <select
          style={{
            background: 'transparent', color: '#E6E6E6',
            border: '1px solid #3A3A3C',
            padding: '8px 14px',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em',
            textTransform: 'uppercase', cursor: 'pointer', appearance: 'none',
          }}
        >
          <option style={{ background: '#1E1E20' }}>FEATURED</option>
          <option style={{ background: '#1E1E20' }}>NEWEST</option>
          <option style={{ background: '#1E1E20' }}>PRICE · LOW</option>
          <option style={{ background: '#1E1E20' }}>PRICE · HIGH</option>
        </select>
        <span className="rr-mono">VIEW</span>
        <div style={{ display: 'flex', border: '1px solid #3A3A3C' }}>
          {['▦', '▤'].map((g, i) => (
            <button
              key={i}
              style={{
                width: 34, height: 34,
                background: i === 0 ? '#E6E6E6' : 'transparent',
                color: i === 0 ? '#0F0F10' : '#E6E6E6',
                border: 'none', cursor: 'pointer', fontSize: 14,
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
