'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

export interface WishlistItem {
  id: number
  productId: number
  colourwayId: string | null
  productName: string
  colourwayName: string | null
  slug: string
  price: number
  imageUrl: string
  mediaBg: string
}

interface WishlistContextValue {
  email: string | null
  items: WishlistItem[]
  count: number
  isLoading: boolean
  isOpen: boolean
  promptOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  addItem: (productId: number, colourwayId?: string | null) => void
  removeItem: (productId: number, colourwayId?: string | null) => void
  isWishlisted: (productId: number, colourwayId?: string | null) => boolean
  saveEmail: (email: string) => Promise<void>
  closePrompt: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}

function parseItems(raw: any[]): WishlistItem[] {
  return raw.map((row: any) => {
    const p = row.products ?? {}
    const cw = row.colourways ?? null
    const frontImg =
      cw?.product_images?.find((i: any) => i.view === 'FRONT')?.url ?? ''
    return {
      id: row.id,
      productId: row.product_id,
      colourwayId: row.colourway_id ?? null,
      productName: p.name ?? '',
      colourwayName: cw?.name ?? null,
      slug: p.slug ?? '',
      price: p.price ?? 0,
      imageUrl: frontImg,
      mediaBg: p.media_bg ?? '#1E1E20',
    }
  })
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmailState] = useState<string | null>(null)
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const pendingRef = useRef<{ productId: number; colourwayId?: string | null } | null>(null)

  // Hydrate email from localStorage and fetch wishlist on mount
  useEffect(() => {
    const stored = localStorage.getItem('rr_wishlist_email')
    if (stored) {
      setEmailState(stored)
      fetchItems(stored)
    }
  }, [])

  const fetchItems = useCallback(async (forEmail: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/wishlist?email=${encodeURIComponent(forEmail)}`)
      if (!res.ok) return
      const { items: raw } = await res.json()
      setItems(parseItems(raw))
    } catch {
      // silent — wishlist is non-critical
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addItem = useCallback((productId: number, colourwayId?: string | null) => {
    const currentEmail = localStorage.getItem('rr_wishlist_email')
    if (!currentEmail) {
      pendingRef.current = { productId, colourwayId }
      setPromptOpen(true)
      return
    }
    persistAdd(currentEmail, productId, colourwayId)
  }, [])

  const persistAdd = useCallback(async (
    forEmail: string,
    productId: number,
    colourwayId?: string | null,
  ) => {
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forEmail, productId, colourwayId: colourwayId ?? null }),
      })
      await fetchItems(forEmail)
    } catch {
      // silent
    }
  }, [fetchItems])

  const removeItem = useCallback(async (productId: number, colourwayId?: string | null) => {
    const currentEmail = localStorage.getItem('rr_wishlist_email')
    if (!currentEmail) return
    // Optimistic update
    setItems(prev =>
      prev.filter(i => !(i.productId === productId && i.colourwayId === (colourwayId ?? null)))
    )
    try {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, productId, colourwayId: colourwayId ?? null }),
      })
    } catch {
      // Re-sync on error
      await fetchItems(currentEmail)
    }
  }, [fetchItems])

  const isWishlisted = useCallback((productId: number, colourwayId?: string | null) => {
    const cwId = colourwayId ?? null
    return items.some(i => i.productId === productId && i.colourwayId === cwId)
  }, [items])

  const saveEmail = useCallback(async (newEmail: string) => {
    const normalised = newEmail.trim().toLowerCase()
    localStorage.setItem('rr_wishlist_email', normalised)
    setEmailState(normalised)
    setPromptOpen(false)

    // Enroll in members list
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalised, source: 'wishlist' }),
      })
    } catch {
      // non-critical
    }

    // Action any pending add
    if (pendingRef.current) {
      const { productId, colourwayId } = pendingRef.current
      pendingRef.current = null
      await persistAdd(normalised, productId, colourwayId)
    } else {
      await fetchItems(normalised)
    }
  }, [persistAdd, fetchItems])

  return (
    <WishlistContext.Provider value={{
      email,
      items,
      count: items.length,
      isLoading,
      isOpen,
      promptOpen,
      openDrawer: () => setIsOpen(true),
      closeDrawer: () => setIsOpen(false),
      addItem,
      removeItem,
      isWishlisted,
      saveEmail,
      closePrompt: () => { setPromptOpen(false); pendingRef.current = null },
    }}>
      {children}
    </WishlistContext.Provider>
  )
}
