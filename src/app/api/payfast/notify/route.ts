import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateITN } from '@/lib/payfast'
import { DELIVERY_FROM } from '@/lib/preorder'
import { formatRand } from '@/lib/money'

export const dynamic = 'force-dynamic'

const RESEND_FROM = 'Rouge Rabbit <orders@rougerabbit.co.za>'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[ITN EMAIL] RESEND_API_KEY not set — skipping')
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
  })
  if (!res.ok) {
    const body = await res.text()
    console.error('[ITN EMAIL] Resend error:', res.status, body)
  }
}

function customerConfirmHtml(order: Record<string, unknown>): string {
  const name = order.name as string
  const colourway = order.colourway as string
  const sizeValue = order.size_value as string
  const gender = order.gender as string
  const reference = order.reference as string
  const amountDue = Number(order.amount_due)
  const discountApplied = order.early_access as boolean
  const deliveryAddress = [
    order.address_line1, order.address_line2, order.suburb,
    order.city, order.province, order.postal_code,
  ].filter(Boolean).join(', ')

  return `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;max-width:560px;">
    <h1 style="color:#D90017;font-size:28px;margin:0 0 8px;">ROUGE RABBIT</h1>
    <p style="color:#A6A6A8;margin:0 0 32px;letter-spacing:.1em;font-size:11px;">BUILT DIFFERENT.</p>

    <div style="display:inline-flex;align-items:center;gap:10px;border:1px solid #2A9D2A;padding:8px 16px;margin-bottom:24px;">
      <span style="color:#2A9D2A;font-size:16px;">✓</span>
      <span style="color:#2A9D2A;font-size:11px;letter-spacing:.16em;">PAYMENT CONFIRMED</span>
    </div>

    <p style="color:#A6A6A8;line-height:1.8;font-size:12px;margin:0 0 20px;">
      Hi ${name}, your ROUGE 01 ${colourway} is secured.
      Your edition number will be assigned once the pre-order closes and emailed to you.
    </p>

    <div style="border:1px solid #D90017;padding:16px 20px;margin-bottom:28px;">
      <p style="color:#D90017;font-size:10px;letter-spacing:.2em;margin:0 0 10px;">PRE-ORDER · WHAT HAPPENS NEXT</p>
      <p style="color:#E6E6E6;line-height:1.8;font-size:12px;margin:0;">
        This is a pre-order. Delivery is expected from <strong>${DELIVERY_FROM}</strong>.
        The Rouge Rabbit team will be in touch to confirm before your order is dispatched.
      </p>
    </div>

    <div style="border:1px solid #3A3A3C;padding:20px;margin-bottom:24px;">
      <p style="color:#D90017;font-size:10px;letter-spacing:.2em;margin:0 0 16px;">ORDER SUMMARY</p>
      ${[
        ['Product', `ROUGE 01 · ${colourway}`],
        ['Size', `${sizeValue} · ${gender}`],
        ['Delivery To', deliveryAddress || '—'],
        ['Reference', reference],
        ['Amount Paid', `${formatRand(amountDue)}${discountApplied ? ' (30% early access applied)' : ''}`],
      ].map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #3A3A3C;font-size:11px;">
        <span style="color:#A6A6A8;">${k}</span>
        <span style="color:#E6E6E6;">${v}</span>
      </div>`).join('')}
    </div>

    <p style="color:#A6A6A8;font-size:10px;line-height:1.8;letter-spacing:.1em;">
      QUESTIONS? REPLY TO THIS EMAIL OR WHATSAPP US.
    </p>
  </div>`
}

function adminPaidHtml(order: Record<string, unknown>, pfPaymentId: string): string {
  const orderId = order.id as number
  const reference = order.reference as string
  const name = order.name as string
  const email = order.email as string
  const phone = order.phone as string
  const colourway = order.colourway as string
  const sizeValue = order.size_value as string
  const gender = order.gender as string
  const amountDue = Number(order.amount_due)
  const shippingCost = Number(order.shipping_cost ?? 0)
  const serviceName = (order.ship_service_name as string) || (order.ship_service_code as string) || '—'
  const discountApplied = order.early_access as boolean
  const deliveryAddress = [
    order.address_line1, order.address_line2, order.suburb,
    order.city, order.province, order.postal_code,
  ].filter(Boolean).join(', ')

  return `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;">
    <h2 style="color:#2A9D2A;margin:0 0 24px;">● PAYMENT RECEIVED — READY TO SHIP</h2>
    <table style="border-collapse:collapse;width:100%;">
      ${[
        ['Order ID', `#${orderId}`],
        ['Reference', reference],
        ['PayFast ID', pfPaymentId || '—'],
        ['Name', name],
        ['Email', email],
        ['Phone', phone || '—'],
        ['Colourway', colourway],
        ['Size', `${sizeValue} · ${gender}`],
        ['Delivery Address', deliveryAddress || '—'],
        ['Delivery Option', `${serviceName} — ${formatRand(shippingCost)}`],
        ['Discount Applied', discountApplied ? 'YES — 30% ROUGE30' : 'No'],
        ['Amount Paid', formatRand(amountDue)],
        ['Status', '● PAID — BOOK COLLECTION IN ADMIN'],
      ].map(([k, v]) => `<tr><td style="padding:8px 16px 8px 0;color:#A6A6A8;white-space:nowrap;">${k}</td><td style="padding:8px 0;color:#E6E6E6;">${v}</td></tr>`).join('')}
    </table>
  </div>`
}

// PayFast posts ITN to this endpoint after payment
export async function POST(request: NextRequest) {
  const text = await request.text()
  const params = Object.fromEntries(new URLSearchParams(text))

  const reference = params.m_payment_id
  if (!reference) {
    console.error('[ITN] Missing m_payment_id')
    return new Response('OK', { status: 200 })
  }

  const db = getServiceClient()
  const { data: order, error } = await db
    .from('orders')
    .select('*')
    .eq('reference', reference)
    .single()

  if (error || !order) {
    console.error('[ITN] Order not found for reference:', reference)
    return new Response('OK', { status: 200 })
  }

  // amount_due is a numeric column — PostgREST may hand it back as a string.
  const validation = await validateITN(params, Number(order.amount_due), reference)
  if (!validation.valid) {
    console.error('[ITN] Validation failed:', validation.reason, reference)
    return new Response('OK', { status: 200 })
  }

  // Idempotency — skip if already marked paid
  if (order.status === 'paid') {
    console.log('[ITN] Already paid, skipping:', reference)
    return new Response('OK', { status: 200 })
  }

  const { error: updateError } = await db
    .from('orders')
    .update({
      status: 'paid',
      pf_payment_id: params.pf_payment_id ?? null,
    })
    .eq('reference', reference)

  if (updateError) {
    console.error('[ITN] DB update failed:', JSON.stringify(updateError))
    return new Response('OK', { status: 200 })
  }

  console.log('[ITN] Payment confirmed:', reference, params.pf_payment_id)

  const adminEmail = process.env.ADMIN_EMAIL ?? 'orders@rougerabbit.co.za'
  const pfPaymentId = params.pf_payment_id ?? ''

  await Promise.all([
    sendEmail(
      order.email,
      `ROUGE 01 Payment Confirmed · ${reference}`,
      customerConfirmHtml(order),
    ),
    sendEmail(
      adminEmail,
      `[PAID] ${reference} — ${order.name} · ${order.colourway} ${order.size_value}`,
      adminPaidHtml(order, pfPaymentId),
    ),
  ])

  return new Response('OK', { status: 200 })
}
