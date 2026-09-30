'use client'

import { useMemo, useState } from 'react'
import type { ColourwayDB, InventoryItem } from '@/types'
import type { ProductDetail } from '@/lib/queries/products'
import { useCart, MAX_QTY_PER_LINE } from '@/context/CartContext'
import { formatRand } from '@/lib/money'
import { isOnHold, COMING_SOON_LABEL } from '@/lib/store-status'

interface Props {
  product: ProductDetail
  initialColourwayId?: string
}

const VIEW_ORDER = ['FRONT', 'BACK', 'SIDE', 'TOP']

/** Show "HURRY — N LEFT" once the selected size is at or below this. */
const HURRY_AT = 10

/** Units available for a size row — 0 if sold out or stock not set. */
function available(i: InventoryItem): number {
  return i.in_stock ? Math.max(0, Number(i.stock_count ?? 0)) : 0
}

export default function ApparelPDP({ product, initialColourwayId }: Props) {
  const { addItem } = useCart()
  const onHold = isOnHold(product.category)

  const [cw, setCw] = useState<ColourwayDB>(
    product.colourways.find((c) => c.id === initialColourwayId) ?? product.colourways[0],
  )
  const images = useMemo(
    () => [...cw.images].sort((a, b) => VIEW_ORDER.indexOf(a.view) - VIEW_ORDER.indexOf(b.view)),
    [cw],
  )
  const [imgIdx, setImgIdx] = useState(0)

  // One-size products (caps) are pre-selected.
  const sizes = cw.inventory
  const [sizeId, setSizeId] = useState<number | null>(
    sizes.length === 1 && available(sizes[0]) > 0 ? sizes[0].id : null,
  )
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const selected = sizes.find((s) => s.id === sizeId) ?? null
  const maxQty = selected ? Math.min(available(selected), MAX_QTY_PER_LINE) : 1
  const soldOut = sizes.every((s) => available(s) === 0)

  const chooseColourway = (next: ColourwayDB) => {
    setCw(next)
    setImgIdx(0)
    setQty(1)
    setAdded(false)
    setSizeId(next.inventory.length === 1 && available(next.inventory[0]) > 0 ? next.inventory[0].id : null)
    // Keep the URL shareable without a navigation.
    const url = new URL(window.location.href)
    url.searchParams.set('colour', next.id)
    window.history.replaceState(null, '', url)
  }

  const add = () => {
    if (!selected || onHold) return
    addItem({
      inventoryId: selected.id,
      productId: product.id,
      slug: product.slug,
      colourwayId: cw.id,
      name: product.name,
      colourway: cw.name,
      size: selected.size_value,
      unitPrice: product.price,
      image: cw.image,
      mediaBg: product.mediaBg ?? '#1E1E20',
      maxQty: Math.min(available(selected), MAX_QTY_PER_LINE),
    }, qty)
    setAdded(true)
  }

  const mainImg = images[imgIdx]?.url ?? cw.image
  const mediaBg = product.mediaBg ?? '#1E1E20'

  return (
    <section className="rr-apdp-grid" style={{ borderBottom: '1px solid #3A3A3C' }}>
      {/* Gallery */}
      <div className="rr-apdp-gallery" style={{ borderRight: '1px solid #3A3A3C' }}>
        <div style={{ background: mediaBg, position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}>
          {mainImg && (
            <img
              src={mainImg}
              alt={`${product.name} · ${cw.name}`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
          {product.badge && (
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span className="rr-chip rr-chip--solid">{product.badge}</span>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: 1, background: '#3A3A3C', borderTop: '1px solid #3A3A3C' }}>
            {images.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setImgIdx(i)}
                aria-label={`Show ${img.view.toLowerCase()} view`}
                style={{
                  flex: 1, aspectRatio: '1 / 1', maxWidth: 120, background: mediaBg, padding: 0,
                  border: 'none', outline: i === imgIdx ? '1px solid #D90017' : 'none', outlineOffset: -1,
                  cursor: 'pointer',
                }}
              >
                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buy box */}
      <div className="rr-apdp-info">
        <div className="rr-overline" style={{ marginBottom: 8 }}>
          {[product.category, product.dropLabel].filter(Boolean).join(' / ')}
        </div>
        <h1 className="rr-display" style={{ fontSize: 'clamp(40px, 6vw, 64px)', margin: '0 0 12px', lineHeight: 0.9 }}>
          {product.name}
        </h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 32 }}>
          <span className="rr-mono" style={{ fontSize: 20, color: '#E6E6E6' }}>
            {onHold ? COMING_SOON_LABEL : formatRand(product.price)}
          </span>
          {!onHold && product.compareAt != null && (
            <span className="rr-mono" style={{ fontSize: 13, color: '#A6A6A8', textDecoration: 'line-through' }}>
              {formatRand(product.compareAt)}
            </span>
          )}
        </div>

        {/* Colourways */}
        {product.colourways.length > 1 && (
          <div style={{ marginBottom: 28 }}>
            <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>COLOUR · {cw.name}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.colourways.map((c) => (
                <button
                  key={c.id}
                  onClick={() => chooseColourway(c)}
                  aria-label={c.name}
                  aria-pressed={c.id === cw.id}
                  style={{
                    width: 44, height: 44, padding: 3, cursor: 'pointer',
                    background: c.image ? mediaBg : (c.hex || '#1E1E20'),
                    border: `1px solid ${c.id === cw.id ? '#D90017' : '#3A3A3C'}`,
                  }}
                >
                  {c.image && <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        <div style={{ marginBottom: 28 }}>
          <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>
            SIZE{selected ? ` · ${selected.size_value}` : ''}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(Math.max(sizes.length, 1), 5)}, 1fr)`, gap: 6 }}>
            {sizes.map((s) => {
              const oos = available(s) === 0
              return (
                <button
                  key={s.id}
                  onClick={() => { if (!oos) { setSizeId(s.id); setQty(1); setAdded(false) } }}
                  disabled={oos}
                  className={`rr-size ${sizeId === s.id ? 'rr-size--active' : ''} ${oos ? 'rr-size--oos' : ''}`}
                  style={{ fontSize: 11 }}
                >
                  {s.size_value}
                </button>
              )
            })}
          </div>
          {selected && available(selected) <= HURRY_AT && (
            <div className="rr-mono" style={{ fontSize: 10, color: '#D90017', marginTop: 10, letterSpacing: '.12em' }}>
              HURRY — {available(selected)} LEFT
            </div>
          )}
        </div>

        {/* Quantity */}
        {!soldOut && !onHold && (
          <div style={{ marginBottom: 28 }}>
            <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>QUANTITY</div>
            <div style={{ display: 'inline-flex', border: '1px solid #3A3A3C' }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                style={{ width: 44, height: 44, background: 'none', border: 'none', color: '#E6E6E6', cursor: 'pointer', fontSize: 16 }}
              >
                −
              </button>
              <span className="rr-mono" style={{ width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                aria-label="Increase quantity"
                disabled={qty >= maxQty}
                style={{
                  width: 44, height: 44, background: 'none', border: 'none', color: '#E6E6E6', fontSize: 16,
                  cursor: qty >= maxQty ? 'default' : 'pointer', opacity: qty >= maxQty ? 0.35 : 1,
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          onClick={add}
          disabled={onHold || soldOut || !selected}
          className="rr-btn"
          style={{
            width: '100%', justifyContent: 'space-between', padding: '18px 24px',
            opacity: onHold || soldOut || !selected ? 0.45 : 1,
            cursor: onHold || soldOut || !selected ? 'default' : 'pointer',
          }}
        >
          <span>
            {onHold
              ? COMING_SOON_LABEL
              : soldOut
                ? 'SOLD OUT'
                : !selected
                  ? 'SELECT A SIZE'
                  : `ADD TO BAG · ${formatRand(product.price * qty)}`}
          </span>
          {!onHold && !soldOut && selected && <span>→</span>}
        </button>

        {added && (
          <div className="rr-mono" style={{ fontSize: 10, color: '#2A9D2A', marginTop: 12, letterSpacing: '.12em' }}>
            ✓ ADDED TO YOUR BAG
          </div>
        )}

        <div style={{ borderTop: '1px solid #3A3A3C', marginTop: 32, paddingTop: 20 }}>
          {[
            ['DELIVERY', 'Free in Ennerdale — delivered by the Rouge Rabbit team. Nationwide with The Courier Guy, calculated at checkout.'],
            ['PAYMENT', 'Secure checkout with PayFast.'],
            ['RETURNS', 'See our shipping & returns policy.'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 16, padding: '8px 0' }}>
              <span className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', letterSpacing: '.14em', minWidth: 80 }}>{k}</span>
              <span style={{ fontSize: 13, color: '#E6E6E6', lineHeight: 1.6 }}>
                {k === 'RETURNS'
                  ? <a href="/shipping-returns" style={{ color: '#E6E6E6', textDecoration: 'underline' }}>{v}</a>
                  : v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
