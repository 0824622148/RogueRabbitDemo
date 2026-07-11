import VideoFacade from './VideoFacade'
import type { Collab } from './collabs'

type CollabSectionProps = {
  collab: Collab
  index: number
}

export default function CollabSection({ collab, index }: CollabSectionProps) {
  return (
    <section
      id={collab.id}
      className="rr-journal-code"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid #3A3A3C',
      }}
    >
      {/* Left: testimonial video */}
      <div
        className="rr-journal-code-left"
        style={{
          padding: '48px',
          borderRight: '1px solid #3A3A3C',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <VideoFacade
          poster={collab.poster}
          title={`${collab.name} — Rouge Rabbit testimonial`}
          youtubeId={collab.youtubeId}
        />
      </div>

      {/* Right: influencer copy */}
      <div
        className="rr-journal-code-right"
        style={{
          padding: '64px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Index + eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <span
            style={{
              color: '#D90017',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '.22em',
            }}
          >
            [ {String(index + 1).padStart(2, '0')} ]
          </span>
          <span className="rr-overline">ROUGE RABBIT · AMBASSADOR</span>
        </div>

        {/* Name */}
        <h2
          className="rr-display"
          style={{
            fontSize: 'clamp(48px, 6vw, 88px)',
            lineHeight: 0.9,
            color: '#E6E6E6',
            margin: '0 0 28px',
            display: 'flex',
            alignItems: 'baseline',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          {collab.name}
          <span style={{ fontSize: '0.4em' }}>{collab.emoji}</span>
        </h2>

        {/* Bio */}
        {collab.bio.map((para, i) => (
          <p
            key={i}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              lineHeight: 1.8,
              color: '#E6E6E6',
              margin: '0 0 18px',
              maxWidth: 480,
            }}
          >
            {para}
          </p>
        ))}

        {/* Fun fact */}
        {collab.funFact && (
          <div
            style={{
              borderLeft: '2px solid #D90017',
              padding: '4px 0 4px 18px',
              margin: '14px 0 8px',
              maxWidth: 480,
            }}
          >
            <div
              className="rr-mono"
              style={{ fontSize: 10, letterSpacing: '0.28em', color: '#D90017', marginBottom: 8 }}
            >
              FUN FACT
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                lineHeight: 1.75,
                color: '#A6A6A8',
                margin: 0,
              }}
            >
              {collab.funFact}
            </p>
          </div>
        )}

        {/* Motto */}
        <div style={{ marginTop: 28 }}>
          <div
            className="rr-mono"
            style={{ fontSize: 10, letterSpacing: '0.28em', color: '#D90017', marginBottom: 12 }}
          >
            MOTTO
          </div>
          <blockquote
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(18px, 2vw, 26px)',
              fontWeight: 600,
              lineHeight: 1.35,
              color: '#E6E6E6',
              margin: 0,
              maxWidth: 480,
            }}
          >
            &ldquo;{collab.motto}&rdquo;
          </blockquote>
        </div>

        {/* Social handles (optional) */}
        {collab.socials && collab.socials.length > 0 && (
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 32 }}>
            {collab.socials.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rr-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  color: '#E6E6E6',
                  textDecoration: 'none',
                  borderBottom: '1px solid #3A3A3C',
                  paddingBottom: 4,
                  display: 'inline-flex',
                  gap: 8,
                }}
              >
                <span style={{ color: '#D90017' }}>{social.platform.toUpperCase()}</span>
                {social.handle}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
