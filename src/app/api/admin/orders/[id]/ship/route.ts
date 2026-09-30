import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/admin/service'
import { createShipment, isConfigured } from '@/lib/shiplogic'
import { apparelParcel } from '@/lib/delivery'
import { sendEmail, esc } from '@/lib/email'

function customerShippedHtml(order: Record<string, unknown>, trackingNumber: string): string {
  const name = esc(order.name)
  const reference = esc(order.reference)
  const what = order.order_type === 'shop' ? 'Rouge Rabbit order' : 'ROUGE 01'
  return `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;max-width:560px;">
    <h1 style="color:#D90017;font-size:28px;margin:0 0 8px;">ROUGE RABBIT</h1>
    <p style="color:#A6A6A8;margin:0 0 32px;letter-spacing:.1em;font-size:11px;">BUILT DIFFERENT.</p>
    <div style="display:inline-flex;align-items:center;gap:10px;border:1px solid #2A9D2A;padding:8px 16px;margin-bottom:24px;">
      <span style="color:#2A9D2A;font-size:11px;letter-spacing:.16em;">📦 ON ITS WAY</span>
    </div>
    <p style="color:#A6A6A8;line-height:1.8;font-size:12px;margin:0 0 28px;">
      Hi ${name}, your ${what} is on its way with The Courier Guy.
    </p>
    <div style="border:1px solid #3A3A3C;padding:20px;margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #3A3A3C;font-size:11px;">
        <span style="color:#A6A6A8;">Reference</span><span style="color:#E6E6E6;">${reference}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:7px 0;font-size:11px;">
        <span style="color:#A6A6A8;">Tracking Number</span><span style="color:#E6E6E6;">${esc(trackingNumber)}</span>
      </div>
    </div>
    <p style="color:#A6A6A8;font-size:10px;line-height:1.8;letter-spacing:.1em;">
      TRACK YOUR PARCEL AT THECOURIERGUY.CO.ZA USING THE NUMBER ABOVE.
    </p>
  </div>`
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookie = request.cookies.get('rr_admin')
  if (!cookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { error: 'SHIPLOGIC_API_KEY not configured' },
      { status: 503 },
    )
  }

  const { id } = await params
  const db = getServiceClient()

  const { data: order, error } = await db
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Ennerdale orders are delivered by hand by the Rouge Rabbit team.
  if (order.fulfilment_type === 'local_delivery') {
    return NextResponse.json(
      { error: 'Ennerdale local delivery — deliver by hand, do not book a courier' },
      { status: 422 },
    )
  }

  if (!order.paid_at || order.status !== 'paid') {
    return NextResponse.json(
      { error: `Order must be paid before booking (currently ${order.status})` },
      { status: 409 },
    )
  }

  // Idempotency — never double-book a shipment.
  if (order.shiplogic_shipment_id) {
    return NextResponse.json(
      { error: 'Shipment already booked', trackingNumber: order.tracking_number },
      { status: 409 },
    )
  }

  if (!order.address_line1 || !order.suburb || !order.city || !order.province || !order.postal_code) {
    return NextResponse.json(
      { error: 'Order is missing a complete delivery address' },
      { status: 422 },
    )
  }

  // Shop orders ship in a flyer sized to the number of units; pre-orders use
  // the default ROUGE 01 shoe box.
  let parcel
  if (order.order_type === 'shop') {
    const { data: items } = await db.from('order_items').select('qty').eq('order_id', order.id)
    parcel = apparelParcel((items ?? []).reduce((s: number, i: { qty: number }) => s + Number(i.qty), 0))
  }

  let result
  try {
    result = await createShipment({
      reference: order.reference,
      delivery: {
        streetAddress: order.address_line1,
        line2: order.address_line2 ?? undefined,
        suburb: order.suburb,
        city: order.city,
        province: order.province,
        postalCode: order.postal_code,
        country: 'ZA',
      },
      deliveryContact: {
        name: order.name,
        phone: order.phone ?? '',
        email: order.email,
      },
      serviceLevelCode: order.ship_service_code ?? '',
      declaredValue: Math.round(Number(order.amount_due) - Number(order.shipping_cost ?? 0)),
      parcel,
    })
  } catch (err) {
    console.error('[SHIP] Shiplogic createShipment failed:', err)
    return NextResponse.json(
      { error: 'Failed to book collection with The Courier Guy' },
      { status: 502 },
    )
  }

  const { error: updateError } = await db
    .from('orders')
    .update({
      status: 'shipped',
      shiplogic_shipment_id: result.shipmentId,
      tracking_number: result.trackingNumber,
    })
    .eq('id', id)
    .eq('status', 'paid')

  if (updateError) {
    console.error('[SHIP] DB update failed after booking:', JSON.stringify(updateError))
    // Shipment was created at the courier but we failed to persist — surface so admin can reconcile.
    return NextResponse.json(
      {
        error: 'Shipment booked but failed to save. Reconcile manually.',
        shipmentId: result.shipmentId,
        trackingNumber: result.trackingNumber,
      },
      { status: 500 },
    )
  }

  await sendEmail(
    order.email,
    `${order.order_type === 'shop' ? 'Your order has shipped' : 'ROUGE 01 Shipped'} · ${order.reference}`,
    customerShippedHtml(order, result.trackingNumber),
  )

  return NextResponse.json({
    success: true,
    shipmentId: result.shipmentId,
    trackingNumber: result.trackingNumber,
  })
}
