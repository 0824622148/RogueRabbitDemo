import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifySession } from '@/lib/admin/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and API routes through
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/')) {
    return NextResponse.next()
  }

  // Signed cookie — a hand-made rr_admin value no longer gets in.
  if (!(await verifySession(request.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
