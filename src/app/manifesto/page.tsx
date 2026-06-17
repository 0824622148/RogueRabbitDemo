import type { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import Arrow from '@/components/brand/Arrow'

export const metadata: Metadata = {
  title: 'Manifesto — Rouge Rabbit',
  description: 'Not for everyone. Rouge Rabbit is South African independent streetwear built for the ones who already know exactly who they are.',
}

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
          padding: 'clamp(70px, 10vw, 130px) 40px clamp(60px, 8vw, 100px)',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 80% 50%, rgba(217,0,23,0.12), transparent 60%)',
          }}
        />

        {/* Ghost text */}
        <div
          style={{
            position: 'absolute', right: -40, top: -60,
            fontFamily: 'var(--font-display)', fontSize: 'clamp(260px, 36vw, 480px)',
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
              fontSize: 'clamp(64px, 12vw, 160px)',
              margin: 0, lineHeight: 0.88, letterSpacing: '-0.02em',
            }}
          >
            NOT FOR<br />
            <span style={{ color: '#D90017' }}>EVERYONE.</span>
          </h1>
          <p
            style={{
              marginTop: 36, fontSize: 16, lineHeight: 1.8,
              color: '#A6A6A8', maxWidth: 520,
            }}
          >
            That&apos;s not a warning. That&apos;s a filter.
          </p>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────── */}
      <article style={{ maxWidth: 780, margin: '0 auto', padding: 'clamp(60px, 7vw, 100px) 40px' }}>

        {/* Opening */}
        <p
          style={{
            fontSize: 'clamp(17px, 2.2vw, 21px)',
            lineHeight: 1.85, color: '#C8C8CA', marginBottom: 60,
          }}
        >
          Rouge Rabbit was never built for the masses. It was built for the one — the one
          in the room who dresses like they mean it. Who doesn&apos;t trend-chase. Who already
          decided who they are before the algorithm had an opinion.
        </p>

        {/* Section — Who We Are */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>01</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2
            className="rr-display"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: '0 0 28px', lineHeight: 0.9 }}
          >
            WHO WE ARE.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 18 }}>
            South African. Independent. Made without permission.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8' }}>
            Born out of a corner of this continent the world consistently overlooks — and
            consistently underestimates. We don&apos;t come from Paris or New York or Tokyo.
            We come from here. From the streets and the dust and the noise. From cities that
            move faster than they sleep. From a generation that&apos;s done waiting to be let in.
          </p>
        </div>

        {/* Pull quote */}
        <div
          style={{
            borderLeft: '3px solid #D90017',
            paddingLeft: 28, marginBottom: 64,
          }}
        >
          <p
            className="rr-display"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#E6E6E6', margin: 0, lineHeight: 1.15 }}
          >
            &ldquo;We come from the places that were never on the mood board.&rdquo;
          </p>
        </div>

        {/* Section — The Rabbit */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>02</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2
            className="rr-display"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: '0 0 28px', lineHeight: 0.9 }}
          >
            THE RABBIT.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 18 }}>
            Is not a mascot. It&apos;s a marker.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 18 }}>
            Every pair is numbered. Every drop is limited. When you wear the rabbit, you
            wear something made for fewer than 250 people on earth. That&apos;s not exclusivity
            for the sake of it — it&apos;s a statement. Value takes space. Scarcity is honest.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8' }}>
            The rabbit doesn&apos;t follow. It moves first and fast, and it doesn&apos;t look back
            to check who&apos;s keeping up.
          </p>
        </div>

        {/* Section — What We Make */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>03</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2
            className="rr-display"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: '0 0 28px', lineHeight: 0.9 }}
          >
            WHAT WE MAKE.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 18 }}>
            Footwear that doesn&apos;t apologize.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 18 }}>
            Knit uppers built tight. Soles cut clean. Silhouettes that don&apos;t borrow from
            anything. Each drop is a chapter. Each colourway is a decision. Nothing is
            accidental — not the shape, not the colour, not the count.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8' }}>
            The Rouge 01 is Chapter One. The beginning of something without a visible ending.
            Apparel and accessories follow. The world gets built one piece at a time.
          </p>
        </div>

        {/* Section — What We Refuse */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>04</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2
            className="rr-display"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: '0 0 28px', lineHeight: 0.9 }}
          >
            WHAT WE REFUSE.
          </h2>
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 1, marginBottom: 32, border: '1px solid #3A3A3C',
            }}
          >
            {['FAST.', 'SAFE.', 'DISPOSABLE.', 'FORGETTABLE.'].map((word) => (
              <div
                key={word}
                style={{
                  padding: '20px 24px', background: '#1E1E20',
                  borderRight: '1px solid #3A3A3C',
                }}
              >
                <span
                  className="rr-display"
                  style={{ fontSize: 22, color: '#3A3A3C', letterSpacing: '0.01em' }}
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 18 }}>
            We refuse to overstock. We refuse to markdown. We refuse to make the same
            thing twice just because it sold. Rouge Rabbit lives or dies by the quality
            of its decisions — not the volume of its output.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8' }}>
            We don&apos;t chase the algorithm because the algorithm chases relevance.
            We chase permanence.
          </p>
        </div>

        {/* Pull quote */}
        <div
          style={{
            borderLeft: '3px solid #D90017',
            paddingLeft: 28, marginBottom: 64,
          }}
        >
          <p
            className="rr-display"
            style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#E6E6E6', margin: 0, lineHeight: 1.15 }}
          >
            &ldquo;We don&rsquo;t chase the algorithm. The algorithm chases relevance. We chase permanence.&rdquo;
          </p>
        </div>

        {/* Section — For the Ones Who Get It */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <span className="rr-mono" style={{ color: '#D90017', fontSize: 10, letterSpacing: '.22em' }}>05</span>
            <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          </div>
          <h2
            className="rr-display"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', margin: '0 0 28px', lineHeight: 0.9 }}
          >
            FOR THE ONES<br />WHO GET IT.
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#C8C8CA', marginBottom: 18 }}>
            You know who you are. You weren&apos;t waiting for a brand to tell you.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8', marginBottom: 18 }}>
            You dress like you have somewhere to be, even when you don&apos;t. You buy one
            thing and you own it. You know the difference between hype and heritage. You
            support the local because you understand that independence costs something —
            and that something is worth paying.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#A6A6A8' }}>
            This is for you. The one in the back of the room. Wear it loud.
            Or don&apos;t wear it at all.
          </p>
        </div>
      </article>

      {/* ── CLOSING STATEMENT ─────────────────────── */}
      <section
        style={{
          background: '#D90017',
          padding: 'clamp(60px, 7vw, 100px) 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', right: -80, top: -60,
            fontFamily: 'var(--font-display)', fontSize: 'clamp(200px, 30vw, 400px)',
            color: 'rgba(0,0,0,0.12)', lineHeight: 1,
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
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: '#fff', margin: '0 0 12px', lineHeight: 1,
            }}
          >
            REAL · RAW · ROUGE.
          </p>
          <p
            className="rr-display"
            style={{
              fontSize: 'clamp(20px, 3vw, 32px)',
              color: 'rgba(255,255,255,0.65)', margin: '0 0 44px', lineHeight: 1.1,
            }}
          >
            Built different. Won&apos;t stop.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/shop/rouge-01" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  background: '#0F0F10', color: '#E6E6E6', border: 'none',
                  padding: '16px 28px', fontFamily: 'var(--font-mono)',
                  fontSize: 11, letterSpacing: '.22em', cursor: 'pointer',
                }}
              >
                SHOP THE DROP <Arrow size={14} />
              </button>
            </Link>
            <Link href="/drops" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  background: 'transparent', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  padding: '16px 28px', fontFamily: 'var(--font-mono)',
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
