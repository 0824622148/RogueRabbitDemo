'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Quote = {
  id: number
  body: string
  attribution: string
  role: 'customer' | 'ambassador' | 'team'
  highlight: boolean
}

type QuotePosition = {
  x: number
  y: number
  size: number
  opacity: number
  rotation: number
  drift: { x: number; y: number }
  duration: number
  delay: number
  italic: boolean
}

const QUOTES: Quote[] = [
  { id: 1,  body: "Rouge is lekker bru, nothing else compares.",        attribution: "Sipho M.",     role: "customer",   highlight: false },
  { id: 2,  body: "Straight fire from the jump. Die squad approved.",   attribution: "Amahle K.",    role: "ambassador", highlight: true  },
  { id: 3,  body: "My pair is numbered. Feels like art on feet.",       attribution: "Thabiso N.",   role: "customer",   highlight: false },
  { id: 4,  body: "Real ous wear Rouge. Nuff said.",                    attribution: "Lwazi D.",     role: "customer",   highlight: false },
  { id: 5,  body: "We built this for the kasi, not the catwalk.",       attribution: "Rouge Team",   role: "team",       highlight: true  },
  { id: 6,  body: "Yoh, the knit upper is something else.",             attribution: "Kefilwe R.",   role: "customer",   highlight: false },
  { id: 7,  body: "When the rabbit drops, we secure immediately.",      attribution: "Tshepo V.",    role: "customer",   highlight: false },
  { id: 8,  body: "No fear. Just motion. That's the vibe.",             attribution: "Nompilo B.",   role: "ambassador", highlight: false },
  { id: 9,  body: "250 units worldwide. I got mine. You?",              attribution: "Olwethu S.",   role: "customer",   highlight: true  },
  { id: 10, body: "This is what independence looks like.",              attribution: "Rouge Team",   role: "team",       highlight: false },
  { id: 11, body: "Wore them to the block. Everyone asked where from.", attribution: "Mandla F.",    role: "customer",   highlight: false },
  { id: 12, body: "Overseas brands who? Rouge is on another level.",    attribution: "Zintle P.",    role: "ambassador", highlight: true  },
  { id: 13, body: "Die sole alone is statement enough.",                attribution: "Kagiso M.",    role: "customer",   highlight: false },
  { id: 14, body: "First Joburg, then the world. Watch.",               attribution: "Rouge Team",   role: "team",       highlight: false },
  { id: 15, body: "Bought them as an investment. Wearing them anyway.", attribution: "Refilwe T.",   role: "customer",   highlight: false },
  { id: 16, body: "Colourway Ash hit different. Subtle and loud.",      attribution: "Bongani H.",   role: "ambassador", highlight: false },
  { id: 17, body: "Not for everyone. That's the whole point.",          attribution: "Ntombi L.",    role: "customer",   highlight: true  },
  { id: 18, body: "SA streetwear finally has a name to back.",          attribution: "Siyanda C.",   role: "ambassador", highlight: false },
  { id: 19, body: "Wore them once, got three compliments in 10 min.",   attribution: "Ayanda M.",    role: "customer",   highlight: false },
  { id: 20, body: "Real. Raw. Rouge. We don't miss.",                   attribution: "Rouge Team",   role: "team",       highlight: true  },
]

function seededRand(seed: number, offset: number): number {
  let t = (seed * 1664525 + 1013904223 + offset * 22695477) | 0
  t ^= t >>> 15
  t = Math.imul(t, 0x2c1b3c6d)
  t ^= t >>> 12
  t = Math.imul(t, 0x297a2d39)
  t ^= t >>> 15
  return (t >>> 0) / 0xffffffff
}

function buildPosition(index: number, isMobile: boolean, isHighlight: boolean): QuotePosition {
  const r = (o: number) => seededRand(index, o)

  // Divide the canvas into a grid so each quote gets its own cell
  const cols = isMobile ? 2 : 5
  const rows = isMobile ? 5 : 4
  const col = index % cols
  const row = Math.floor(index / cols) % rows

  const cellW = (isMobile ? 82 : 90) / cols   // % of viewport width per cell
  const cellH = 88 / rows                       // % of container height per cell
  const pad   = 1.5                             // minimum inset from cell edge

  const x = col * cellW + pad + r(0) * (cellW - pad * 2 - 12)
  const y = row * cellH + pad + r(1) * (cellH - pad * 2 - 6)

  const baseOpacity = 0.12 + r(3) * 0.42

  return {
    x,
    y,
    size:     isMobile ? 10 + Math.floor(r(2) * 5) : 11 + Math.floor(r(2) * 9),
    opacity:  isHighlight ? Math.max(0.38, baseOpacity) : baseOpacity,
    rotation: (r(4) - 0.5) * 20,
    drift: {
      x: (r(5) - 0.5) * 28,
      y: (r(6) - 0.5) * 24,
    },
    duration: 6 + r(7) * 12,
    delay:    r(8) * 4,
    italic:   r(9) > 0.7,
  }
}

export default function GalaxyQuotes() {
  const [positions, setPositions] = useState<QuotePosition[] | null>(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const visible = isMobile ? QUOTES.slice(0, 10) : QUOTES
    setPositions(visible.map((q, i) => buildPosition(i, isMobile, q.highlight)))
  }, [])

  if (!positions) return null

  const visible = positions.length < QUOTES.length ? QUOTES.slice(0, positions.length) : QUOTES

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {visible.map((quote, i) => {
        const pos = positions[i]

        return (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: pos.opacity,
              scale: 1,
              x: [0, pos.drift.x, 0],
              y: [0, pos.drift.y, 0],
            }}
            transition={{
              opacity: { duration: 1.2, delay: pos.delay, ease: [0.2, 0.7, 0.2, 1] },
              scale:   { duration: 1.2, delay: pos.delay, ease: [0.2, 0.7, 0.2, 1] },
              x: { duration: pos.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: pos.delay },
              y: { duration: pos.duration * 1.15, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: pos.delay },
            }}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              rotate: pos.rotation,
              maxWidth: 220,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: pos.size,
                fontWeight: 500,
                fontStyle: pos.italic ? 'italic' : 'normal',
                color: quote.highlight ? '#D90017' : '#E6E6E6',
                lineHeight: 1.4,
                marginBottom: 4,
              }}
            >
              &ldquo;{quote.body}&rdquo;
            </div>
            <div
              className="rr-mono"
              style={{ fontSize: 9, color: '#A6A6A8', letterSpacing: '0.18em' }}
            >
              — {quote.attribution}
              {quote.role !== 'customer' && (
                <span style={{ color: '#D90017', marginLeft: 4 }}>
                  [{quote.role.toUpperCase()}]
                </span>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
