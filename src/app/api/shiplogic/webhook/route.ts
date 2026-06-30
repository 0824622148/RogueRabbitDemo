import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Shiplogic posts tracking events here. Configure this URL (with ?secret=...) in the
// Courier Guy / Shiplogic portal. If the portal supports signed webhooks, prefer a
// signature header — otherwise the shared secret below gates access.
//
// NOTE: verify the exact event payload shape against the portal docs; field access
// below is defensive across the likely names.

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

const RESEND_FROM = 'Rouge Rabbit <orders@rougerabbit.co.za>'

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
  }).catch((e) => console.error('[SL WEBHOOK EMAIL] error:', e))
}

// Map a Shiplogic status string to our order lifecycle. Only ever moves forward.
function mapStatus(raw: string): 'shipped' | 'delivered' | null {
  const s = raw.toLowerCase()
  if (s.includes('deliver')) return 'delivered' // 'delivered', 'out-for-delivery' handled below first
  if (s.includes('out-for-delivery') || s.includes('collected') || s.includes('transit') || s.includes('hub') || s.includes('shipped')) {
    return 'shipped'
  }
  return null
}

export async function POST(request: NextRequest) {
  // Gate with shared secret if configured. Shiplogic sends it as a Bearer token in
  // the Authorization header (the portal's "Auth key" field). Also accept a ?secret=
  // query param or x-webhook-secret header as fallbacks.
  const secret = process.env.SHIPLOGIC_WEBHOOK_SECRET
  if (secret) {
    const authHeader = request.headers.get('authorization') ?? ''
    const bearer = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7).trim()
      : ''
    const provided =
      bearer ||
      request.nextUrl.searchParams.get('secret') ||
      request.headers.get('x-webhook-secret') ||
      ''
    if (provided !== secret) {
      console.warn('[SL WEBHOOK] rejected — bad secret')
      return new Response('OK', { status: 200 })
    }
  }

  let payload: Record<string, any>
  try {
    payload = await request.json()
  } catch {
    return new Response('OK', { status: 200 })
  }

  const trackingRef =
    payload.tracking_reference ?? payload.short_tracking_reference ?? payload.tracking_number
  const shipmentId = payload.shipment_id ?? payload.id
  const rawStatus = String(payload.status ?? payload.status_description ?? payload.tracking_status ?? '')

  // 'out-for-delivery' should not be treated as delivered.
  const isDelivered = rawStatus.toLowerCase().includes('deliver') && !rawStatus.toLowerCase().includes('out-for-delivery')
  const newStatus = isDelivered ? 'delivered' : mapStatus(rawStatus)

  if (!newStatus) {
    console.log('[SL WEBHOOK] no status mapping for:', rawStatus)
    return new Response('OK', { status: 200 })
  }

  const db = getServiceClient()

  // Locate the order by tracking number, then shipment id.
  let order: any = null
  if (trackingRef) {
    const { data } = await db.from('orders').select('*').eq('tracking_number', trackingRef).maybeSingle()
    order = data
  }
  if (!order && shipmentId) {
    const { data } = await db.from('orders').select('*').eq('shiplogic_shipment_id', String(shipmentId)).maybeSingle()
    order = data
  }

  if (!order) {
    console.error('[SL WEBHOOK] order not found for', trackingRef ?? shipmentId)
    return new Response('OK', { status: 200 })
  }

  // Idempotency / no backward transitions.
  if (order.status === 'delivered' || (order.status === 'shipped' && newStatus === 'shipped')) {
    return new Response('OK', { status: 200 })
  }

  const { error } = await db.from('orders').update({ status: newStatus }).eq('id', order.id)
  if (error) {
    console.error('[SL WEBHOOK] DB update failed:', JSON.stringify(error))
    return new Response('OK', { status: 200 })
  }

  if (newStatus === 'delivered') {
    await sendEmail(
      order.email,
      `ROUGE 01 Delivered · ${order.reference}`,
      `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;max-width:560px;">
        <h1 style="color:#D90017;font-size:28px;margin:0 0 8px;">ROUGE RABBIT</h1>
        <p style="color:#2A9D2A;font-size:12px;letter-spacing:.16em;margin:0 0 20px;">✓ DELIVERED</p>
        <p style="color:#A6A6A8;line-height:1.8;font-size:12px;">
          Hi ${order.name}, your ROUGE 01 (${order.reference}) has been delivered. Welcome to the pack.
        </p>
      </div>`,
    )
  }

  console.log('[SL WEBHOOK]', order.reference, '→', newStatus)
  return new Response('OK', { status: 200 })
}
