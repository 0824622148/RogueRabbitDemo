import Link from 'next/link'
import SubscribeButton from '@/components/brand/SubscribeButton'
import { dropHref } from '@/lib/queries/collections'
import { formatDropDate } from '@/lib/drop-dates'
import type { Collection } from '@/types'

/**
 * "Next drop" teaser under the hero: every drop landing on the next release
 * date, one card each, with the members sign-up. Renders nothing when no
 * drop has a date coming up.
 */
export default function UpcomingDrops({ drops }: { drops: Collection[] }) {
  const date = drops[0]?.release_date
  if (!date) return null
  const next = drops.filter((d) => d.release_date === date)
  const count = ['', 'ONE', 'TWO', 'THREE', 'FOUR'][next.length] ?? String(next.length)

  return (
    <section style={{ borderBottom: '1px solid #3A3A3C' }}>
      <div
        className="rr-catalog-pad"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}
      >
        <div>
          <span className="rr-overline" style={{ color: '#D90017' }}>[ NEXT DROP · {formatDropDate(date)} ]</span>
          <h2 className="rr-display" style={{ fontSize: 'clamp(48px, 7vw, 104px)', lineHeight: 0.9, margin: '16px 0 0', color: '#E6E6E6' }}>
            {next.length > 1 ? <>{count} DROPS.<br />ONE DATE.</> : next[0].name}
          </h2>
          <p style={{ color: '#A6A6A8', fontSize: 14, lineHeight: 1.7, maxWidth: 460, margin: '16px 0 0' }}>
            Members get 48-hour early access before it goes public. Join the list and you&apos;re first in line.
          </p>
        </div>
        <SubscribeButton label="GET EARLY ACCESS" source="homepage" />
      </div>

      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 1, background: '#3A3A3C', borderTop: '1px solid #3A3A3C',
        }}
      >
        {next.map((d) => {
          // Lead with the back print (the statement piece); the front fades in on hover.
          const panels = d.hero_panels ?? []
          const back = panels.find((p) => /back/i.test(p.src)) ?? panels[0] ?? (d.hero_image ? { src: d.hero_image, alt: d.name } : null)
          const front = panels.find((p) => p !== back)
          return (
            <Link
              key={d.id}
              href={dropHref(d)}
              className="rr-upcoming-card"
              style={{
                position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                minHeight: 'clamp(380px, 48vw, 600px)', padding: 28, overflow: 'hidden',
                background: '#141416', color: '#E6E6E6', textDecoration: 'none',
              }}
            >
              {back && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={back.src}
                  alt={back.alt}
                  loading="lazy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
                />
              )}
              {front && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="rr-upcoming-card-front"
                  src={front.src}
                  alt={front.alt}
                  loading="lazy"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: front.pos ?? 'center' }}
                />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(15,15,16,.92))' }} />
              <div style={{ position: 'relative' }}>
                <span className="rr-mono" style={{ color: '#D90017' }}>DROPPING {formatDropDate(date)}</span>
                <h3 className="rr-display" style={{ fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 0.9, margin: '10px 0 0' }}>{d.name}</h3>
                {d.tagline && <div className="rr-mono" style={{ marginTop: 12, color: '#A6A6A8' }}>{d.tagline}</div>}
                <div className="rr-mono" style={{ marginTop: 16, color: '#E6E6E6' }}>
                  PREVIEW THE DROP →{front && <span className="rr-upcoming-card-hint"> · HOVER FOR THE FRONT</span>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
