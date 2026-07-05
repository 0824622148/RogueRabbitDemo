'use client'

import { useCallback, useState } from 'react'

export type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface UseSubscribeResult {
  status: SubscribeStatus
  error: string
  /** True once a *new* member was created (vs already-subscribed). */
  isNew: boolean
  subscribe: (email: string) => Promise<void>
  reset: () => void
}

/**
 * Single source of truth for joining the Rouge Rabbit members list.
 * Wraps POST /api/members with client-side validation, loading, success
 * and error states. `source` tags where the signup came from.
 */
export function useSubscribe(source: string): UseSubscribeResult {
  const [status, setStatus] = useState<SubscribeStatus>('idle')
  const [error, setError] = useState('')
  const [isNew, setIsNew] = useState(false)

  const subscribe = useCallback(async (email: string) => {
    const trimmed = email.trim().toLowerCase()
    if (!EMAIL_RE.test(trimmed)) {
      setStatus('error')
      setError('Enter a valid email address.')
      return
    }

    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setStatus('error')
        setError(data?.error || 'Something went wrong. Try again.')
        return
      }
      const data = await res.json().catch(() => ({}))
      setIsNew(Boolean(data?.isNew))
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }, [source])

  const reset = useCallback(() => {
    setStatus('idle')
    setError('')
    setIsNew(false)
  }, [])

  return { status, error, isNew, subscribe, reset }
}
