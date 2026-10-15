import NavBar from './NavBar'
import Footer from './Footer'
import Marquee from './Marquee'
import Asterisk from './Asterisk'
import SubscribeForm from './SubscribeForm'
import { formatDropDate } from '@/lib/drop-dates'
import type { HeroPanel } from '@/types'

interface DroppingSoonProps {
  title: string
  eyebrow?: string
  /** Teaser line under "Dropping Soon" — replaces the generic copy. */
  tagline?: string | null
  /** Sneak-peek shots (e.g. a drop's front / back) shown under the title. */
  images?: HeroPanel[] | null
  /** Artwork shown darkened behind the title (e.g. the drop's back print). */
  background?: string | null
  /** YYYY-MM-DD — swaps "Dropping Soon" for the date and adds the members sign-up. */
  releaseDate?: string | null
}

export default function DroppingSoon({ title, eyebrow, tagline, images, background, releaseDate }: DroppingSoonProps) {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', isolation: 'isolate' }}>

        {background && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={background}
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.55, zIndex: -1 }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(15,15,16,.85) 0%, rgba(15,15,16,.7) 70%, rgba(15,15,16,.92) 100%)', zIndex: -1 }} />
          </>
        )}

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
          {releaseDate ? `Dropping ${formatDropDate(releaseDate)}` : 'Dropping Soon'}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36, width: '100%', maxWidth: 480 }}>
          <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
          <Asterisk size={10} color="#3A3A3C" />
          <div style={{ flex: 1, height: 1, background: '#3A3A3C' }} />
        </div>

        {/* Body copy */}
        <p style={{ fontSize: 14, color: '#A6A6A8', lineHeight: 1.8, maxWidth: 400, margin: '0 0 40px' }}>
          {tagline ?? <>Something wild is on its way. Stay locked in — we&apos;ll let you know when it&apos;s ready to drop.</>}
        </p>

        {/* Members sign-up — only for a dated drop, where early access means something */}
        {releaseDate && (
          <div style={{ width: '100%', maxWidth: 420, margin: '0 0 28px', textAlign: 'left' }}>
            <span className="rr-overline" style={{ color: '#D90017', display: 'block', marginBottom: 14, textAlign: 'center' }}>
              MEMBERS GET 48H EARLY ACCESS
            </span>
            <SubscribeForm source="drop" buttonLabel="GET EARLY ACCESS" />
          </div>
        )}

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

      {images && images.length > 0 && (
        <section style={{ borderBottom: '1px solid #3A3A3C', padding: 40 }} className="rr-catalog-grid-pad">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: '#3A3A3C' }}>
            {images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', objectPosition: img.pos ?? 'center' }}
              />
            ))}
          </div>
        </section>
      )}

      <Marquee items={['NO FEAR', 'JUST MOTION', releaseDate ? `DROPPING ${formatDropDate(releaseDate)}` : 'DROPPING SOON', 'ROUGE RABBIT']} speed={28} accent="rouge" />

      <Footer />
    </div>
  )
}
