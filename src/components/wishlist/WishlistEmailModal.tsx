'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWishlist } from '@/context/WishlistContext'

export default function WishlistEmailModal() {
  const { promptOpen, saveEmail, closePrompt } = useWishlist()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setLoading(true)
    await saveEmail(trimmed)
    setLoading(false)
    setValue('')
  }

  return (
    <AnimatePresence>
      {promptOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="wishlist-email-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePrompt}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 300,
            }}
          />

          {/* Modal */}
          <motion.div
            key="wishlist-email-modal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              margin: 'auto',
              height: 'fit-content',
              zIndex: 301,
              width: 'calc(100% - 32px)', maxWidth: 400,
              background: '#1E1E20',
              border: '1px solid #3A3A3C',
              padding: '36px 28px',
            }}
          >
            <button
              onClick={closePrompt}
              style={{
                position: 'absolute', top: 16, right: 20,
                background: 'none', border: 'none',
                color: '#A6A6A8', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em',
              }}
            >
              ✕ CLOSE
            </button>

            <span className="rr-overline" style={{ color: '#D90017', display: 'block', marginBottom: 12 }}>
              SAVE YOUR WISHLIST
            </span>
            <p style={{
              color: '#A6A6A8', fontSize: 12,
              lineHeight: 1.7, margin: '0 0 24px',
            }}>
              Enter your email to keep your wishlist across devices.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="YOUR@EMAIL.COM"
                value={value}
                onChange={e => { setValue(e.target.value); setError('') }}
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#0F0F10',
                  border: `1px solid ${error ? '#D90017' : '#3A3A3C'}`,
                  color: '#E6E6E6',
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  letterSpacing: '.1em',
                  padding: '14px 16px',
                  marginBottom: error ? 8 : 16,
                  outline: 'none',
                }}
              />
              {error && (
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: '#D90017', letterSpacing: '.1em',
                  margin: '0 0 16px',
                }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#D90017', color: '#E6E6E6', border: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  letterSpacing: '.22em', padding: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'SAVING...' : 'SAVE →'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
