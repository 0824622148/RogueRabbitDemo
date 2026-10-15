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
// joined, comes back SNOOZE_DAYS after being closed (or as soon as it promotes
// a different drop), never after joining.
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

export function SubscribeProvider({
  children,
  campaign = '',
}: {
  children: React.ReactNode
  /** What the popup is promoting (e.g. the next drop) — a new one ends an old snooze. */
  campaign?: string
}) {
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
    if (!isMember()) writeSnoozeUntil(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000, campaign)
  }, [campaign])

  useEffect(() => {
    if (popupShown.current || isOpen) return
    if (NO_POPUP_PATHS.some((p) => pathname.startsWith(p))) return
    if (isMember() || readSnoozeUntil(campaign) > Date.now()) return

    const t = setTimeout(() => openSubscribe('popup'), POPUP_DELAY_MS)
    return () => clearTimeout(t)
  }, [pathname, isOpen, openSubscribe, campaign])

  return (
    <SubscribeContext.Provider value={{ isOpen, source, openSubscribe, closeSubscribe, dismissSubscribe }}>
      {children}
    </SubscribeContext.Provider>
  )
}
