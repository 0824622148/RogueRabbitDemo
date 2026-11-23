'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/store-status'

// Checkout states the free delivery rule itself, next to the delivery options.
const HIDDEN_PATHS = ['/admin', '/checkout', '/preorder', '/unsubscribe']

/** Thin strip above the nav: free nationwide delivery over the threshold. */
export default function FreeShippingBanner() {
  const pathname = usePathname()
  if (HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null

  return (
    <div className="rr-ship-banner" role="region" aria-label="Free delivery">
      <Link href="/shipping-returns">
        <strong>Free nationwide delivery</strong> on all orders of R{FREE_SHIPPING_THRESHOLD}+
      </Link>
    </div>
  )
}
