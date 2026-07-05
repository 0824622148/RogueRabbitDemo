import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWelcomeEmail } from '@/lib/admin/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Must stay in sync with the members.source CHECK constraint (schema.sql /
// 003_member_sources.sql). Unknown values fall back to null so a bad `source`
// can never fail the insert.
const ALLOWED_SOURCES = new Set(['homepage', 'preorder', 'navbar', 'footer', 'wishlist'])

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, phone, source } = body as Record<string, string>
  const cleanEmail = email?.trim().toLowerCase() ?? ''
  const cleanSource = source?.trim() && ALLOWED_SOURCES.has(source.trim())
    ? source.trim()
    : null

  if (!cleanEmail) {
    return NextResponse.json({ error: 'Email is required' }, { status: 422 })
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 422 })
  }

  const db = getServiceClient()

  // Is this a brand-new member? Determines whether we send the welcome email.
  const { data: existing } = await db
    .from('members')
    .select('id')
    .eq('email', cleanEmail)
    .maybeSingle()
  const isNew = !existing

  const { error } = await db.from('members').upsert(
    {
      name: name?.trim() || null,
      email: cleanEmail,
      phone: phone?.trim() || null,
      source: cleanSource,
    },
    { onConflict: 'email', ignoreDuplicates: true },
  )

  if (error) {
    console.error('[MEMBERS] Insert failed:', JSON.stringify(error))
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  // Welcome only new members — never fail the subscribe if email errors.
  if (isNew) {
    try {
      await sendWelcomeEmail(cleanEmail)
    } catch (e) {
      console.error('[MEMBERS] Welcome email failed:', e)
    }
  }

  return NextResponse.json({ success: true, isNew })
}
