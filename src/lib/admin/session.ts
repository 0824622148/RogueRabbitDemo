import { NextRequest, NextResponse } from 'next/server'

/**
 * Signed admin session cookie: "<expiryMs>.<hex HMAC-SHA256(expiryMs)>",
 * keyed with ADMIN_PASSWORD — changing the password logs everyone out.
 * Web Crypto only, so it runs in the proxy (middleware) and in route handlers.
 */
export const ADMIN_COOKIE = 'rr_admin'
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7 // 7 days

const enc = new TextEncoder()

async function hmacHex(message: string): Promise<string | null> {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return null
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(`rr-admin-session:${secret}`),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Constant-time string compare. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function signSession(): Promise<string> {
  const expiry = String(Date.now() + SESSION_MAX_AGE_S * 1000)
  const sig = await hmacHex(expiry)
  if (!sig) throw new Error('ADMIN_PASSWORD is not set')
  return `${expiry}.${sig}`
}

export async function verifySession(value: string | undefined | null): Promise<boolean> {
  if (!value) return false
  const [expiry, sig] = value.split('.')
  if (!expiry || !sig || !/^\d+$/.test(expiry)) return false
  if (Number(expiry) < Date.now()) return false
  const expected = await hmacHex(expiry)
  return !!expected && safeEqual(sig, expected)
}

/** For admin API routes: returns a 401 response, or null when the session is valid. */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  if (await verifySession(request.cookies.get(ADMIN_COOKIE)?.value)) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
