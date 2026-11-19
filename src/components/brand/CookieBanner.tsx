'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { COOKIE_CONSENT_KEY } from '@/lib/meta-pixel'

/**
 * Asks before any advertising cookies are set. The site's own storage (bag,
 * wishlist) doesn't depend on the answer. Sits above the members popup (z-index
 * 300) so it can always be answered.
 */
export default function CookieBanner() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  // Read after mount, so the server-rendered HTML is the same for everyone.
  useEffect(() => {
    try {
      setShow(!localStorage.getItem(COOKIE_CONSENT_KEY))
    } catch {
      // Storage blocked: the choice couldn't be remembered, and the pixel stays off.
    }
  }, [])

  const answer = (choice: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice)
    } catch {
      // Still honour the answer for this page view.
    }
    if (choice === 'accepted') window.rrStartPixel?.()
    setShow(false)
  }

  if (!show || pathname.startsWith('/admin')) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 310,
        background: '#1E1E20', borderTop: '1px solid #3A3A3C',
        padding: '16px', display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'center', gap: '12px 24px',
      }}
    >
      <p style={{ flex: '1 1 320px', maxWidth: 720, margin: 0, fontSize: 13, lineHeight: 1.6, color: '#E6E6E6' }}>
        We&apos;d like to use Meta (Facebook and Instagram) advertising cookies to measure our ads and
        show you relevant ones. See our{' '}
        <Link href="/privacy" style={{ color: '#E6E6E6', textDecoration: 'underline' }}>Privacy Policy</Link>.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => answer('declined')} className="rr-btn rr-btn--ghost" style={{ padding: '12px 20px' }}>
          DECLINE
        </button>
        <button onClick={() => answer('accepted')} className="rr-btn" style={{ padding: '12px 20px' }}>
          ACCEPT
        </button>
      </div>
    </div>
  )
}
