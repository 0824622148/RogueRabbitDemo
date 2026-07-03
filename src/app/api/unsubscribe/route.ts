import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/admin/service'
import { verifyUnsubscribeToken } from '@/lib/admin/email'

export const dynamic = 'force-dynamic'

/**
 * Public one-click unsubscribe. Linked from every marketing email.
 * Redirects to the /unsubscribe page with a result flag.
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase()
  const token = request.nextUrl.searchParams.get('token') ?? ''

  const to = (ok: string) => NextResponse.redirect(new URL(`/unsubscribe?${ok}`, request.url))

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return to('status=invalid')
  }

  const db = getServiceClient()
  const { error } = await db.from('members').update({ unsubscribed: true }).eq('email', email)
  if (error) {
    console.error('[UNSUBSCRIBE] Update failed:', JSON.stringify(error))
    return to('status=error')
  }

  return to('status=ok')
}
