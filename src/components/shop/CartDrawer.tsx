'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart, MAX_QTY_PER_LINE } from '@/context/CartContext'
import { formatRand } from '@/lib/money'
import { SHOP_ORDERS_ON_HOLD, COMING_SOON_LABEL } from '@/lib/store-status'

const stepBtn: React.CSSProperties = {
  width: 28, height: 28, background: 'none',
  border: '1px solid #3A3A3C', color: '#E6E6E6',
  fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

export default function CartDrawer() {
  const { isOpen, closeCart, items, count, subtotal, updateQty, removeItem } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}
          />

          <motion.div
            key="cart-drawer"
            role="dialog"
            aria-label="Shopping bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: 420,
              background: '#0F0F10', borderLeft: '1px solid #3A3A3C',
              zIndex: 201, display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              padding: '24px 28px', borderBottom: '1px solid #3A3A3C',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span className="rr-overline" style={{ color: '#D90017' }}>
                [ BAG{count > 0 ? ` · ${count}` : ''} ]
              </span>
              <button
                onClick={closeCart}
                style={{
                  background: 'none', border: 'none', color: '#A6A6A8', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em',
                }}
              >
                ✕ CLOSE
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 80 }}>
                  <p className="rr-overline" style={{ color: '#A6A6A8', marginBottom: 24 }}>
                    YOUR BAG IS EMPTY
                  </p>
                  <Link
                    href="/shop/apparel"
                    onClick={closeCart}
                    style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.18em',
                      color: '#E6E6E6', textDecoration: 'underline',
                    }}
                  >
                    SHOP APPAREL →
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const atMax = item.qty >= Math.min(item.maxQty, MAX_QTY_PER_LINE)
                  return (
                    <div
                      key={item.inventoryId}
                      style={{
                        display: 'flex', gap: 16, alignItems: 'flex-start',
                        padding: '20px 0', borderBottom: '1px solid #3A3A3C',
                      }}
                    >
                      <Link
                        href={`/shop/${item.slug}?colour=${item.colourwayId}`}
                        onClick={closeCart}
                        style={{
                          width: 80, height: 80, flexShrink: 0, background: item.mediaBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        }}
                      >
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                        )}
                      </Link>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="rr-overline" style={{ color: '#E6E6E6', marginBottom: 4, fontSize: 11 }}>
                          {item.name} · {item.colourway}
                        </div>
                        <div className="rr-mono" style={{ fontSize: 10, color: '#A6A6A8', marginBottom: 10, letterSpacing: '.12em' }}>
                          SIZE {item.size} · {formatRand(item.unitPrice)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            style={stepBtn}
                            aria-label="Decrease quantity"
                            onClick={() => (item.qty <= 1 ? removeItem(item.inventoryId) : updateQty(item.inventoryId, item.qty - 1))}
                          >
                            −
                          </button>
                          <span className="rr-mono" style={{ fontSize: 12, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
                          <button
                            style={{ ...stepBtn, opacity: atMax ? 0.35 : 1, cursor: atMax ? 'default' : 'pointer' }}
                            aria-label="Increase quantity"
                            disabled={atMax}
                            onClick={() => updateQty(item.inventoryId, item.qty + 1)}
                          >
                            +
                          </button>
                          <span className="rr-mono" style={{ marginLeft: 'auto', fontSize: 12, color: '#E6E6E6' }}>
                            {formatRand(item.unitPrice * item.qty)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.inventoryId)}
                        aria-label="Remove from bag"
                        style={{
                          background: 'none', border: 'none', color: '#A6A6A8', cursor: 'pointer',
                          fontFamily: 'var(--font-mono)', fontSize: 11, padding: 0, flexShrink: 0,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {items.length > 0 && (
              <div style={{ padding: '20px 28px 28px', borderTop: '1px solid #3A3A3C' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="rr-mono" style={{ fontSize: 11, color: '#A6A6A8', letterSpacing: '.12em' }}>SUBTOTAL</span>
                  <span className="rr-mono" style={{ fontSize: 14, color: '#E6E6E6' }}>{formatRand(subtotal)}</span>
                </div>
                <p className="rr-mono" style={{ fontSize: 9, color: '#A6A6A8', letterSpacing: '.1em', lineHeight: 1.7, margin: '0 0 16px' }}>
                  DELIVERY CALCULATED AT CHECKOUT · FREE IN ENNERDALE
                </p>
                {SHOP_ORDERS_ON_HOLD ? (
                  <div className="rr-btn" style={{ width: '100%', justifyContent: 'center', opacity: 0.45 }}>
                    {COMING_SOON_LABEL}
                  </div>
                ) : (
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="rr-btn"
                    style={{ width: '100%', justifyContent: 'space-between', padding: '18px 24px', textDecoration: 'none' }}
                  >
                    <span>CHECKOUT</span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
