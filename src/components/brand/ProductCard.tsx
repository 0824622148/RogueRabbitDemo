'use client'

import type { Product } from '@/types'
import { useWishlist } from '@/context/WishlistContext'
import { formatRand } from '@/lib/money'
import { isOnHold, COMING_SOON_LABEL } from '@/lib/store-status'

interface ProductCardProps {
  product: Product
  mediaHeight?: number
  indexLabel?: string
}

export default function ProductCard({ product, mediaHeight = 360, indexLabel }: ProductCardProps) {
  const mediaBg = product.mediaBg ?? '#fff'
  const isDark = mediaBg !== '#fff'
  const idxColor = isDark ? '#E6E6E6' : '#0F0F10'
  const { addItem, removeItem, isWishlisted } = useWishlist()
  // Cards built without a category (e.g. the ROUGE 01 recommendations) are footwear.
  const category = product.category ?? 'FOOTWEAR'
  const onHold = isOnHold(category)
  const ctaLabel = onHold ? COMING_SOON_LABEL : category === 'FOOTWEAR' ? 'PRE-ORDER →' : 'SHOP NOW →'
  // Wishlist rows reference products.id — product.id is only a display key.
  const wishlistProductId = product.productId ?? product.id
  const wishlistColourwayId = product.colourwayId ?? null
  const wishlisted = isWishlisted(wishlistProductId, wishlistColourwayId)

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    wishlisted
      ? removeItem(wishlistProductId, wishlistColourwayId)
      : addItem(wishlistProductId, wishlistColourwayId)
  }

  return (
    <article
      className="rr-card"
      style={{ background: '#1E1E20' }}
    >
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

        {/* Wishlist heart — hover on desktop, always visible on mobile */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`rr-card-wishlist${wishlisted ? ' rr-card-wishlist--active' : ''}`}
          style={{
            position: 'absolute',
            bottom: 14, right: 14,
            background: 'rgba(15,15,16,0.75)',
            border: '1px solid #3A3A3C',
            color: wishlisted ? '#D90017' : '#E6E6E6',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 16,
            transition: 'color .2s, opacity .2s',
          }}
        >
          {wishlisted ? '♥' : '♡'}
        </button>

        <div className="rr-card__hover">
          <span>{ctaLabel}</span>
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#E6E6E6', whiteSpace: 'nowrap' }}>
            {onHold ? COMING_SOON_LABEL : formatRand(product.price)}
          </div>
          {/* Was-price is meaningless without a current price to compare against. */}
          {!onHold && product.compareAt && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#A6A6A8',
                textDecoration: 'line-through',
                marginTop: 2,
              }}
            >
              {formatRand(product.compareAt)}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
