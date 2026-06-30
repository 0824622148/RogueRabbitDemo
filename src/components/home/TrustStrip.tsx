const TRUST_ITEMS = [
  ['NUMBERED EDITIONS',   "Each pair logged. Once it's gone, it's gone."],
  ['NATIONWIDE DELIVERY', 'Door-to-door by The Courier Guy.'],
  ['RETURNS · 30 DAYS',   "Don't love it? Send it back."],
  ['MEMBERS DROP FIRST',  'Sign up · 48h early access.'],
] as const

export default function TrustStrip() {
  return (
    <section
      className="rr-trust-grid"
      style={{ borderBottom: '1px solid #3A3A3C' }}
    >
      {TRUST_ITEMS.map(([title, desc]) => (
        <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span
            style={{
              width: 28, height: 28,
              border: '1px solid #D90017', color: '#D90017',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 11, flexShrink: 0,
            }}
          >
            +
          </span>
          <div>
            <div className="rr-mono" style={{ color: '#E6E6E6' }}>{title}</div>
            <div style={{ color: '#A6A6A8', fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>{desc}</div>
          </div>
        </div>
      ))}
    </section>
  )
}
