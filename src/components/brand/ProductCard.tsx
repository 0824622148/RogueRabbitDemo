import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  mediaHeight?: number
  indexLabel?: string
}

export default function ProductCard({ product, mediaHeight = 360, indexLabel }: ProductCardProps) {
  const mediaBg = product.mediaBg ?? '#fff'
  const isDark = mediaBg !== '#fff'
  const idxColor = isDark ? '#E6E6E6' : '#0F0F10'

  return (
    <article className="rr-card" style={{ background: '#1E1E20' }}>
      <div
        className="rr-card__media"
        style={{ height: mediaHeight, background: mediaBg, position: 'relative', overflow: 'hidden' }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            inset: 0,
            margin: 'auto',
            width: `${(product.contain ?? 1) * 100}%`,
            height: `${(product.contain ?? 1) * 100}%`,
            objectFit: (product.fit as 'contain' | 'cover') ?? 'contain',
            objectPosition: product.objectPos ?? 'center',
            transition: 'transform .8s cubic-bezier(.2,.7,.2,1)',
          }}
        />
        {product.badge && (
          <div style={{ position: 'absolute', top: 14, left: 14 }}>
            <span className="rr-chip rr-chip--solid">{product.badge}</span>
          </div>
        )}
        {indexLabel && (
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <span className="rr-mono" style={{ color: idxColor }}>{indexLabel}</span>
          </div>
        )}
        <div className="rr-card__hover">
          <span>QUICK ADD →</span>
          <span>{product.sizes ? `${product.sizes} SIZES` : 'VIEW'}</span>
        </div>
      </div>
      <div
        style={{
          padding: '18px 18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div>
          <div className="rr-overline" style={{ marginBottom: 6 }}>{product.cat || 'FOOTWEAR'}</div>
          <h3 className="rr-display" style={{ fontSize: 26, margin: 0, color: '#E6E6E6' }}>
            {product.name}
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#E6E6E6' }}>
            R{product.price}
          </div>
          {product.compareAt && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#A6A6A8',
                textDecoration: 'line-through',
                marginTop: 2,
              }}
            >
              R{product.compareAt}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
