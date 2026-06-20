'use client'

const POSTS = [
  { handle: '@_king.rsa',     text: 'Rouge stays winning 🔥' },
  { handle: '@mzansi.kicks',  text: 'Proper quality 🔥'       },
  { handle: '@young_stunnaa', text: 'Rabbit Run forever 🐇'   },
  { handle: '@lebo_thegoat',  text: 'Best local sneaker right now 🔥' },
  { handle: '@sbuda_031',     text: 'The fit is dangerous 🔥'  },
  { handle: '@kasi.creator',  text: 'Team Rouge ❤️'            },
  { handle: '@vuyooo_',       text: 'Need that next drop 🤩'   },
  { handle: '@_tumi.m',       text: 'These go hard 🔥'         },
]

export default function TheWall() {
  const doubled = [...POSTS, ...POSTS]

  return (
    <section style={{ borderBottom: '1px solid #3A3A3C', overflow: 'hidden' }}>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 40px',
          borderBottom: '1px solid #3A3A3C',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            className="rr-mono"
            style={{ fontSize: 10, letterSpacing: '0.28em', color: '#D90017' }}
          >
            THE WALL
          </span>
          <span
            style={{
              display: 'inline-block',
              width: 1,
              height: 12,
              background: '#3A3A3C',
            }}
          />
          <span
            className="rr-mono"
            style={{ fontSize: 10, letterSpacing: '0.22em', color: '#A6A6A8' }}
          >
            REAL VOICES. REAL COMMUNITY.
          </span>
        </div>

        <a
          href="https://www.instagram.com/rougerabbit.za"
          target="_blank"
          rel="noopener noreferrer"
          className="rr-mono"
          style={{
            fontSize: 10,
            letterSpacing: '0.22em',
            color: '#E6E6E6',
            textDecoration: 'none',
            borderBottom: '1px solid #3A3A3C',
            paddingBottom: 2,
          }}
        >
          JOIN THE CONVERSATION +
        </a>
      </div>

      {/* Scrolling social cards */}
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div
          style={{
            display: 'inline-flex',
            animation: 'rr-marquee 40s linear infinite',
          }}
        >
          {doubled.map((post, i) => (
            <div
              key={i}
              style={{
                display: 'inline-block',
                padding: '20px 28px',
                borderRight: '1px solid #3A3A3C',
                minWidth: 180,
                verticalAlign: 'top',
              }}
            >
              <div
                className="rr-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  color: '#D90017',
                  marginBottom: 10,
                }}
              >
                {post.handle}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: '#E6E6E6',
                  lineHeight: 1.55,
                  whiteSpace: 'normal',
                  maxWidth: 160,
                }}
              >
                {post.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
