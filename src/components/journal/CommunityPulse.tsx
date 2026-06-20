'use client'

const ACTIVITIES = [
  'Someone from Johannesburg joined Rabbit Run',
  'Rouge Velocity added to a wishlist',
  'Last pair sold in Durban',
  'New Community Member #4288',
  'Early Access unlocked',
  'Somebody just shared a Rabbit Story',
]

function HeartbeatIcon() {
  return (
    <svg width="44" height="18" viewBox="0 0 44 18" fill="none" aria-hidden="true">
      <polyline
        points="0,9 6,9 9,2 12,16 15,6 18,12 21,9 44,9"
        stroke="#D90017"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function CommunityPulse() {
  const doubled = [...ACTIVITIES, ...ACTIVITIES]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        borderBottom: '1px solid #3A3A3C',
        overflow: 'hidden',
      }}
    >
      {/* Left: label */}
      <div
        className="rr-pulse-label"
        style={{
          flexShrink: 0,
          padding: '16px 28px',
          borderRight: '1px solid #3A3A3C',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          minWidth: 210,
        }}
      >
        <HeartbeatIcon />
        <div>
          <div className="rr-mono" style={{ fontSize: 9, letterSpacing: '0.26em', color: '#A6A6A8', lineHeight: 1.4 }}>
            COMMUNITY
          </div>
          <div
            className="rr-mono"
            style={{ fontSize: 11, letterSpacing: '0.26em', color: '#D90017', fontWeight: 600 }}
          >
            PULSE
          </div>
        </div>
      </div>

      {/* Right: scrolling ticker */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            animation: 'rr-marquee 32s linear infinite',
            gap: 0,
          }}
        >
          {doubled.map((activity, i) => (
            <span
              key={i}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 20, paddingRight: 48 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#D90017',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: '#E6E6E6',
                  padding: '16px 0',
                }}
              >
                {activity}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
