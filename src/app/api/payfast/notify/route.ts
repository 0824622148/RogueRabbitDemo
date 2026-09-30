import { NextRequest } from 'next/server'
import { getServiceClient } from '@/lib/admin/service'
import { validateITN, isPayFastSource } from '@/lib/payfast'
import { DELIVERY_FROM } from '@/lib/preorder'
import { formatRand } from '@/lib/money'
import { sendEmail, adminEmail, esc } from '@/lib/email'
import { LOCAL_DELIVERY_ESTIMATE } from '@/lib/delivery'

export const dynamic = 'force-dynamic'

type Row = Record<string, any>

interface OversoldLine {
  product_name: string
  size_value: string | null
  qty: number
  stock_before: number
}

/**
 * States an order may be in when a verified payment arrives. 'cancelled' is
 * included because /api/preorder/cancel is public: a checkout released from
 * the cancel page (or by someone guessing a reference) can still be genuinely
 * paid, and the money has been taken. Orders that were EVER paid (paid_at set)
 * are never touched again — see the conditional update below.
 */
const PAYABLE_STATUSES = ['awaiting_payment', 'pending', 'cancelled']

// ─── Email bodies ────────────────────────────────────────────────────────────

const row = (k: string, v: string) =>
  `<div style="display:flex;justify-content:space-between;gap:16px;padding:7px 0;border-bottom:1px solid #3A3A3C;font-size:11px;">
    <span style="color:#A6A6A8;">${k}</span><span style="color:#E6E6E6;text-align:right;">${v}</span>
  </div>`

const adminRow = (k: string, v: string) =>
  `<tr><td style="padding:8px 16px 8px 0;color:#A6A6A8;white-space:nowrap;vertical-align:top;">${k}</td><td style="padding:8px 0;color:#E6E6E6;">${v}</td></tr>`

function deliveryAddress(order: Row): string {
  return esc([
    order.address_line1, order.address_line2, order.suburb,
    order.city, order.province, order.postal_code,
  ].filter(Boolean).join(', ')) || '—'
}

function deliveryLabel(order: Row): string {
  if (order.fulfilment_type === 'local_delivery') return 'Free local delivery · Ennerdale'
  return esc(order.ship_service_name || order.ship_service_code || 'The Courier Guy')
}

function itemsSummary(items: Row[]): string {
  return items
    .map((i) => `${esc(i.product_name)} ${esc(i.colourway_name ?? '')} ${esc(i.size_value ?? '')} ×${i.qty}`.replace(/\s+/g, ' '))
    .join(', ')
}

const shell = (inner: string) =>
  `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;max-width:560px;">
    <h1 style="color:#D90017;font-size:28px;margin:0 0 8px;">ROUGE RABBIT</h1>
    <p style="color:#A6A6A8;margin:0 0 32px;letter-spacing:.1em;font-size:11px;">BUILT DIFFERENT.</p>
    <div style="display:inline-flex;align-items:center;gap:10px;border:1px solid #2A9D2A;padding:8px 16px;margin-bottom:24px;">
      <span style="color:#2A9D2A;font-size:16px;">✓</span>
      <span style="color:#2A9D2A;font-size:11px;letter-spacing:.16em;">PAYMENT CONFIRMED</span>
    </div>
    ${inner}
    <p style="color:#A6A6A8;font-size:10px;line-height:1.8;letter-spacing:.1em;">
      QUESTIONS? REPLY TO THIS EMAIL OR WHATSAPP US.
    </p>
  </div>`

function customerShopHtml(order: Row, items: Row[]): string {
  const local = order.fulfilment_type === 'local_delivery'
  const next = local
    ? `We deliver Ennerdale orders ourselves — free. The Rouge Rabbit team will WhatsApp you on ${esc(order.phone)} to arrange a time (usually within ${LOCAL_DELIVERY_ESTIMATE}).`
    : `We'll book your parcel with The Courier Guy and email you a tracking number as soon as it's on its way.`

  return shell(`
    <p style="color:#A6A6A8;line-height:1.8;font-size:12px;margin:0 0 20px;">
      Hi ${esc(order.name)}, thank you — your order is confirmed.
    </p>
    <div style="border:1px solid #D90017;padding:16px 20px;margin-bottom:28px;">
      <p style="color:#D90017;font-size:10px;letter-spacing:.2em;margin:0 0 10px;">WHAT HAPPENS NEXT</p>
      <p style="color:#E6E6E6;line-height:1.8;font-size:12px;margin:0;">${next}</p>
    </div>
    <div style="border:1px solid #3A3A3C;padding:20px;margin-bottom:24px;">
      <p style="color:#D90017;font-size:10px;letter-spacing:.2em;margin:0 0 16px;">ORDER SUMMARY</p>
      ${items.map((i) => row(
        `${esc(i.product_name)} · ${esc(i.colourway_name ?? '')} · ${esc(i.size_value ?? '')} ×${i.qty}`,
        formatRand(Number(i.unit_price) * Number(i.qty)),
      )).join('')}
      ${row('Subtotal', formatRand(order.subtotal))}
      ${row(`Delivery · ${deliveryLabel(order)}`, Number(order.shipping_cost ?? 0) === 0 ? 'FREE' : formatRand(order.shipping_cost))}
      ${row('Total Paid', formatRand(order.amount_due))}
      ${row('Delivery To', deliveryAddress(order))}
      ${row('Reference', esc(order.reference))}
    </div>`)
}

