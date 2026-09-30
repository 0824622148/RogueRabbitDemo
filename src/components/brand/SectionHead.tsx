import Link from 'next/link'

interface SectionHeadProps {
  index: string
  kicker: string
  title: string
  action?: string
  actionHref?: string
  dark?: boolean
  /** Small red chip beside the title, e.g. "DROPPING SOON". */
  tag?: string
}

export default function SectionHead({ index, kicker, title, action, actionHref, dark = true, tag }: SectionHeadProps) {
  const textColor = dark ? '#E6E6E6' : '#0F0F10'
  const actionStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '.22em',
    color: textColor,
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid currentColor',
    paddingBottom: 4,
    cursor: 'pointer',
    textDecoration: 'none',
  }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <h2
            className="rr-display rr-section-title"
            style={{ margin: 0, color: textColor }}
          >
            {title}
          </h2>
          {tag && <span className="rr-chip rr-chip--solid">{tag}</span>}
        </div>
      </div>
      {action && (
        actionHref
          ? <Link href={actionHref} style={actionStyle}>{action} →</Link>
          : <a style={actionStyle}>{action} →</a>
      )}
    </div>
  )
}
