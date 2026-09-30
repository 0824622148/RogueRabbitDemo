import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/admin/service'
import { ADMIN_TRANSITIONS } from '@/lib/admin/format'
import { sendEmail, esc } from '@/lib/email'

function customerDeliveredHtml(order: Record<string, any>): string {
  return `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;max-width:560px;">
    <h1 style="color:#D90017;font-size:28px;margin:0 0 8px;">ROUGE RABBIT</h1>
    <p style="color:#A6A6A8;margin:0 0 32px;letter-spacing:.1em;font-size:11px;">BUILT DIFFERENT.</p>
    <div style="display:inline-flex;align-items:center;gap:10px;border:1px solid #2A9D2A;padding:8px 16px;margin-bottom:24px;">
      <span style="color:#2A9D2A;font-size:11px;letter-spacing:.16em;">✓ DELIVERED</span>
    </div>
    <p style="color:#A6A6A8;line-height:1.8;font-size:12px;margin:0 0 28px;">
      Hi ${esc(order.name)}, your Rouge Rabbit order ${esc(order.reference)} has been delivered. Wear it loud.
    </p>
    <p style="color:#A6A6A8;font-size:10px;line-height:1.8;letter-spacing:.1em;">
      QUESTIONS? REPLY TO THIS EMAIL OR WHATSAPP US.
    </p>
  </div>`
}

/**
 * Admin fulfilment status change. Forward-only (see ADMIN_TRANSITIONS):
 * the admin can never set 'paid' — only a verified PayFast ITN does — and
 * can never touch an order whose payment wasn't verified.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookie = request.cookies.get('rr_admin')
  if (!cookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const next = body.status ?? ''
  const db = getServiceClient()

  const { data: order, error: readError } = await db
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (readError) {
    console.error('[ADMIN PATCH] read failed:', JSON.stringify(readError))
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
  if (!order || !order.paid_at) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const allowed = ADMIN_TRANSITIONS[order.status] ?? []
  if (!allowed.includes(next)) {
    return NextResponse.json(
      { error: `Can't change a ${order.status} order to ${next || 'that status'}` },
      { status: 422 },
    )
  }

  // Courier orders go paid → shipped only by booking a collection (so they
  // always get a tracking number).
  if (next === 'shipped' && order.fulfilment_type !== 'local_delivery') {
    return NextResponse.json({ error: 'Use BOOK COLLECTION for courier orders' }, { status: 422 })
  }

  // Conditional on the status we just read, so two clicks can't race.
  const { data: updated, error } = await db
    .from('orders')
    .update({ status: next })
    .eq('id', id)
    .eq('status', order.status)
    .select('id')

  if (error) {
    console.error('[ADMIN PATCH] DB update failed:', JSON.stringify(error))
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
  if (!updated?.length) {
    return NextResponse.json({ error: 'Order changed — refresh and try again' }, { status: 409 })
  }

  if (next === 'delivered' && order.fulfilment_type === 'local_delivery') {
    await sendEmail(order.email, `Delivered · ${order.reference}`, customerDeliveredHtml(order))
  }

  return NextResponse.json({ success: true })
}
