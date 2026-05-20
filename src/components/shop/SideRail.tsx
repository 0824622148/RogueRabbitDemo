const COLOUR_MAP: Record<string, string> = {
  BLACK: '#0F0F10', WHITE: '#fff', RED: '#D90017', BLUE: '#9DC9E7', PINK: '#F3B0B9',
}

const FILTER_GROUPS = [
  { t: 'CATEGORY', items: [['FOOTWEAR', 12], ['APPAREL', 18], ['ACCESSORIES', 8]] as [string, number][] },
  { t: 'DROP',     items: [['DROP 003 · LIVE', 12], ['DROP 002 · ARCHIVE', 16], ['DROP 001 · ARCHIVE', 10]] as [string, number][] },
  { t: 'COLOUR',   items: [['BLACK', 14], ['WHITE', 6], ['RED', 4], ['BLUE', 3], ['PINK', 2]] as [string, number][] },
  { t: 'SIZE',     items: [['XS', 0], ['S', 0], ['M', 0], ['L', 0], ['XL', 0]] as [string, number][] },
]

export default function SideRail() {
  return (
    <aside style={{ borderRight: '1px solid #3A3A3C', padding: '40px 30px' }}>
      {FILTER_GROUPS.map((g) => (
        <div key={g.t} style={{ marginBottom: 38 }}>
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', marginBottom: 18, alignItems: 'center',
            }}
          >
            <div className="rr-overline" style={{ color: '#E6E6E6' }}>{g.t}</div>
            <span style={{ color: '#A6A6A8', fontFamily: 'var(--font-mono)', fontSize: 14 }}>−</span>
          </div>

          {g.t === 'SIZE' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {g.items.map(([s]) => (
                <button key={s} className="rr-size" style={{ padding: '10px 0', fontSize: 11 }}>
                  {s}
                </button>
              ))}
            </div>
          ) : g.t === 'COLOUR' ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {g.items.map(([c, n]) => (
                <li
                  key={c}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        width: 14, height: 14,
                        border: '1px solid #3A3A3C',
                        background: COLOUR_MAP[c],
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontSize: 13 }}>{c}</span>
                  </span>
                  <span className="rr-mono">{String(n).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {g.items.map(([item, n]) => (
                <li
                  key={item}
                  style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13 }}
                >
                  <span>{item}</span>
                  <span className="rr-mono">{String(n).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Price range */}
      <div style={{ padding: '20px 0', borderTop: '1px solid #3A3A3C' }}>
        <div className="rr-overline" style={{ marginBottom: 10 }}>PRICE · ZAR</div>
        <div
          style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)', fontSize: 12, color: '#E6E6E6',
          }}
        >
          <span>R45</span><span>R420</span>
        </div>
        <div style={{ position: 'relative', height: 2, background: '#3A3A3C', marginTop: 12 }}>
          <div style={{ position: 'absolute', left: '10%', right: '30%', height: 2, background: '#D90017' }} />
          <div style={{ position: 'absolute', left: '10%', top: -4, width: 10, height: 10, background: '#E6E6E6' }} />
          <div style={{ position: 'absolute', left: '70%', top: -4, width: 10, height: 10, background: '#E6E6E6' }} />
        </div>
      </div>
    </aside>
  )
}
