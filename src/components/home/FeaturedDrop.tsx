'use client'

import { useState } from 'react'
import Link from 'next/link'
import SectionHead from '@/components/brand/SectionHead'
import ProductCard from '@/components/brand/ProductCard'
import type { Product } from '@/types'

const VISIBLE = 4

interface Props {
  products: Product[]
}

export default function FeaturedDrop({ products }: Props) {
  const [offset, setOffset] = useState(0)
  const TOTAL = products.length
  const MAX_OFFSET = Math.max(0, TOTAL - VISIBLE)

  return (
    <section className="rr-section-pad" style={{ background: '#0F0F10', position: 'relative' }}>

      <div className="rr-sectionhead-pad" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
        <SectionHead
          index="01"
          kicker="DROP · 003 · FEATURED"
          title="THE ROUGE 01."
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 8 }}>
          <span className="rr-mono" style={{ color: '#A6A6A8', fontSize: 11, letterSpacing: '.18em' }}>
            {offset + 1} / {MAX_OFFSET + 1}
          </span>
          <button
            onClick={() => setOffset(o => Math.max(0, o - 1))}
            disabled={offset === 0}
            style={{
              width: 44, height: 44, border: '1px solid #3A3A3C', background: 'none',
              color: offset === 0 ? '#3A3A3C' : '#E6E6E6',
              cursor: offset === 0 ? 'default' : 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color .2s, color .2s',
            }}
          >
            ←
          </button>
          <button
            onClick={() => setOffset(o => Math.min(MAX_OFFSET, o + 1))}
            disabled={offset === MAX_OFFSET}
            style={{
              width: 44, height: 44, border: '1px solid #3A3A3C', background: 'none',
              color: offset === MAX_OFFSET ? '#3A3A3C' : '#E6E6E6',
              cursor: offset === MAX_OFFSET ? 'default' : 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color .2s, color .2s',
            }}
          >
            →
          </button>
        </div>
      </div>

      <div className="rr-section-inner-pad" style={{ overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            width: `${(TOTAL / VISIBLE) * 100}%`,
            transform: `translateX(-${offset * (100 / TOTAL)}%)`,
            transition: 'transform 0.5s cubic-bezier(.2,.7,.2,1)',
          }}
        >
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/shop/${p.slug}`}
              style={{
                flex: `0 0 ${100 / TOTAL}%`,
                borderRight: '1px solid #3A3A3C',
                boxSizing: 'border-box',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              <ProductCard product={p} mediaHeight={420} indexLabel={`R/00${i + 1}`} />
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 28 }}>
        {Array.from({ length: MAX_OFFSET + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setOffset(i)}
            style={{
              height: 2, width: i === offset ? 32 : 10,
              background: i === offset ? '#D90017' : '#3A3A3C',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease', padding: 0,
            }}
          />
        ))}
      </div>

    </section>
  )
}
