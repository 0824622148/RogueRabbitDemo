'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!password || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        setError('INCORRECT PASSWORD')
      }
    } catch {
      setError('SOMETHING WENT WRONG')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ color: '#D90017', fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '.06em' }}>
            ROUGE RABBIT
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.2em', color: '#A6A6A8', marginTop: 4 }}>
            ADMIN / SECURE ACCESS
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="PASSWORD"
            autoFocus
            style={{
              background: '#1E1E20', border: '1px solid #3A3A3C',
              color: '#E6E6E6', fontFamily: 'var(--font-mono)',
              fontSize: 13, letterSpacing: '.12em',
              padding: '16px 18px', outline: 'none', width: '100%',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={submit}
            disabled={loading}
            style={{
              background: '#D90017', color: '#E6E6E6', border: 'none',
              padding: '16px', fontFamily: 'var(--font-mono)',
              fontSize: 11, letterSpacing: '.22em',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'CHECKING...' : 'ENTER →'}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#D90017', letterSpacing: '.16em' }}>
            ✕ {error}
          </div>
        )}
      </div>
    </div>
  )
}
