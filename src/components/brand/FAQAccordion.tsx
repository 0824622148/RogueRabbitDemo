'use client'

import { useState } from 'react'

interface FAQ { q: string; a: string }

export default function FAQAccordion({ items }: { items: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ borderTop: '1px solid #3A3A3C' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #3A3A3C' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '22px 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)', fontWeight: 500,
                fontSize: 'clamp(14px, 2vw, 16px)', color: '#E6E6E6', lineHeight: 1.4,
                textAlign: 'left',
              }}
            >
              {item.q}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 18, color: open === i ? '#D90017' : '#A6A6A8',
                flexShrink: 0, lineHeight: 1,
                transition: 'color 0.15s',
              }}
            >
              {open === i ? '−' : '+'}
            </span>
          </button>

          {open === i && (
            <p
              style={{
                margin: '0 0 22px',
                fontSize: 14, lineHeight: 1.85, color: '#A6A6A8',
                maxWidth: 680,
              }}
            >
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
