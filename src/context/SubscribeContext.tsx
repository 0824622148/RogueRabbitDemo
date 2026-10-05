'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { isMember, readSnoozeUntil, writeSnoozeUntil } from '@/lib/memberFlags'

interface SubscribeContextValue {
  isOpen: boolean
  /** Which touchpoint opened the modal — stored on the member row. */
  source: string
  openSubscribe: (source?: string) => void
  closeSubscribe: () => void
  /** Close and keep the welcome popup away for SNOOZE_DAYS. */
  dismissSubscribe: () => void
}

// Welcome popup: opens POPUP_DELAY_MS after landing for visitors who haven't
// joined, comes back SNOOZE_DAYS after being closed, never after joining.
const POPUP_DELAY_MS = 5000
const SNOOZE_DAYS = 7
// No popup mid-purchase, in admin, or on the unsubscribe page.
const NO_POPUP_PATHS = ['/admin', '/checkout', '/preorder', '/unsubscribe']

const SubscribeContext = createContext<SubscribeContextValue | null>(null)

export function useSubscribeModal() {
  const ctx = useContext(SubscribeContext)
  if (!ctx) throw new Error('useSubscribeModal must be used inside SubscribeProvider')
  return ctx
}

export function SubscribeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState('navbar')
  const pathname = usePathname()
  // Once per page load at most, even when storage is blocked.
  const popupShown = useRef(false)

  const openSubscribe = useCallback((from = 'navbar') => {
    // Opening it by hand (navbar JOIN etc.) also uses up this load's popup.
    popupShown.current = true
    setSource(from)
    setIsOpen(true)
  }, [])
  const closeSubscribe = useCallback(() => setIsOpen(false), [])
  const dismissSubscribe = useCallback(() => {
    setIsOpen(false)
    if (!isMember()) writeSnoozeUntil(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000)
  }, [])

  useEffect(() => {
    if (popupShown.current || isOpen) return
    if (NO_POPUP_PATHS.some((p) => pathname.startsWith(p))) return
    if (isMember() || readSnoozeUntil() > Date.now()) return

    const t = setTimeout(() => openSubscribe('popup'), POPUP_DELAY_MS)
    return () => clearTimeout(t)
  }, [pathname, isOpen, openSubscribe])

  return (
    <SubscribeContext.Provider value={{ isOpen, source, openSubscribe, closeSubscribe, dismissSubscribe }}>
      {children}
    </SubscribeContext.Provider>
  )
}
