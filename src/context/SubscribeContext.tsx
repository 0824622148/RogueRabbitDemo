'use client'

import { createContext, useCallback, useContext, useState } from 'react'

interface SubscribeContextValue {
  isOpen: boolean
  openSubscribe: () => void
  closeSubscribe: () => void
}

const SubscribeContext = createContext<SubscribeContextValue | null>(null)

export function useSubscribeModal() {
  const ctx = useContext(SubscribeContext)
  if (!ctx) throw new Error('useSubscribeModal must be used inside SubscribeProvider')
  return ctx
}

export function SubscribeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const openSubscribe = useCallback(() => setIsOpen(true), [])
  const closeSubscribe = useCallback(() => setIsOpen(false), [])

  return (
    <SubscribeContext.Provider value={{ isOpen, openSubscribe, closeSubscribe }}>
      {children}
    </SubscribeContext.Provider>
  )
}
