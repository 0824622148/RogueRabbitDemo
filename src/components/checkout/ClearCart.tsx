'use client'

import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'

/** Empties the bag once the customer is back from a completed PayFast payment. */
export default function ClearCart() {
  const { clear, hydrated } = useCart()
  useEffect(() => {
    if (hydrated) clear()
  }, [hydrated, clear])
  return null
}
