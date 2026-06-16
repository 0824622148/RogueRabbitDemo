import Link from 'next/link'
import Arrow from '@/components/brand/Arrow'

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
          R/001 — DROP 003 — F/W 26
        </span>
        <span className="rr-mono" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: '#D90017' }}>
          LIVE NOW
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
        <span className="rr-mono" style={{ writingMode: 'vertical-rl' }}>00 / 04</span>
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
            <span className="rr-mono">F/W 2026 · CHAPTER ONE</span>
          </div>
          <h1
            className="rr-display rr-hero-title"
            style={{ margin: 0, color: '#E6E6E6', letterSpacing: '-.01em' }}
          >
            RAW<br />BY<br />
            <span style={{ color: '#D90017' }}>NATURE.</span>
          </h1>
          <p style={{ marginTop: 22, color: '#A6A6A8', maxWidth: 460, fontSize: 14, lineHeight: 1.7 }}>
            The Rouge 01 silhouette — engineered for the ones who refuse to blend in.
            Knit upper, cinematic sole, marked with the rabbit. Worn loud.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
            <Link href="/shop/rouge-01">
              <button className="rr-btn">
                SHOP THE DROP <span className="arr"><Arrow size={14} /></span>
              </button>
            </Link>
            <button className="rr-btn rr-btn--ghost">WATCH FILM ▸</button>
          </div>
          <div
            className="rr-hero-stats"
            style={{
              display: 'flex', marginTop: 48, paddingTop: 24,
              borderTop: '1px solid #3A3A3C', flexWrap: 'wrap',
            }}
          >
            <Stat n="04" l="COLOURWAYS" />
            <Stat n="07" l="SIZES" />
            <Stat n="250" l="UNITS · NUMBERED" />
            <Stat n="48H" l="EARLY ACCESS" />
          </div>
        </div>

        {/* Right — hero shoe image, hidden on mobile */}
        <div className="rr-hero-right" style={{ position: 'relative', height: '100%', minHeight: 500 }}>
          <div
            style={{
              position: 'absolute', inset: '20px 0 20px 40px',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src="/assets/ig-06.png"
              alt="Rouge 01 Obsidian"
              style={{
                width: '120%', height: '120%',
                objectFit: 'contain',
              }}
            />
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
