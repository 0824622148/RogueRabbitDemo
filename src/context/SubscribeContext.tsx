'use client'

import { createContext, useCallback, useContext, useState } from 'react'

interface SubscribeContextValue {
  isOpen: boolean
  /** Which touchpoint opened the modal — stored on the member row. */
  source: string
  openSubscribe: (source?: string) => void
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
  const [source, setSource] = useState('navbar')
  const openSubscribe = useCallback((from = 'navbar') => {
    setSource(from)
    setIsOpen(true)
  }, [])
  const closeSubscribe = useCallback(() => setIsOpen(false), [])

  return (
    <SubscribeContext.Provider value={{ isOpen, source, openSubscribe, closeSubscribe }}>
      {children}
    </SubscribeContext.Provider>
  )
}
