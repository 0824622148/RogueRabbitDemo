import type { Product } from '@/types'
import SizingGuide from './SizingGuide'

const COLOUR_MAP: Record<string, string> = {
  BLACK: '#0F0F10', WHITE: '#fff', RED: '#D90017', BLUE: '#9DC9E7', PINK: '#F3B0B9',
}

const COLOURS = ['BLACK', 'WHITE', 'RED', 'BLUE', 'PINK']
const SIZES   = ['XS', 'S', 'M', 'L', 'XL']

type Props = { products: Product[] }

export default function SideRail({ products }: Props) {
  const catCounts: Record<string, number> = {}
  const dropCounts: Record<string, number> = {}

  for (const p of products) {
    const cat = p.cat.split(' / ')[0]
    catCounts[cat] = (catCounts[cat] ?? 0) + 1
    dropCounts[p.drop_label] = (dropCounts[p.drop_label] ?? 0) + 1
  }

  const CATEGORY_ITEMS: [string, number][] = [
    ['FOOTWEAR',    catCounts['FOOTWEAR']    ?? 0],
    ['APPAREL',     catCounts['APPAREL']     ?? 0],
    ['ACCESSORIES', catCounts['ACCESSORIES'] ?? 0],
  ]

  const DROP_ITEMS: [string, number, string][] = [
    ['DROP 003 · LIVE',    dropCounts['DROP 003'] ?? 0, 'DROP 003'],
    ['DROP 002 · ARCHIVE', dropCounts['DROP 002'] ?? 0, 'DROP 002'],
    ['DROP 001 · ARCHIVE', dropCounts['DROP 001'] ?? 0, 'DROP 001'],
  ]

  function rowStyle(count: number) {
    return {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', cursor: count > 0 ? 'pointer' : 'default',
      fontSize: 13, opacity: count > 0 ? 1 : 0.35,
    }
  }

  return (
    <aside style={{ borderRight: '1px solid #3A3A3C', padding: '40px 30px' }}>

      {/* CATEGORY */}
      <div style={{ marginBottom: 38 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, alignItems: 'center' }}>
          <div className="rr-overline" style={{ color: '#E6E6E6' }}>CATEGORY</div>
          <span style={{ color: '#A6A6A8', fontFamily: 'var(--font-mono)', fontSize: 14 }}>−</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CATEGORY_ITEMS.map(([label, n]) => (
            <li key={label} style={rowStyle(n)}>
              <span>{label}</span>
              <span className="rr-mono">{n > 0 ? String(n).padStart(2, '0') : '−'}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* DROP */}
      <div style={{ marginBottom: 38 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, alignItems: 'center' }}>
          <div className="rr-overline" style={{ color: '#E6E6E6' }}>DROP</div>
          <span style={{ color: '#A6A6A8', fontFamily: 'var(--font-mono)', fontSize: 14 }}>−</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DROP_ITEMS.map(([label, n]) => (
            <li key={label} style={rowStyle(n)}>
              <span>{label}</span>
              <span className="rr-mono">{n > 0 ? String(n).padStart(2, '0') : '−'}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* COLOUR */}
      <div style={{ marginBottom: 38 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, alignItems: 'center' }}>
          <div className="rr-overline" style={{ color: '#E6E6E6' }}>COLOUR</div>
          <span style={{ color: '#A6A6A8', fontFamily: 'var(--font-mono)', fontSize: 14 }}>−</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {COLOURS.map((c) => (
            <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <span
                style={{
                  width: 14, height: 14, flexShrink: 0,
                  border: '1px solid #3A3A3C',
                  background: COLOUR_MAP[c],
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: 13 }}>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* SIZE */}
      <div style={{ marginBottom: 38 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, alignItems: 'center' }}>
          <div className="rr-overline" style={{ color: '#E6E6E6' }}>SIZE</div>
          <SizingGuide />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          {SIZES.map((s) => (
            <button key={s} className="rr-size" style={{ padding: '10px 0', fontSize: 11 }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div style={{ padding: '20px 0', borderTop: '1px solid #3A3A3C' }}>
        <div className="rr-overline" style={{ marginBottom: 10 }}>PRICE · ZAR</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#E6E6E6' }}>
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
