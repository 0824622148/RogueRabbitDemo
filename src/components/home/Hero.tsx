import Link from 'next/link'
import Arrow from '@/components/brand/Arrow'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/store-status'
import HeroCarousel, { type HeroSlide } from './HeroCarousel'

// Campaign photos for the hero frame — the latest releases only: the
// Frequency short set (Track Sets) leads, then Signal and Beauty in Contrast.
const RT = '/assets/drops/rouge-track'
const BIC = '/assets/drops/beauty-in-contrast'
const SIG = '/assets/drops/signal'
const TRACK_SET = '/shop/rouge-track-set'
const HERO_SLIDES: HeroSlide[] = [
  { src: `${RT}/model-front.jpg`, alt: 'Frequency short set worn — yellow half-zip hooded top, MOVE DIFFERENT., with cargo shorts', caption: 'FREQUENCY SHORT SET', href: TRACK_SET, pos: 'center 8%' },
  { src: `${RT}/model-back.jpg`, alt: 'Frequency top back — SAME DESTINATION. DIFFERENT ROUTES.', caption: 'FREQUENCY · BACK', href: TRACK_SET, pos: 'center 8%' },
  { src: `${RT}/model-side.jpg`, alt: 'Frequency short set worn hood up — side view of the cargo shorts', caption: 'FREQUENCY · HOOD UP', href: TRACK_SET, pos: 'center 8%' },
  { src: `${BIC}/back.jpg`, alt: 'Beauty in Contrast tee back print — statue with a red-painted blindfold', caption: 'BEAUTY IN CONTRAST TEE', href: '/drops/beauty-in-contrast', pos: 'center 45%' },
  { src: `${RT}/model-crouch.jpg`, alt: 'Frequency short set worn — crouching, front', caption: 'FREQUENCY SHORT SET', href: TRACK_SET, pos: 'center 20%' },
  { src: `${SIG}/back.jpg`, alt: 'Signal tee back print — diver helmet with a goldfish', caption: 'SIGNAL TEE', href: '/drops/signal', pos: 'center 45%' },
]

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="rr-display" style={{ fontSize: 38, color: '#E6E6E6' }}>{n}</div>
      <div className="rr-mono" style={{ marginTop: 4, lineHeight: 1.6 }}>{l}</div>
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
          FREQUENCY · MOVE DIFFERENT.
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
        <span className="rr-mono" style={{ writingMode: 'vertical-rl' }}>RR · FREQUENCY</span>
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
            <span className="rr-mono">LATEST RELEASE · THE FREQUENCY SHORT SET</span>
          </div>
          <h1
            className="rr-display rr-hero-title"
            style={{ margin: 0, color: '#E6E6E6', letterSpacing: '-.01em' }}
          >
            MOVE<br />
            <span style={{ color: '#D90017' }}>DIFFERENT.</span>
          </h1>
          <p style={{ marginTop: 22, color: '#A6A6A8', maxWidth: 460, fontSize: 14, lineHeight: 1.7 }}>
            Same destination. Different routes. The Frequency short set is a short-sleeve hooded
            half-zip and matching cargo shorts in yellow, royal blue and red, sold together.
            Plus the latest tees, Signal and Beauty in Contrast.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
            <Link href={TRACK_SET}>
              <button className="rr-btn">
                SHOP FREQUENCY <span className="arr"><Arrow size={14} /></span>
              </button>
            </Link>
            <Link href="/drops">
              <button className="rr-btn rr-btn--ghost">LATEST TEES ▸</button>
            </Link>
          </div>
          <div
            className="rr-hero-stats"
            style={{
              marginTop: 48, paddingTop: 24,
              borderTop: '1px solid #3A3A3C',
            }}
          >
            <Stat n="2-PIECE" l="SHORT SET" />
            <Stat n="UNISEX" l="RELAXED FIT" />
            <Stat n="FREE" l="ENNERDALE DELIVERY" />
            <Stat n={`R${FREE_SHIPPING_THRESHOLD}+`} l="FREE NATIONWIDE DELIVERY" />
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
