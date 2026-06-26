import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import Arrow from '@/components/brand/Arrow'

export const metadata: Metadata = {
  title: 'Manifesto — Rouge Rabbit',
  description: 'Not for everyone. Rouge Rabbit is South African independent streetwear built for the ones who already know exactly who they are.',
}

const px = 'clamp(20px, 5vw, 40px)'

export default function ManifestoPage() {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />

      {/* ── HERO ──────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          borderBottom: '1px solid #3A3A3C',
          overflow: 'hidden',
          padding: `clamp(70px, 10vw, 130px) ${px} clamp(60px, 8vw, 100px)`,
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 80% 50%, rgba(217,0,23,0.12), transparent 60%)',
          }}
        />
        <div
          style={{
            position: 'absolute', right: -40, top: -60,
            fontFamily: 'var(--font-display)', fontSize: 'clamp(200px, 36vw, 480px)',
            color: 'transparent', WebkitTextStroke: '1px rgba(230,230,230,0.04)',
            lineHeight: 1, pointerEvents: 'none', letterSpacing: '-.04em', userSelect: 'none',
          }}
        >
          002
        </div>

        <div style={{ maxWidth: 900, position: 'relative' }}>
          <span className="rr-overline" style={{ color: '#D90017', marginBottom: 24, display: 'block' }}>
            [ MANIFESTO · 002 ] — EST. 2023 · SOUTH AFRICA
          </span>
          <h1
            className="rr-display"
            style={{
              fontSize: 'clamp(60px, 12vw, 160px)',
              margin: 0, lineHeight: 0.88, letterSpacing: '-0.02em',
            }}
          >
            NOT FOR<br />
            <span style={{ color: '#D90017' }}>EVERYONE.</span>
          </h1>
          <p
            style={{
              marginTop: 32, fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.8,
              color: '#A6A6A8', maxWidth: 520,
            }}
          >
            That&apos;s not a warning. That&apos;s a filter.
          </p>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────── */}
      <article style={{ maxWidth: 780, margin: '0 auto', padding: `clamp(48px, 7vw, 100px) ${px}` }}>

        {/* Opening */}
        <p
          style={{
            fontSize: 'clamp(16px, 2.2vw, 21px)',
            lineHeight: 1.85, color: '#C8C8CA', marginBottom: 56,
          }}
        >
          Rouge Rabbit was never created to follow. It was created to move.
        </p>

        {/* Section — The Name */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>01</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2 className="rr-display" style={{ fontSize: 'clamp(32px, 5vw, 60px)', margin: '0 0 24px', lineHeight: 0.9 }}>
            THE NAME.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 16 }}>
            Spelled <strong style={{ color: '#E6E6E6' }}>Rouge</strong>. Pronounced <strong style={{ color: '#E6E6E6' }}>Rogue</strong>.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 16 }}>
            Because we were never meant to follow the rules.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 16 }}>
            The <strong style={{ color: '#D90017' }}>Rouge</strong> represents the fire in our eyes — the relentless pursuit of something greater.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', margin: 0 }}>
            The <strong style={{ color: '#D90017' }}>Rogue</strong> represents our mindset — to refuse permission, reject the ordinary, and create our own path.
          </p>
        </div>

        {/* Pull quote */}
        <div style={{ borderLeft: '3px solid #D90017', paddingLeft: 24, marginBottom: 56 }}>
          <p
            className="rr-display"
            style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', color: '#E6E6E6', margin: 0, lineHeight: 1.15 }}
          >
            &ldquo;Together, they become a movement.&rdquo;
          </p>
        </div>

        {/* Section — Who We Move With */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>02</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2 className="rr-display" style={{ fontSize: 'clamp(32px, 5vw, 60px)', margin: '0 0 24px', lineHeight: 0.9 }}>
            WHO WE<br />MOVE WITH.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 16 }}>
            We believe that greatness belongs to those who keep moving.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 1, marginBottom: 28, border: '1px solid #3A3A3C',
            }}
          >
            {['THE ATHLETE.', 'THE CREATOR.', 'THE ENTREPRENEUR.', 'THE DREAMER.'].map((word) => (
              <div
                key={word}
                style={{ padding: 'clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px)', background: '#1E1E20' }}
              >
                <span className="rr-display" style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#3A3A3C' }}>
                  {word}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 16 }}>
            The athlete training before sunrise. The creator perfecting one more idea.
            The entrepreneur building long after everyone else has gone home.
            The artist, the student, the dreamer, the leader.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', margin: 0 }}>
            The ones who move after dark.
          </p>
        </div>

        {/* Section — How We Believe */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>03</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2 className="rr-display" style={{ fontSize: 'clamp(32px, 5vw, 60px)', margin: '0 0 24px', lineHeight: 0.9 }}>
            HOW WE<br />BELIEVE.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 16 }}>
            The world tells you to fit in. We were never meant to fit.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 16 }}>
            We believe confidence doesn&apos;t need to shout. It&apos;s a quiet feed with a loud impression.
            It&apos;s the discipline no one sees. The sacrifices no one applauds. The work that speaks for itself.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', margin: 0 }}>
            You should feel found, not sold to. Rouge Rabbit isn&apos;t here to tell you who to become.
            We&apos;re here to remind you that you&apos;re already becoming.
          </p>
        </div>

        {/* Section — What We Build */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>04</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2 className="rr-display" style={{ fontSize: 'clamp(32px, 5vw, 60px)', margin: '0 0 24px', lineHeight: 0.9 }}>
            WHAT WE BUILD.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 16 }}>
            Every collection tells a story. Every colourway represents a moment.
            Every product is designed with intention.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', margin: 0 }}>
            Not because trends last. But because purpose does.
          </p>
        </div>

        {/* Pull quote */}
        <div style={{ borderLeft: '3px solid #D90017', paddingLeft: 24, marginBottom: 56 }}>
          <p
            className="rr-display"
            style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', color: '#E6E6E6', margin: 0, lineHeight: 1.15 }}
          >
            &ldquo;Raw by Nature. Engineered for Those Who Refuse to Blend In.&rdquo;
          </p>
        </div>

        {/* Section — Where We're Going */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>05</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2 className="rr-display" style={{ fontSize: 'clamp(32px, 5vw, 60px)', margin: '0 0 24px', lineHeight: 0.9 }}>
            WHERE<br />WE&apos;RE GOING.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 16 }}>
            Born in South Africa. Built for the world.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 16 }}>
            We dream of becoming more than a clothing brand. We are building a symbol of movement.
            A brand that stands beside the greatest in sport. A brand respected in luxury.
            A brand that shapes culture through streetwear.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', margin: 0 }}>
            Not by imitating anyone. But by becoming something the world has never seen before.
          </p>
        </div>
      </article>

      {/* ── CLOSING STATEMENT ─────────────────────── */}
      <section
        style={{
          background: '#D90017',
          padding: `clamp(56px, 7vw, 100px) ${px}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', right: -60, top: -40,
            fontFamily: 'var(--font-display)', fontSize: 'clamp(140px, 28vw, 400px)',
            color: 'rgba(0,0,0,0.1)', lineHeight: 1,
            pointerEvents: 'none', letterSpacing: '-.04em', userSelect: 'none',
          }}
        >
          RR
        </div>
        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative' }}>
          <span className="rr-overline" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24, display: 'block' }}>
            ROUGE RABBIT · EST. 2023 · SOUTH AFRICA
          </span>
          <p
            className="rr-display"
            style={{ fontSize: 'clamp(28px, 5vw, 56px)', color: '#fff', margin: '0 0 12px', lineHeight: 1 }}
          >
            WE DON&apos;T CHASE THE LIGHT.
          </p>
          <p
            className="rr-display"
            style={{ fontSize: 'clamp(18px, 3vw, 32px)', color: 'rgba(255,255,255,0.65)', margin: '0 0 40px', lineHeight: 1.1 }}
          >
            We Become It.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/shop/rouge-01" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#0F0F10', color: '#E6E6E6', border: 'none',
                  padding: '14px 24px', fontFamily: 'var(--font-mono)',
                  fontSize: 11, letterSpacing: '.22em', cursor: 'pointer',
                }}
              >
                SHOP THE DROP <Arrow size={14} />
              </button>
            </Link>
            <Link href="/drops" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'transparent', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  padding: '14px 24px', fontFamily: 'var(--font-mono)',
                  fontSize: 11, letterSpacing: '.22em', cursor: 'pointer',
                }}
              >
                VIEW DROPS CALENDAR
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
