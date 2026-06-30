import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildPayFastPayload } from '@/lib/payfast'

// Set these in .env.local and Vercel environment variables before launch:
//   RESEND_API_KEY=re_xxxxxxxxxxxx
//   ADMIN_EMAIL=orders@rougerabbit.co.za
//   EARLY_ACCESS_CODE=ROUGE30
//   SUPABASE_SERVICE_ROLE_KEY=<from Supabase → Settings → API>
//   PAYFAST_MERCHANT_ID=10000100
//   PAYFAST_MERCHANT_KEY=46f0cd694581a
//   PAYFAST_PASSPHRASE=
//   PAYFAST_SANDBOX=true
//   NEXT_PUBLIC_SITE_URL=https://rougerabbit.co.za

const EARLY_ACCESS_CODE = process.env.EARLY_ACCESS_CODE ?? 'ROUGE30'
const FULL_PRICE = 20 // TEMP: test price — change back to 1800 before launch
const DISCOUNT_PCT = 0.30
const RESEND_FROM = 'Rouge Rabbit <orders@rougerabbit.co.za>'

// EFT bank details retained for reference only — payment now via PayFast
// const BANK = {
//   name: 'Standard Bank of South Africa',
//   accountName: 'Rouge Rabbit (Pty) Ltd',
//   accountNumber: '0000010279568248',
//   branchCode: '051001',
//   universalCode: '051001',
// }

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[EMAIL] RESEND_API_KEY not set — skipping')
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
    console.error('[EMAIL] Resend error:', res.status, body)
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    reference, name, email, phone, colourway, size, gender,
    addressLine1, addressLine2, suburb, city, province, postalCode,
    serviceCode, serviceName, earlyAccessCode,
  } = body as Record<string, string>

  if (
    !name || !email || !phone || !colourway || !size || !reference ||
    !addressLine1 || !suburb || !city || !province || !postalCode || !serviceCode
  ) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 422 })
  }

  // Shipping cost is quoted live by Shiplogic on the client; coerce to a safe integer.
  const shippingCost = Math.max(0, Math.round(Number((body as Record<string, unknown>).shippingCost) || 0))

  const discountApplied =
    typeof earlyAccessCode === 'string' &&
    earlyAccessCode.trim().toUpperCase() === EARLY_ACCESS_CODE
  const productPrice = discountApplied ? Math.round(FULL_PRICE * (1 - DISCOUNT_PCT)) : FULL_PRICE
  const price = productPrice + shippingCost // total charged via PayFast

  // Persist order — critical; log but don't block if service key not yet configured
  let orderId: number | null = null
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const db = getServiceClient()
    const { data, error } = await db.from('orders').insert({
      reference,
      colourway,
      gender: gender === 'FEMALE' ? 'F' : 'M',
      size_value: size,
      city,
      name,
      email,
      phone,
      fulfilment_type: 'delivery',
      address_line1: addressLine1,
      address_line2: addressLine2 || null,
      suburb,
      province,
      postal_code: postalCode,
      ship_service_code: serviceCode,
      ship_service_name: serviceName || null,
      shipping_cost: shippingCost,
      early_access: discountApplied,
      discount_pct: discountApplied ? 30 : 0,
      amount_due: price,
    }).select('id').single()

    if (error) {
      console.error('[PRE-ORDER] DB insert failed:', JSON.stringify(error))
    } else {
      orderId = (data as any).id
      // Auto-enrol buyer into members list
      await db.from('members').upsert(
        { name, email, phone, source: 'preorder' },
        { onConflict: 'email', ignoreDuplicates: true },
      )
    }
  }

  console.log('[PRE-ORDER]', JSON.stringify({
    timestamp: new Date().toISOString(),
    orderId, reference, name, email, phone,
    colourway, size, gender,
    delivery: { addressLine1, suburb, city, province, postalCode },
    serviceCode, serviceName, shippingCost,
    discountApplied, productPrice, amountDue: price,
  }))

  const adminEmail = process.env.ADMIN_EMAIL ?? 'orders@rougerabbit.co.za'

  await sendEmail(
    adminEmail,
    `[PRE-ORDER INITIATED] ${reference} — ${name} · ${colourway} ${size}`,
    `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;">
      <h2 style="color:#D90017;margin:0 0 24px;">NEW PRE-ORDER — AWAITING PAYMENT</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${[
          ['Order ID', orderId ? `#${orderId}` : '—'],
          ['Reference', reference],
          ['Name', name],
          ['Email', email],
          ['Phone', phone],
          ['Colourway', colourway],
          ['Size', `${size} · ${gender}`],
          ['Delivery Address', [addressLine1, addressLine2, suburb, city, province, postalCode].filter(Boolean).join(', ')],
          ['Delivery Option', `${serviceName || serviceCode} — R${shippingCost}`],
          ['Discount Applied', discountApplied ? 'YES — 30% ROUGE30' : 'No'],
          ['Amount Due', `R${price} (incl. R${shippingCost} delivery)`],
          ['Status', 'AWAITING PAYFAST PAYMENT'],
        ].map(([k, v]) => `<tr><td style="padding:8px 16px 8px 0;color:#A6A6A8;white-space:nowrap;">${k}</td><td style="padding:8px 0;color:#E6E6E6;">${v}</td></tr>`).join('')}
      </table>
    </div>`,
  )

  // Build PayFast redirect payload — returns null if env vars not configured (local dev)
  let payfast: { url: string; fields: Record<string, string> } | null = null
  if (process.env.PAYFAST_MERCHANT_ID) {
    try {
      payfast = buildPayFastPayload({
        reference,
        name,
        email,
        amountDue: price,
        colourway,
        size,
        gender,
      })
    } catch (err) {
      console.error('[PRE-ORDER] PayFast payload build failed:', err)
    }
  }

  return NextResponse.json({ success: true, orderId, payfast })
}
