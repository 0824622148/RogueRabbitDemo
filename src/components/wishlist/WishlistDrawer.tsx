'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useWishlist } from '@/context/WishlistContext'

export default function WishlistDrawer() {
  const { isOpen, closeDrawer, items, isLoading, removeItem } = useWishlist()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="wishlist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 200,
            }}
          />

          {/* Drawer panel */}
          <motion.div
            key="wishlist-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: 420,
              background: '#0F0F10',
              borderLeft: '1px solid #3A3A3C',
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid #3A3A3C',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span className="rr-overline" style={{ color: '#D90017' }}>
                [ WISHLIST{items.length > 0 ? ` · ${items.length}` : ''} ]
              </span>
              <button
                onClick={closeDrawer}
                style={{
                  background: 'none', border: 'none',
                  color: '#A6A6A8', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em',
                }}
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px' }}>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', gap: 16, alignItems: 'flex-start',
                        padding: '20px 0',
                        borderBottom: '1px solid #3A3A3C',
                      }}
                    >
                      <div style={{ width: 80, height: 80, flexShrink: 0, background: '#2A2A2C' }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ height: 10, width: '60%', background: '#2A2A2C' }} />
                        <div style={{ height: 10, width: '30%', background: '#2A2A2C' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 80 }}>
                  <div style={{ fontSize: 32, marginBottom: 16, color: '#3A3A3C' }}>♡</div>
                  <p className="rr-overline" style={{ color: '#A6A6A8', marginBottom: 24 }}>
                    YOUR WISHLIST IS EMPTY
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeDrawer}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      letterSpacing: '.18em', color: '#E6E6E6',
                      textDecoration: 'underline',
                    }}
                  >
                    SHOP NOW →
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                      padding: '20px 0',
                      borderBottom: '1px solid #3A3A3C',
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: 80, height: 80, flexShrink: 0,
                      background: item.mediaBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          style={{ width: '90%', height: '90%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ color: '#3A3A3C', fontSize: 24 }}>♡</span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="rr-overline" style={{ color: '#E6E6E6', marginBottom: 4, fontSize: 11 }}>
                        {item.productName}
                        {item.colourwayName ? ` · ${item.colourwayName}` : ''}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        color: '#A6A6A8', marginBottom: 12,
                      }}>
                        R{item.price}
                      </div>
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeDrawer}
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10,
                          letterSpacing: '.18em', color: '#D90017',
                          textDecoration: 'none',
                        }}
                      >
                        PRE-ORDER →
                      </Link>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId, item.colourwayId)}
                      style={{
                        background: 'none', border: 'none',
                        color: '#A6A6A8', cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        padding: 0, flexShrink: 0,
                      }}
                      aria-label="Remove from wishlist"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
