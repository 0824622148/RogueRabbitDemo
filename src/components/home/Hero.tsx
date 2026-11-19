import Link from 'next/link'
import Arrow from '@/components/brand/Arrow'
import HeroCarousel, { type HeroSlide } from './HeroCarousel'

// Campaign photos for the hero frame — the home page focuses on the latest
// releases only, so it alternates Signal and Beauty in Contrast.
const BIC = '/assets/drops/beauty-in-contrast'
const SIG = '/assets/drops/signal'
const HERO_SLIDES: HeroSlide[] = [
  { src: `${BIC}/back.jpg`, alt: 'Beauty in Contrast tee back print — statue with a red-painted blindfold', caption: 'BEAUTY IN CONTRAST TEE', href: '/drops/beauty-in-contrast', pos: 'center 45%' },
  { src: `${SIG}/back.jpg`, alt: 'Signal tee back print — diver helmet with a goldfish', caption: 'SIGNAL TEE', href: '/drops/signal', pos: 'center 45%' },
  { src: `${BIC}/front.jpg`, alt: 'Beauty in Contrast white tee and cap — front', caption: 'BEAUTY IN CONTRAST · FRONT', href: '/drops/beauty-in-contrast', pos: 'center 40%' },
  { src: `${SIG}/front.jpg`, alt: 'Signal black tee and cap — front', caption: 'SIGNAL · FRONT', href: '/drops/signal', pos: 'center 40%' },
]

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="rr-display" style={{ fontSize: 38, color: '#E6E6E6' }}>{n}</div>
      <div className="rr-mono" style={{ marginTop: 4 }}>{l}</div>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      className="rr-hero-section"
      style={{
        position: 'relative',
        background: '#0F0F10',
        overflow: 'hidden',
        borderBottom: '1px solid #3A3A3C',
      }}
    >
      {/* Left rail — hidden on mobile via rr-hero-rails */}
      <div
        className="rr-hero-rails"
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 40,
          borderRight: '1px solid #3A3A3C',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '20px 0', alignItems: 'center',
        }}
      >
        <span className="rr-mono" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          SIGNAL × BEAUTY IN CONTRAST
        </span>
        <span className="rr-mono" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: '#D90017' }}>
          OUT NOW
        </span>
      </div>

      {/* Right rail — hidden on mobile */}
      <div
        className="rr-hero-rails"
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 40,
          borderLeft: '1px solid #3A3A3C',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '20px 0', alignItems: 'center',
        }}
      >
        <span className="rr-mono" style={{ writingMode: 'vertical-rl' }}>SCROLL ↓</span>
        <span className="rr-mono" style={{ writingMode: 'vertical-rl' }}>SIG × BIC</span>
      </div>

      {/* Background gradient */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background:
            'radial-gradient(ellipse at 70% 50%, rgba(217,0,23,0.18), transparent 60%),' +
            'linear-gradient(180deg, #0f0f10 0%, #161618 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Giant outline number — decorative, desktop only */}
      <div
        className="rr-hero-rails"
        style={{
          position: 'absolute', right: 80, top: -30,
          fontFamily: 'var(--font-display)', fontSize: 440, lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(230,230,230,0.06)',
          pointerEvents: 'none',
          letterSpacing: '-.04em',
        }}
      >
        03
      </div>

      {/* Main grid */}
      <div className="rr-hero-grid" style={{ position: 'relative' }}>
        {/* Left copy */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <span className="rr-mono">LATEST RELEASES · SIGNAL + BEAUTY IN CONTRAST</span>
          </div>
          <h1
            className="rr-display rr-hero-title"
            style={{ margin: 0, color: '#E6E6E6', letterSpacing: '-.01em' }}
          >
            TWO DROPS.<br />
            <span style={{ color: '#D90017' }}>OUT NOW.</span>
          </h1>
          <p style={{ marginTop: 22, color: '#A6A6A8', maxWidth: 460, fontSize: 14, lineHeight: 1.7 }}>
            Signal — not everything needs to be received. Beauty in Contrast — beauty lives
            in the contrast. Two new back-print tees, limited runs, marked with the rabbit.
            Worn loud.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
            <Link href="/drops/signal">
              <button className="rr-btn">
                SHOP SIGNAL <span className="arr"><Arrow size={14} /></span>
              </button>
            </Link>
            <Link href="/drops/beauty-in-contrast">
              <button className="rr-btn rr-btn--ghost">SHOP BEAUTY IN CONTRAST ▸</button>
            </Link>
          </div>
          <div
            className="rr-hero-stats"
            style={{
              display: 'flex', marginTop: 48, paddingTop: 24,
              borderTop: '1px solid #3A3A3C', flexWrap: 'wrap',
            }}
          >
            <Stat n="02" l="NEW DROPS" />
            <Stat n="R350" l="PER TEE" />
            <Stat n="FREE" l="ENNERDALE DELIVERY" />
            <Stat n="SA" l="NATIONWIDE SHIPPING" />
          </div>
        </div>

        {/* Right — campaign carousel; on mobile it moves above the headline (4:5) */}
        <div className="rr-hero-right" style={{ position: 'relative', height: '100%', minHeight: 500 }}>
          <div
            className="rr-hero-frame"
            style={{
              position: 'absolute', inset: '20px 0 20px 40px',
              background: '#161618',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <HeroCarousel slides={HERO_SLIDES} />
            <div className="rr-plus" style={{ top: 12, left: 12 }} />
            <div className="rr-plus" style={{ top: 12, right: 12 }} />
            <div className="rr-plus" style={{ bottom: 12, left: 12 }} />
            <div className="rr-plus" style={{ bottom: 12, right: 12 }} />
          </div>
        </div>
      </div>
    </section>
  )
}
