export default function OnFootStrip() {
  return (
    <section
      style={{
        height: 520, position: 'relative',
        borderBottom: '1px solid #3A3A3C', overflow: 'hidden',
      }}
    >
      <img
        src="/uploads/r-014.png"
        alt="Rouge 01 On Foot"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', filter: 'brightness(0.4)',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '.3em', marginBottom: 18, color: '#A6A6A8',
            }}
          >
            [ ON FOOT · CAMPAIGN FILM · 00:42 ]
          </div>
          <div
            className="rr-display rr-onfoot-title"
            style={{ lineHeight: 1, color: '#E6E6E6', letterSpacing: '-.01em' }}
          >
            WEAR THE EDGE.
          </div>
        </div>
      </div>

      <div className="rr-plus" style={{ top: 24, left: 24 }} />
      <div className="rr-plus" style={{ top: 24, right: 24 }} />
      <div className="rr-plus" style={{ bottom: 24, left: 24 }} />
      <div className="rr-plus" style={{ bottom: 24, right: 24 }} />

      <button
        style={{
          position: 'absolute', left: '50%', bottom: 56,
          transform: 'translateX(-50%)',
          width: 78, height: 78, borderRadius: '50%',
          background: '#D90017', color: '#E6E6E6',
          border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24,
        }}
      >
        ▶
      </button>
    </section>
  )
}
