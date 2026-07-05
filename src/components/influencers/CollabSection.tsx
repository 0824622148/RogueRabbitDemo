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
          title={`${collab.name} — ${collab.collabTitle}`}
          youtubeId={collab.youtubeId}
        />
      </div>

      {/* Right: collab copy */}
      <div
        className="rr-journal-code-right"
        style={{
          padding: '64px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Index + name + location */}
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
          <span className="rr-overline">
            {collab.name} · {collab.location}
          </span>
        </div>

        <h2
          className="rr-display"
          style={{
            fontSize: 'clamp(34px, 4vw, 60px)',
            lineHeight: 0.95,
            color: '#E6E6E6',
            margin: '0 0 28px',
          }}
        >
          {collab.collabTitle}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            lineHeight: 1.8,
            color: '#E6E6E6',
            margin: '0 0 28px',
            maxWidth: 460,
          }}
        >
          {collab.collabDescription}
        </p>

        {/* About the influencer */}
        <div
          className="rr-mono"
          style={{ fontSize: 10, letterSpacing: '0.28em', color: '#D90017', marginBottom: 12 }}
        >
          ABOUT {collab.name}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            lineHeight: 1.8,
            color: '#A6A6A8',
            margin: '0 0 32px',
            maxWidth: 460,
          }}
        >
          {collab.bio}
        </p>

        {/* Social handles */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
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
      </div>
    </section>
  )
}
