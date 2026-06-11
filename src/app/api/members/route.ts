import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  const { name, email, phone } = body as Record<string, string>

  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 422 })
  }

  const db = getServiceClient()
  const { error } = await db.from('members').upsert(
    { name: name?.trim() || null, email: email.trim().toLowerCase(), phone: phone?.trim() || null },
    { onConflict: 'email', ignoreDuplicates: true },
  )

  if (error) {
    console.error('[MEMBERS] Insert failed:', JSON.stringify(error))
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
