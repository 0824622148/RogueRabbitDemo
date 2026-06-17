import NavBar from './NavBar'
import Footer from './Footer'
import Marquee from './Marquee'
import Asterisk from './Asterisk'

interface DroppingSoonProps {
  title: string
  eyebrow?: string
}

export default function DroppingSoon({ title, eyebrow }: DroppingSoonProps) {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', textAlign: 'center', position: 'relative' }}>

        {/* Top rule */}
        <div style={{ position: 'absolute', top: 0, left: 40, right: 40, height: '1px', background: '#3A3A3C' }} />

        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <Asterisk size={9} color="#D90017" />
          <span className="rr-mono" style={{ color: '#A6A6A8', letterSpacing: '0.28em' }}>
            {eyebrow ?? 'Rouge Rabbit'}
          </span>
          <Asterisk size={9} color="#D90017" />
        </div>

        {/* Page title */}
        <h1
          className="rr-display"
          style={{
            fontSize: 'clamp(64px, 14vw, 180px)',
            lineHeight: 0.86,
            color: '#E6E6E6',
            margin: '0 0 28px',
          }}
        >
          {title}
        </h1>

        {/* Dropping soon label */}
        <div
          className="rr-display"
          style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            color: '#D90017',
            letterSpacing: '0.04em',
            marginBottom: 40,
          }}
        >
          Dropping Soon
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36, width: '100%', maxWidth: 480 }}>
          <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          <Asterisk size={10} color="#3A3A3C" />
          <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
        </div>

        {/* Body copy */}
        <p style={{ fontSize: 14, color: '#A6A6A8', lineHeight: 1.8, maxWidth: 400, margin: '0 0 40px' }}>
          Something wild is on its way. Stay locked in — we&apos;ll let you know when it&apos;s ready to drop.
        </p>

        {/* CTA */}
        <a
          href="https://www.instagram.com/rougerabbit.za"
          target="_blank"
          rel="noopener noreferrer"
          className="rr-btn rr-btn--ghost"
          style={{ letterSpacing: '0.18em' }}
        >
          Follow @ROUGERABBIT.ZA →
        </a>

        {/* Bottom rule */}
        <div style={{ position: 'absolute', bottom: 0, left: 40, right: 40, height: '1px', background: '#3A3A3C' }} />
      </main>

      <Marquee items={['NO FEAR', 'JUST MOTION', 'DROPPING SOON', 'ROUGE RABBIT']} speed={28} accent="rouge" />

      <Footer />
    </div>
  )
}
