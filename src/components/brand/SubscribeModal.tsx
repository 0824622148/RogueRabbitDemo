'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSubscribeModal } from '@/context/SubscribeContext'
import SubscribeForm from './SubscribeForm'

export default function SubscribeModal() {
  const { isOpen, closeSubscribe } = useSubscribeModal()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="subscribe-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSubscribe}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 300,
            }}
          />

          {/* Modal */}
          <motion.div
            key="subscribe-modal"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Join the Rouge Rabbit list"
            style={{
              position: 'fixed',
              inset: 0,
              margin: 'auto',
              height: 'fit-content',
              zIndex: 301,
              width: 'calc(100% - 32px)', maxWidth: 420,
              background: '#1E1E20',
              border: '1px solid #3A3A3C',
              padding: '36px 28px',
            }}
          >
            <button
              onClick={closeSubscribe}
              aria-label="Close"
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
              MEMBERS · ONLY
            </span>
            <h2
              className="rr-display"
              style={{ fontSize: 40, lineHeight: 0.95, margin: '0 0 14px', color: '#E6E6E6' }}
            >
              GET IN EARLY.
            </h2>
            <p style={{ color: '#A6A6A8', fontSize: 12, lineHeight: 1.7, margin: '0 0 24px' }}>
              48-hour early access to every drop. Numbered pairs reserved. No spam, no noise.
            </p>

            <SubscribeForm
              source="navbar"
              variant="stacked"
              tone="onDark"
              buttonLabel="JOIN"
              placeholder="YOUR@EMAIL.COM"
              autoFocus
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
