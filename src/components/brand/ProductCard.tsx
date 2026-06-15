'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { useWishlist } from '@/context/WishlistContext'

interface ProductCardProps {
  product: Product
  mediaHeight?: number
  indexLabel?: string
}

export default function ProductCard({ product, mediaHeight = 360, indexLabel }: ProductCardProps) {
  const mediaBg = product.mediaBg ?? '#fff'
  const isDark = mediaBg !== '#fff'
  const idxColor = isDark ? '#E6E6E6' : '#0F0F10'
  const [hovered, setHovered] = useState(false)
  const { addItem, removeItem, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    wishlisted ? removeItem(product.id) : addItem(product.id)
  }

  return (
    <article
      className="rr-card"
      style={{ background: '#1E1E20' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

        {/* Wishlist heart — visible on hover or when wishlisted */}
        {(hovered || wishlisted) && (
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
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
              transition: 'color .2s',
            }}
          >
            {wishlisted ? '♥' : '♡'}
          </button>
        )}

        <div className="rr-card__hover">
          <span>PRE-ORDER →</span>
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
