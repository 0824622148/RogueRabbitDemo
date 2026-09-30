import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, SESSION_MAX_AGE_S, signSession } from '@/lib/admin/session'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_COOKIE, await signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_S,
    path: '/',
  })
  return res
}
