import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 "proxy" (formerly middleware). Gates the entire /admin section
 * behind the shared-password cookie set by /api/admin/login.
 *
 * Previously only the admin API routes checked the `rr_admin` cookie, so the
 * dashboard pages themselves rendered for anyone who knew the URL. This closes
 * that gap. The login page is exempt so users can actually sign in.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow the login page through.
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const authed = request.cookies.get('rr_admin')?.value
  if (!authed) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Only run for admin pages. Storefront, API routes (PayFast/ShipLogic
  // webhooks, members, preorder) and static assets are untouched.
  matcher: '/admin/:path*',
}
