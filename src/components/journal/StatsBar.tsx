const STATS = [
  { value: '4,287+', label: 'RABBIT RUN MEMBERS', accent: false },
  { value: '1,200+', label: 'STORIES SHARED',     accent: false },
  { value: '85%',    label: 'RETURN CUSTOMERS',   accent: true  },
  { value: '8',      label: 'PROVINCES REPRESENTED', accent: false },
]

export default function StatsBar() {
  return (
    <div
      className="rr-journal-stats"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid #3A3A3C',
        borderBottom: '1px solid #3A3A3C',
      }}
    >
      {STATS.map((stat, i) => (
        <div
          key={i}
          style={{
            padding: '40px',
            borderLeft: i > 0 ? '1px solid #3A3A3C' : undefined,
          }}
        >
          <div
            className="rr-display"
            style={{
              fontSize: 'clamp(36px, 4vw, 64px)',
              lineHeight: 1,
              color: stat.accent ? '#D90017' : '#E6E6E6',
              marginBottom: 10,
            }}
          >
            {stat.value}
          </div>
          <div className="rr-mono" style={{ fontSize: 10, letterSpacing: '0.24em', color: '#A6A6A8' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
