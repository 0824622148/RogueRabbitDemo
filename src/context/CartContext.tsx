'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Shopping bag for in-stock apparel and accessories.
 *
 * Stored in localStorage only. Prices here are for display — /api/checkout
 * re-prices every line from the database, so nothing in this file can change
 * what a customer is charged.
 */

export interface CartLine {
  inventoryId: number
  productId: number
  slug: string
  colourwayId: string
  name: string
  colourway: string
  size: string
  unitPrice: number
  image: string
  mediaBg: string
  qty: number
  /** Stock at the time it was added — caps the quantity stepper. */
  maxQty: number
}

/** Mirrors MAX_QTY_PER_LINE in src/lib/cart-server.ts. */
export const MAX_QTY_PER_LINE = 10

const STORAGE_KEY = 'rr_cart'

interface CartContextValue {
  items: CartLine[]
  count: number
  subtotal: number
  hydrated: boolean
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (line: Omit<CartLine, 'qty'>, qty?: number) => void
  updateQty: (inventoryId: number, qty: number) => void
  removeItem: (inventoryId: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

function clampQty(qty: number, maxQty: number) {
  return Math.max(1, Math.min(Math.floor(qty), maxQty, MAX_QTY_PER_LINE))
}

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter((l) => Number.isInteger(l?.inventoryId) && Number(l?.qty) > 0)
      : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setItems(readStorage())
    setHydrated(true)
  }, [])

  // Persist after hydration only, so the initial empty state can't wipe storage.
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage blocked (private mode etc.) — the bag still works for this visit
    }
  }, [items, hydrated])

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addItem = useCallback((line: Omit<CartLine, 'qty'>, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((l) => l.inventoryId === line.inventoryId)
      if (existing) {
        return prev.map((l) =>
          l.inventoryId === line.inventoryId
            ? { ...l, ...line, qty: clampQty(l.qty + qty, line.maxQty) }
            : l,
        )
      }
      return [...prev, { ...line, qty: clampQty(qty, line.maxQty) }]
    })
    setIsOpen(true)
  }, [])

  const updateQty = useCallback((inventoryId: number, qty: number) => {
    setItems((prev) =>
      prev.map((l) => (l.inventoryId === inventoryId ? { ...l, qty: clampQty(qty, l.maxQty) } : l)),
    )
  }, [])

  const removeItem = useCallback((inventoryId: number) => {
    setItems((prev) => prev.filter((l) => l.inventoryId !== inventoryId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((s, l) => s + l.qty, 0),
    subtotal: Math.round(items.reduce((s, l) => s + l.unitPrice * l.qty, 0) * 100) / 100,
    hydrated,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQty,
    removeItem,
    clear,
  }), [items, hydrated, isOpen, addItem, updateQty, removeItem, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
