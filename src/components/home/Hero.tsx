import Link from 'next/link'
import Arrow from '@/components/brand/Arrow'
import HeroCarousel, { type HeroSlide } from './HeroCarousel'

// Campaign photos for the hero frame — people and cars alternating.
const BL = '/assets/drops/bagged-league'
const HERO_SLIDES: HeroSlide[] = [
  { src: `${BL}/paint-shop-model.jpg`, alt: 'Paint Shop tee worn arms-out on a hilltop', caption: 'PAINT SHOP TEE', href: '/drops/paint-shop', pos: 'center 38%' },
  { src: `${BL}/golf-pair.jpg`, alt: 'Bagged white and red VW Citi Golfs at sunset', caption: 'BAGGED LEAGUE · CITI GOLFS', href: '/drops/bagged-league', pos: 'center 62%' },
  { src: `${BL}/duo.jpg`, alt: 'Paint Shop and Air Down tees worn on the railway tracks', caption: 'PAINT SHOP × AIR DOWN', href: '/drops/bagged-league', pos: 'center 45%' },
  { src: `${BL}/red-car.jpg`, alt: 'Bagged red VW Golf front wheel at a night meet', caption: 'BAGGED LEAGUE · NIGHT MEET', href: '/drops/bagged-league', pos: '55% 60%' },
  { src: `${BL}/air-down.jpg`, alt: 'Air Down tee back print — Standard, Low, Lower, Bagged', caption: 'AIR DOWN TEE', href: '/drops/air-down', pos: 'center 55%' },
  { src: `${BL}/white-car.jpg`, alt: 'Bagged white VW Golf rear wheel', caption: 'BAGGED LEAGUE · STANCE', href: '/drops/bagged-league', pos: '50% 70%' },
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
          BAGGED LEAGUE × ROUGE RABBIT
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
        <span className="rr-mono" style={{ writingMode: 'vertical-rl' }}>BL × RR</span>
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
            <span className="rr-mono">BAGGED LEAGUE × ROUGE RABBIT · THE COLLAB</span>
          </div>
          <h1
            className="rr-display rr-hero-title"
            style={{ margin: 0, color: '#E6E6E6', letterSpacing: '-.01em' }}
          >
            NO FEAR<br />
            <span style={{ color: '#D90017' }}>JUST MOTION</span>
          </h1>
          <p style={{ marginTop: 22, color: '#A6A6A8', maxWidth: 460, fontSize: 14, lineHeight: 1.7 }}>
            Inspired by Bagged League — the crew keeping stance culture low, clean and loud.
            Two T-shirt drops, Air Dropped and Paint Shop, built for the ones who ride on air
            and refuse to blend in. Marked with the rabbit. Worn loud.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
            <Link href="/shop/tops">
              <button className="rr-btn">
                SHOP THE COLLAB <span className="arr"><Arrow size={14} /></span>
              </button>
            </Link>
            <Link href="/shop">
              <button className="rr-btn rr-btn--ghost">VIEW ALL ▸</button>
            </Link>
          </div>
          <div
            className="rr-hero-stats"
            style={{
              display: 'flex', marginTop: 48, paddingTop: 24,
              borderTop: '1px solid #3A3A3C', flexWrap: 'wrap',
            }}
          >
            <Stat n="02" l="T-SHIRT DROPS" />
            <Stat n="BL×RR" l="THE COLLAB" />
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
