'use client'

import { useEffect, useRef } from 'react'

/**
 * Releases the order behind a cancelled PayFast checkout.
 *
 * Orders are written before the redirect to PayFast, so a customer who cancels
 * there leaves a row that otherwise sits in the payments queue forever. Firing
 * this from the client rather than the cancel page's server render keeps the
 * mutation off the GET — a prefetch or re-render of the page must not release
 * an order on its own.
 */
export default function CancelPreOrder({ reference }: { reference: string }) {
  const fired = useRef(false)

  useEffect(() => {
    // React runs effects twice in dev StrictMode; the update is idempotent but
    // there's no reason to send it twice.
    if (fired.current) return
    fired.current = true

    fetch('/api/preorder/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference }),
    }).catch(() => {
      // Nothing to show the customer — they already know it was cancelled, and
      // the order can still be cleared from the admin.
    })
  }, [reference])

  return null
}
