'use client'

import { COOKIE_CONSENT_KEY } from '@/lib/meta-pixel'

/** Forgets the visitor's choice. The reload stops the pixel and brings the banner back. */
export default function CookieSettingsButton() {
  const reset = () => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY)
    } catch {
      // Nothing was stored in the first place.
    }
    window.location.reload()
  }

  return (
    <button
      onClick={reset}
      style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#D90017', cursor: 'pointer' }}
    >
      Change your cookie choice
    </button>
  )
}
