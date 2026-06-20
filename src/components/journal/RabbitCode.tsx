import Image from 'next/image'

type ManifestoEntry = { text: string; highlights: string[] }

const MANIFESTO: ManifestoEntry[] = [
  { text: "WE DON'T FOLLOW CULTURE. WE HELP CREATE IT.",    highlights: ['CREATE IT.']       },
  { text: "WE DON'T SELL SNEAKERS. WE BUILD COMMUNITY.",   highlights: ['COMMUNITY.']       },
  { text: 'BUILT IN SOUTH AFRICA. WORN EVERYWHERE.',        highlights: ['WORN EVERYWHERE.'] },
  { text: 'FROM THE KASI TO THE WORLD.',                    highlights: ['KASI', 'WORLD.']   },
  { text: 'IF YOU KNOW. YOU KNOW.',                         highlights: ['KNOW.', 'KNOW.']   },
]

const VOICE = {
  quote:
    'I bought Rouge because I liked the design. I stayed because every time I wore them somebody asked where I got them.',
  attribution: 'Jason, Pretoria',
}

function ManifestoLine({ text, highlights }: ManifestoEntry) {
  let remaining = text
  const parts: { t: string; red: boolean }[] = []

  for (const h of highlights) {
    const idx = remaining.indexOf(h)
    if (idx === -1) continue
    if (idx > 0) parts.push({ t: remaining.slice(0, idx), red: false })
    parts.push({ t: h, red: true })
    remaining = remaining.slice(idx + h.length)
  }
  if (remaining) parts.push({ t: remaining, red: false })

  return (
    <p
      className="rr-display"
      style={{
        fontSize: 'clamp(18px, 2.2vw, 34px)',
        lineHeight: 1.2,
        marginBottom: 14,
        color: '#E6E6E6',
      }}
    >
      {parts.map((p, i) => (
        <span key={i} style={p.red ? { color: '#D90017' } : undefined}>
          {p.t}
        </span>
      ))}
    </p>
  )
}

export default function RabbitCode() {
  return (
    <section
      className="rr-journal-code"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid #3A3A3C',
      }}
    >
      {/* Left: Manifesto */}
      <div
        className="rr-journal-code-left"
        style={{
          padding: '80px 60px',
          borderRight: '1px solid #3A3A3C',
        }}
      >
        <div
          className="rr-mono"
          style={{ fontSize: 10, letterSpacing: '0.28em', color: '#D90017', marginBottom: 44 }}
        >
          THE RABBIT CODE
        </div>

        {MANIFESTO.map((line, i) => (
          <ManifestoLine key={i} {...line} />
        ))}
      </div>

      {/* Right: Voice of the Week */}
      <div
        className="rr-journal-code-right"
        style={{
          padding: '80px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          className="rr-mono"
          style={{ fontSize: 10, letterSpacing: '0.28em', color: '#D90017', marginBottom: 40 }}
        >
          VOICE OF THE WEEK
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <blockquote
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(20px, 2vw, 30px)',
                fontWeight: 600,
                lineHeight: 1.4,
                color: '#E6E6E6',
                margin: '0 0 28px',
              }}
            >
              &ldquo;{VOICE.quote}&rdquo;
            </blockquote>
            <p
              className="rr-mono"
              style={{ fontSize: 11, letterSpacing: '0.18em', color: '#A6A6A8' }}
            >
              — {VOICE.attribution}
            </p>
          </div>

          <div
            style={{
              flexShrink: 0,
              width: 110,
              height: 150,
              overflow: 'hidden',
              background: '#1E1E20',
              position: 'relative',
            }}
          >
            <Image
              src="/uploads/editorial-campaign-03.png"
              alt="Voice of the Week"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
