'use client'

import Asterisk from './Asterisk'

interface MarqueeProps {
  items: string[]
  speed?: number
  accent?: 'rouge' | 'bone'
}

export default function Marquee({ items, speed = 30, accent = 'rouge' }: MarqueeProps) {
  const isRouge = accent === 'rouge'
  const content = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 60 }}>
      {items.map((t, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <Asterisk />
          {t}
        </span>
      ))}
    </span>
  )

  return (
    <div
      className="rr-marquee"
      style={{
        background: isRouge ? '#D90017' : '#E6E6E6',
        color: isRouge ? '#E6E6E6' : '#0F0F10',
      }}
    >
      <div
        className="rr-marquee__track"
        style={{ animationDuration: `${speed}s` }}
      >
        {content}
        {content}
      </div>
    </div>
  )
}
