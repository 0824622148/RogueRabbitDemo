import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

/**
 * Releases an order the customer cancelled at PayFast.
 *
 * Called from the /preorder/cancel and /checkout/cancel pages (see
 * components/shop/CancelPreOrder).
 * Orders are written before the PayFast redirect, so without this a cancelled
 * checkout would sit in the payments queue forever looking like a real order.
 *
 * This endpoint is public — middleware.ts only guards /admin. The
 * `.eq('status', 'awaiting_payment')` filter is what makes that safe: someone
 * guessing a reference cannot touch a paid, shipped, delivered, or legacy
 * 'pending' row. The worst case is releasing an in-flight checkout that the
 * customer would have had to restart anyway — and if that payment did in fact
 * complete, the ITN still corrects it to 'paid' (it accepts 'cancelled' orders
 * that were never paid, and alerts the admin).
 */
export async function POST(request: NextRequest) {
  let body: { reference?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const reference = typeof body.reference === 'string' ? body.reference.trim() : ''
  if (!reference) {
    return NextResponse.json({ error: 'Reference is required' }, { status: 422 })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[PRE-ORDER CANCEL] SUPABASE_SERVICE_ROLE_KEY not set — skipping')
    return NextResponse.json({ ok: true })
  }

  const db = getServiceClient()
  const { data, error } = await db
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('reference', reference)
    .eq('status', 'awaiting_payment')
    .select('id')

  if (error) {
    console.error('[PRE-ORDER CANCEL] DB update failed:', JSON.stringify(error))
  } else {
    console.log('[PRE-ORDER CANCEL]', reference, data?.length ? 'released' : 'no matching order')
  }

  // Always 200 with the same body — never reveal whether the reference exists,
  // and never fail the cancel page over a bookkeeping update.
  return NextResponse.json({ ok: true })
}
