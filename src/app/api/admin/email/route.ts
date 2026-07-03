import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/admin/service'
import { sendCampaign } from '@/lib/admin/email'

export const dynamic = 'force-dynamic'

/**
 * Send a campaign to members.
 * - test=true → sends only to the single `testEmail` (preview to yourself).
 * - otherwise → sends to every subscribed member and logs a campaigns row.
 * Cookie-gated like the other admin routes; proxy also guards /admin pages.
 */
export async function POST(request: NextRequest) {
  if (!request.cookies.get('rr_admin')?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { subject?: string; message?: string; test?: boolean; testEmail?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const subject = body.subject?.trim()
  const message = body.message?.trim()
  if (!subject || !message) {
    return NextResponse.json({ error: 'Subject and message are required' }, { status: 422 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 503 })
  }

  // Test send — no logging, no member fetch.
  if (body.test) {
    const testEmail = body.testEmail?.trim()
    if (!testEmail) {
      return NextResponse.json({ error: 'Test email address required' }, { status: 422 })
    }
    try {
      await sendCampaign([testEmail], `[TEST] ${subject}`, message)
    } catch (err) {
      console.error('[ADMIN EMAIL] Test send failed:', err)
      return NextResponse.json({ error: 'Failed to send test email' }, { status: 502 })
    }
    return NextResponse.json({ success: true, sent: 1, test: true })
  }

  // Real send — all subscribed members.
  const db = getServiceClient()
  // select('*') (not a named column list) so this still works before the
  // `unsubscribed` migration is applied — the flag just reads as undefined.
  const { data: members, error } = await db
    .from('members')
    .select('*')

  if (error) {
    console.error('[ADMIN EMAIL] Failed to load members:', JSON.stringify(error))
    return NextResponse.json({ error: 'Failed to load members' }, { status: 500 })
  }

  const recipients = Array.from(
    new Set(
      (members ?? [])
        .filter((m: any) => !m.unsubscribed && m.email)
        .map((m: any) => String(m.email).trim().toLowerCase()),
    ),
  )

  if (!recipients.length) {
    return NextResponse.json({ error: 'No subscribed members to email' }, { status: 422 })
  }

  let sent: number
  try {
    sent = await sendCampaign(recipients, subject, message)
  } catch (err) {
    console.error('[ADMIN EMAIL] Campaign send failed:', err)
    return NextResponse.json({ error: 'Failed to send campaign' }, { status: 502 })
  }

  // Best-effort audit log — never fail the request if this insert errors.
  const { error: logError } = await db
    .from('campaigns')
    .insert({ subject, body: message, recipient_count: sent })
  if (logError) {
    console.error('[ADMIN EMAIL] Campaign sent but log failed:', JSON.stringify(logError))
  }

  return NextResponse.json({ success: true, sent })
}