function customerPreorderHtml(order: Row): string {
  return shell(`
    <p style="color:#A6A6A8;line-height:1.8;font-size:12px;margin:0 0 20px;">
      Hi ${esc(order.name)}, your ROUGE 01 ${esc(order.colourway)} is secured.
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
      ${row('Product', `ROUGE 01 · ${esc(order.colourway)}`)}
      ${row('Size', `${esc(order.size_value)} · ${esc(order.gender)}`)}
      ${row(`Delivery · ${deliveryLabel(order)}`, Number(order.shipping_cost ?? 0) === 0 ? 'FREE' : formatRand(order.shipping_cost))}
      ${row('Delivery To', deliveryAddress(order))}
      ${row('Reference', esc(order.reference))}
      ${row('Amount Paid', `${formatRand(order.amount_due)}${order.early_access ? ' (30% early access applied)' : ''}`)}
    </div>`)
}

function adminPaidHtml(
  order: Row,
  items: Row[],
  pfPaymentId: string,
  alerts: string[],
): string {
  const local = order.fulfilment_type === 'local_delivery'
  const nextStep = local
    ? '● PAID — DELIVER BY HAND (ENNERDALE). SEE ADMIN → DELIVERIES → LOCAL.'
    : '● PAID — BOOK COLLECTION IN ADMIN → DELIVERIES.'

  const productRows = order.order_type === 'shop'
    ? [adminRow('Items', itemsSummary(items) || '—'), adminRow('Subtotal', formatRand(order.subtotal))]
    : [
        adminRow('Colourway', esc(order.colourway)),
        adminRow('Size', `${esc(order.size_value)} · ${esc(order.gender)}`),
        adminRow('Discount Applied', order.early_access ? 'YES — 30% ROUGE30' : 'No'),
      ]

  return `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;">
    ${alerts.map((a) => `<div style="border:1px solid #D90017;color:#D90017;padding:12px 16px;margin-bottom:16px;">⚠ ${a}</div>`).join('')}
    <h2 style="color:#2A9D2A;margin:0 0 24px;">● PAYMENT VERIFIED — ${local ? 'LOCAL DELIVERY' : 'READY TO SHIP'}</h2>
    <table style="border-collapse:collapse;width:100%;">
      ${[
        adminRow('Order ID', `#${order.id}`),
        adminRow('Reference', esc(order.reference)),
        adminRow('PayFast ID', esc(pfPaymentId) || '—'),
        adminRow('Name', esc(order.name)),
        adminRow('Email', esc(order.email)),
        adminRow('Phone', esc(order.phone) || '—'),
        ...productRows,
        adminRow('Delivery Address', deliveryAddress(order)),
        adminRow('Delivery', `${deliveryLabel(order)} — ${formatRand(order.shipping_cost)}`),
        adminRow('Amount Paid', formatRand(order.amount_due)),
        adminRow('Next Step', nextStep),
      ].join('')}
    </table>
  </div>`
}

// ─── Handler ─────────────────────────────────────────────────────────────────

function clientIp(request: NextRequest): string | null {
  // On Vercel, x-forwarded-for is set by the platform (not the caller).
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip')
}

/**
 * PayFast ITN (payment notification). This is the ONLY place an order becomes
 * 'paid' — the admin cannot set it by hand — and the admin dashboard only
 * lists orders from that point on.
 *
 * Response codes: PayFast re-sends a notification that doesn't get a 200. We
 * answer 200 to anything we've fully handled or deliberately rejected, and
 * non-200 only when a retry could succeed (PayFast unreachable, DB error).
 */
export async function POST(request: NextRequest) {
  const ip = clientIp(request)
  if (!(await isPayFastSource(ip))) {
    // Non-200: if this was genuinely PayFast from a new IP, it will retry and
    // the log tells us to update the list (or set PAYFAST_SKIP_IP_CHECK).
    console.error('[ITN] Rejected — source IP is not PayFast:', ip)
    return new Response('Forbidden', { status: 403 })
  }

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
    .maybeSingle()

  if (error) {
    console.error('[ITN] Order lookup failed:', JSON.stringify(error))
    return new Response('Retry', { status: 500 })
  }
  if (!order) {
    console.error('[ITN] Order not found for reference:', reference)
    return new Response('OK', { status: 200 })
  }

  // amount_due is a numeric column — PostgREST may hand it back as a string.
  const validation = await validateITN(params, Number(order.amount_due), reference)
  if (validation.retry) {
    return new Response('Retry', { status: 503 })
  }
  if (!validation.valid) {
    console.error('[ITN] Validation failed:', validation.reason, reference)
    return new Response('OK', { status: 200 })
  }

  // Exactly-once: only the request whose update actually flips the row gets
  // to decrement stock and send emails. A replayed or concurrent ITN matches
  // zero rows. paid_at IS NULL stops a shipped/delivered/refunded order ever
  // being pulled back to 'paid'.
  const pfPaymentId = params.pf_payment_id ?? ''
  const { data: flipped, error: updateError } = await db
    .from('orders')
    .update({
      status: 'paid',
      pf_payment_id: pfPaymentId || null,
      paid_at: new Date().toISOString(),
    })
    .eq('reference', reference)
    .in('status', PAYABLE_STATUSES)
    .is('paid_at', null)
    .select('*')

  if (updateError) {
    console.error('[ITN] DB update failed:', JSON.stringify(updateError))
    return new Response('Retry', { status: 500 })
  }

  if (!flipped || flipped.length === 0) {
    console.log('[ITN] Already processed, ignoring:', reference, `(status ${order.status})`)
    return new Response('OK', { status: 200 })
  }

  const paid = flipped[0] as Row
  console.log('[ITN] Payment verified:', reference, pfPaymentId)

  const alerts: string[] = []
  if (order.status === 'cancelled') {
    alerts.push(
      'THIS CHECKOUT HAD BEEN MARKED CANCELLED BEFORE PAYMENT ARRIVED. The payment is genuine and the order is now PAID — check with the customer before fulfilling.',
    )
  }

  let items: Row[] = []
  if (paid.order_type === 'shop') {
    const { data: lines } = await db.from('order_items').select('*').eq('order_id', paid.id).order('id')
    items = (lines ?? []) as Row[]

    const { data: short, error: stockError } = await db.rpc('apply_paid_order_stock', { p_order_id: paid.id })
    if (stockError) {
      console.error('[ITN] Stock decrement failed:', JSON.stringify(stockError))
      alerts.push('STOCK COULD NOT BE UPDATED AUTOMATICALLY for this order. Adjust inventory by hand in Supabase.')
    } else {
      for (const s of (short ?? []) as OversoldLine[]) {
        alerts.push(
          `OVERSOLD: ${esc(s.product_name)} ${esc(s.size_value ?? '')} — paid for ${s.qty}, only ${s.stock_before} were in stock. Contact the customer.`,
        )
      }
    }
  }

  // Only paying customers join the members list.
  await db.from('members').upsert(
    { name: paid.name, email: paid.email, phone: paid.phone, source: paid.order_type === 'shop' ? 'shop' : 'preorder' },
    { onConflict: 'email', ignoreDuplicates: true },
  )

  const isShop = paid.order_type === 'shop'
  await Promise.all([
    sendEmail(
      paid.email,
      isShop ? `Order Confirmed · ${reference}` : `ROUGE 01 Payment Confirmed · ${reference}`,
      isShop ? customerShopHtml(paid, items) : customerPreorderHtml(paid),
    ),
    sendEmail(
      adminEmail(),
      `${alerts.length ? '[ACTION NEEDED] ' : ''}[PAID] ${reference} — ${paid.name} · ${
        isShop ? itemsSummary(items) : `${paid.colourway} ${paid.size_value}`
      }${paid.fulfilment_type === 'local_delivery' ? ' · ENNERDALE' : ''}`,
      adminPaidHtml(paid, items, pfPaymentId, alerts),
    ),
  ])

  return new Response('OK', { status: 200 })
}
