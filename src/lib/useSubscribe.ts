'use client'

import { useCallback, useState } from 'react'

export type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface SubscribeDetails {
  name: string
  email: string
  /** Optional — sent only when provided. */
  phone?: string
}

interface UseSubscribeResult {
  status: SubscribeStatus
  error: string
  /** True once a *new* member was created (vs already-subscribed). */
  isNew: boolean
  subscribe: (details: SubscribeDetails) => Promise<void>
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

  const subscribe = useCallback(async (details: SubscribeDetails) => {
    const name = details.name.trim()
    const email = details.email.trim().toLowerCase()
    const phone = details.phone?.trim() || ''

    if (!name) {
      setStatus('error')
      setError('Enter your name.')
      return
    }
    if (!EMAIL_RE.test(email)) {
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
        body: JSON.stringify({ name, email, phone: phone || undefined, source }),
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
