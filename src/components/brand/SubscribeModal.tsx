'use client'

import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSubscribeModal } from '@/context/SubscribeContext'
import type { PopupDrop } from '@/types'
import SubscribeForm from './SubscribeForm'

interface Props {
  /** Featured drop whose campaign art themes the popup; null = plain card. */
  drop: PopupDrop | null
}

// How long the ✓ confirmation stays up before the modal closes itself.
const SUCCESS_CLOSE_MS = 2500

function blurb(drop: PopupDrop | null) {
  if (!drop) {
    return '48-hour early access to every drop. Numbered pairs reserved. No spam, no noise — just tell us where to send it.'
  }
  const name = drop.name.toUpperCase()
  return drop.status === 'coming_soon'
    ? `Be first when ${name} lands. 48-hour early access, before it goes public. No spam, no noise.`
    : `${name} is live. Members get 48-hour early access to every drop after it. No spam, no noise.`
}

export default function SubscribeModal({ drop }: Props) {
  const { isOpen, source, closeSubscribe, dismissSubscribe } = useSubscribeModal()
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const split = Boolean(drop?.image)

  // Escape closes; the page behind doesn't scroll while the modal is up.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismissSubscribe()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      clearTimeout(closeTimer.current)
    }
  }, [isOpen, dismissSubscribe])

  const handleSuccess = useCallback(() => {
    closeTimer.current = setTimeout(closeSubscribe, SUCCESS_CLOSE_MS)
  }, [closeSubscribe])

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
            onClick={dismissSubscribe}
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
            className={`rr-sub-modal ${split ? 'rr-sub-modal--split' : 'rr-sub-modal--plain'}`}
          >
            {split && drop?.image && (
              <div className="rr-sub-modal-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="rr-sub-modal-photo"
                  src={drop.image.src}
                  alt={drop.image.alt}
                  style={{ objectPosition: drop.image.pos ?? 'center' }}
                />
                <div className="rr-sub-modal-shade" aria-hidden="true" />
                <div className="rr-sub-modal-tag">
                  {drop.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="rr-sub-modal-logo" src={drop.logo} alt={drop.name} />
                  )}
                  <span className="rr-mono" style={{ color: '#E6E6E6', fontSize: 10, letterSpacing: '.22em' }}>
                    {drop.status === 'coming_soon' ? 'DROPPING SOON' : 'DROP'} · {drop.name.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <div className={split ? 'rr-sub-modal-body' : undefined} style={split ? undefined : { padding: '36px 28px' }}>
              <button
                onClick={dismissSubscribe}
                aria-label="Close"
                style={{
                  position: 'absolute', top: 16, right: 20, zIndex: 1,
                  background: 'none', border: 'none',
                  color: '#A6A6A8', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em',
                  textShadow: '0 1px 8px rgba(0,0,0,.6)',
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
              <p style={{ color: '#A6A6A8', fontSize: 12, lineHeight: 1.7, margin: `0 0 ${drop?.tagline ? 10 : 24}px` }}>
                {blurb(drop)}
              </p>
              {drop?.tagline && (
                <p className="rr-mono" style={{ color: '#E6E6E6', fontSize: 10, letterSpacing: '.18em', margin: '0 0 24px' }}>
                  “{drop.tagline}”
                </p>
              )}

              <SubscribeForm
                source={source}
                buttonLabel="JOIN"
                autoFocus={source !== 'popup'}
                onSuccess={handleSuccess}
              />

              <button
                onClick={dismissSubscribe}
                className="rr-mono"
                style={{
                  marginTop: 16, alignSelf: 'center',
                  background: 'none', border: 'none', padding: 4,
                  color: '#A6A6A8', cursor: 'pointer',
                  fontSize: 10, letterSpacing: '.22em',
                  display: 'block', marginInline: 'auto',
                }}
              >
                NOT NOW
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
