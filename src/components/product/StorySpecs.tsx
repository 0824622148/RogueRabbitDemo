const SPECS = [
  ['UPPER',    'RECYCLED KNIT · 47% RPET'],
  ['MIDSOLE',  'INJECTED EVA · AIR CHAMBER'],
  ['OUTSOLE',  'VULCANIZED RUBBER · 4MM LUG'],
  ['LINING',   'MOISTURE-WICKING MESH'],
  ['WEIGHT',   '312G · US 9'],
  ['DESIGNED', 'JOHANNESBURG · ZA'],
  ['MADE',     'PORTUGAL · ETHICAL'],
]

export default function StorySpecs() {
  return (
    <section className="rr-story-grid" style={{ borderBottom: '1px solid #3A3A3C' }}>
      {/* Story */}
      <div className="rr-story-pad-left" style={{ borderRight: '1px solid #3A3A3C' }}>
        <span className="rr-overline" style={{ color: '#D90017' }}>[ STORY · 001 ]</span>
        <h2
          className="rr-display"
          style={{ fontSize: 96, margin: '20px 0 30px', lineHeight: 0.9 }}
        >
          BUILT<br />FOR THE<br />NIGHT.
        </h2>
        <p style={{ color: '#A6A6A8', fontSize: 15, lineHeight: 1.8, maxWidth: 480 }}>
          Designed in the city. Tested in the streets. The Rouge 01 is the first silhouette in the RR
          roster — a low-profile knit sock with a cinematic air-cushioned sole. Marked with the rabbit on
          the tongue.
          <br /><br />
          Built different. Worn loud.
        </p>
        <div style={{ marginTop: 36 }}>
          <button className="rr-btn rr-btn--ghost">READ THE FULL STORY →</button>
        </div>
      </div>

      {/* Specs */}
      <div className="rr-story-pad-right" style={{ background: '#1E1E20' }}>
        <span className="rr-overline">[ SPECS · TECH ]</span>
        <h2
          className="rr-display"
          style={{ fontSize: 64, margin: '20px 0 30px', lineHeight: 0.9 }}
        >
          THE DETAILS.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SPECS.map(([k, v]) => (
            <div
              key={k}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                padding: '16px 0',
                borderBottom: '1px solid #3A3A3C',
              }}
            >
              <span className="rr-mono">{k}</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11, letterSpacing: '.12em',
                  color: '#E6E6E6', textTransform: 'uppercase',
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
