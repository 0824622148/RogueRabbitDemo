interface SectionHeadProps {
  index: string
  kicker: string
  title: string
  action?: string
  dark?: boolean
}

export default function SectionHead({ index, kicker, title, action, dark = true }: SectionHeadProps) {
  const textColor = dark ? '#E6E6E6' : '#0F0F10'
  return (
    <div
      className="rr-sectionhead-pad"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 36,
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <span
            style={{
              color: '#D90017',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '.22em',
            }}
          >
            [ {index} ]
          </span>
          <span className="rr-overline">{kicker}</span>
        </div>
        <h2
          className="rr-display rr-section-title"
          style={{ margin: 0, color: textColor }}
        >
          {title}
        </h2>
      </div>
      {action && (
        <a
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '.22em',
            color: textColor,
            textTransform: 'uppercase',
            borderBottom: '1px solid currentColor',
            paddingBottom: 4,
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          {action} →
        </a>
      )}
    </div>
  )
}
