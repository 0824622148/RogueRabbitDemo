'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export interface HeroSlide {
  src: string
  alt: string
  caption: string
  href: string
  /** CSS object-position keeping the subject in frame. */
  pos?: string
}

/**
 * Crossfading campaign photos for the home hero frame.
 *
 * Timing lives in CSS: the active progress segment fills over 5.5s and its
 * animationend advances the slide. Pausing (hover, focus, hidden tab) just
 * pauses that animation, so the bar and the slide change can't drift apart.
 * With prefers-reduced-motion the fill doesn't animate, so there's no
 * autoplay — the segments and swipe still work.
 */
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const n = slides.length
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  // Only fetch a slide once it's current or next up — keeps the first view light.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]))
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [touchX, setTouchX] = useState<number | null>(null)

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const go = (to: number) => {
    const next = ((to % n) + n) % n
    if (next === index) return
    setPrev(index)
    setIndex(next)
    setSeen((s) => new Set(s).add(next))
  }

  const paused = hovered || focused || hidden
  const upNext = (index + 1) % n

  return (
    <div
      className={`rr-hero-carousel${paused ? ' is-paused' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Bagged League × Rouge Rabbit campaign"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false) }}
      onPointerDown={(e) => { if (e.pointerType !== 'mouse') setTouchX(e.clientX) }}
      onPointerUp={(e) => {
        if (touchX === null) return
        const dx = e.clientX - touchX
        setTouchX(null)
        if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1)
      }}
    >
      {slides.map((s, i) => {
        const active = i === index
        const load = seen.has(i) || i === upNext
        return (
          <Link
            key={s.src}
            href={s.href}
            className={`rr-hero-slide${active ? ' is-active' : ''}${i === prev ? ' is-leaving' : ''}`}
            aria-hidden={!active}
            tabIndex={active ? 0 : -1}
            aria-label={`${s.caption} — ${i + 1} of ${n}`}
          >
            {load && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.src}
                alt={s.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                draggable={false}
                style={{ objectPosition: s.pos ?? 'center' }}
              />
            )}
          </Link>
        )
      })}

      <div className="rr-hero-carousel-meta">
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }} aria-live="polite">
          <span className="rr-mono" style={{ color: '#D90017' }}>
            {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
          <span className="rr-mono" style={{ color: '#E6E6E6' }}>{slides[index].caption}</span>
        </div>
        <div className="rr-hero-progress">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${s.caption}`}
              aria-current={i === index ? 'true' : undefined}
            >
              <span
                // key on index restarts the fill whenever the slide changes
                key={i === index ? `on-${index}` : 'off'}
                className={`rr-hero-progress-fill${i === index ? ' is-active' : i < index ? ' is-done' : ''}`}
                onAnimationEnd={i === index ? () => go(index + 1) : undefined}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
