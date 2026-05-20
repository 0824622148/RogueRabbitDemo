import RougeLogo from './RougeLogo'

const FOOTER_COLS = [
  { title: 'SHOP',    items: ['New Arrivals', 'Footwear', 'Apparel', 'Accessories', 'Sale'] },
  { title: 'WORLD',   items: ['Drops Calendar', 'Lookbook', 'Journal', 'Stockists'] },
  { title: 'SUPPORT', items: ['Sizing', 'Shipping', 'Returns', 'Contact'] },
  { title: 'LEGAL',   items: ['Terms', 'Privacy', 'Cookies'] },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: '#070708',
        borderTop: '1px solid #3A3A3C',
        padding: '60px 40px 30px',
        color: '#E6E6E6',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr',
          gap: 40,
          marginBottom: 60,
        }}
      >
        <div>
          <RougeLogo size={48} withWordmark />
          <p
            style={{
              marginTop: 22,
              fontSize: 13,
              color: '#A6A6A8',
              lineHeight: 1.7,
              maxWidth: 320,
            }}
          >
            Built different. Worn by the ones who refuse to blend in. Independent streetwear out of every corner that
            doesn&apos;t ask for permission.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {['IG', 'TT', 'YT', 'X'].map((s) => (
              <a
                key={s}
                style={{
                  width: 36,
                  height: 36,
                  border: '1px solid #3A3A3C',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '.1em',
                  color: '#E6E6E6',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
        {FOOTER_COLS.map(({ title, items }) => (
          <div key={title}>
            <div className="rr-overline" style={{ marginBottom: 18 }}>{title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((item) => (
                <li key={item}>
                  <a style={{ color: '#E6E6E6', fontSize: 13, cursor: 'pointer', textDecoration: 'none' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rr-hair" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: 22,
          alignItems: 'center',
        }}
      >
        <span className="rr-mono">© 2026 ROUGE RABBIT · ALL RIGHTS RESERVED</span>
        <span className="rr-mono">REAL · RAW · ROUGE</span>
        <span className="rr-mono">EST 2023 · INDEPENDENT</span>
      </div>
    </footer>
  )
}
