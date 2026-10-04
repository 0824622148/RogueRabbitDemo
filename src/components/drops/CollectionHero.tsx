import Arrow from '@/components/brand/Arrow'
import type { HeroPanel } from '@/types'

interface Props {
  panels: HeroPanel[]
  eyebrow: string
  title: string
  subline?: string | null
  /** Where SHOP NOW goes — an in-page anchor on the drop page. */
  ctaHref: string
}

/**
 * Campaign hero: full-bleed photos side by side with the headline, subline and
 * SHOP NOW over the bottom-left. Column count follows the number of panels.
 * On phones the panels stack and the copy sits over the first one (globals.css).
 */
export default function CollectionHero({ panels, eyebrow, title, subline, ctaHref }: Props) {
  return (
    <section
      className="rr-collection-hero"
      style={{ '--rr-panels': panels.length } as React.CSSProperties}
    >
      <div className="rr-collection-hero-panels">
        {panels.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            style={{ objectPosition: p.pos ?? 'center' }}
          />
        ))}
      </div>

      <div className="rr-collection-hero-shade" aria-hidden="true" />

      <div className="rr-collection-hero-copy">
        <span className="rr-mono" style={{ color: '#E6E6E6', letterSpacing: '.22em' }}>{eyebrow}</span>
        <h1 className="rr-display rr-collection-hero-title">{title}</h1>
        {subline && <p className="rr-collection-hero-sub">{subline}</p>}
        <a href={ctaHref} className="rr-btn rr-btn--solid-bone" style={{ textDecoration: 'none', marginTop: 26 }}>
          SHOP NOW <span className="arr"><Arrow size={14} /></span>
        </a>
      </div>
    </section>
  )
}
