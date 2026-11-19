'use client'

import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { trackPurchase } from '@/lib/meta-pixel'

/**
 * Empties the bag once the customer is back from a completed PayFast payment,
 * and reports the purchase to the pixel first. The bag is empty after this, so
 * refreshing the page can't report the same order twice.
 */
export default function ClearCart({ orderRef }: { orderRef: string | null }) {
  const { items, clear, hydrated } = useCart()
  useEffect(() => {
    if (!hydrated || items.length === 0) return
    if (orderRef) trackPurchase(items, orderRef)
    clear()
  }, [hydrated, items, orderRef, clear])
  return null
}
