import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and API routes through
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/')) {
    return NextResponse.next()
  }

  const session = request.cookies.get('rr_admin')
  if (!session?.value) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
