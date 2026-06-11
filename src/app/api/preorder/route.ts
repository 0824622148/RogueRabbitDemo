import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Set these in .env.local and Vercel environment variables before launch:
//   RESEND_API_KEY=re_xxxxxxxxxxxx
//   ADMIN_EMAIL=orders@rougerabbit.co.za
//   EARLY_ACCESS_CODE=ROUGE30
//   SUPABASE_SERVICE_ROLE_KEY=<from Supabase → Settings → API>

const EARLY_ACCESS_CODE = process.env.EARLY_ACCESS_CODE ?? 'ROUGE30'
const FULL_PRICE = 1800
const DISCOUNT_PCT = 0.30
const RESEND_FROM = 'Rouge Rabbit <orders@rougerabbit.co.za>'

// TODO: Update bank details before launch
const BANK = {
  name: 'First National Bank (FNB)',
  accountName: 'Rouge Rabbit (Pty) Ltd',
  accountNumber: '62843917205',
  branchCode: '254005',
  universalCode: '250655',
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
  })
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { reference, name, email, phone, colourway, size, gender, collection, earlyAccessCode } =
    body as Record<string, string>

  if (!name || !email || !phone || !colourway || !size || !collection || !reference) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 422 })
  }

  const discountApplied =
    typeof earlyAccessCode === 'string' &&
    earlyAccessCode.trim().toUpperCase() === EARLY_ACCESS_CODE
  const price = discountApplied ? Math.round(FULL_PRICE * (1 - DISCOUNT_PCT)) : FULL_PRICE

  // Persist order — critical; log but don't block if service key not yet configured
  let orderId: number | null = null
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const db = getServiceClient()
    const { data, error } = await db.from('orders').insert({
      reference,
      colourway,
      gender: gender || 'M',
      size_value: size,
      city: collection,
      name,
      email,
      phone,
      early_access: discountApplied,
      discount_pct: discountApplied ? 30 : 0,
      amount_due: price,
    }).select('id').single()

    if (error) {
      console.error('[PRE-ORDER] DB insert failed:', error)
    } else {
      orderId = (data as any).id
    }
  }

  console.log('[PRE-ORDER]', JSON.stringify({
    timestamp: new Date().toISOString(),
    orderId, reference, name, email, phone,
    colourway, size, gender, collection,
    discountApplied, amountDue: price,
  }))

  const adminEmail = process.env.ADMIN_EMAIL ?? 'orders@rougerabbit.co.za'

  await sendEmail(
    adminEmail,
    `[PRE-ORDER] ${reference} — ${name} · ${colourway} ${size}`,
    `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;">
      <h2 style="color:#D90017;margin:0 0 24px;">NEW PRE-ORDER</h2>
      <table style="border-collapse:collapse;width:100%;">
        ${[
          ['Order ID', orderId ? `#${orderId}` : '—'],
          ['Reference', reference],
          ['Name', name],
          ['Email', email],
          ['Phone', phone],
          ['Colourway', colourway],
          ['Size', `${size} · ${gender}`],
          ['Collection Point', collection],
          ['Discount Applied', discountApplied ? 'YES — 30% ROUGE30' : 'No'],
          ['Amount Due', `R${price}`],
        ].map(([k, v]) => `<tr><td style="padding:8px 16px 8px 0;color:#A6A6A8;white-space:nowrap;">${k}</td><td style="padding:8px 0;color:#E6E6E6;">${v}</td></tr>`).join('')}
      </table>
    </div>`,
  )

  await sendEmail(
    email,
    `ROUGE 01 Pre-Order Confirmed · ${reference}`,
    `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;max-width:560px;">
      <h1 style="color:#D90017;font-size:28px;margin:0 0 8px;">ROUGE RABBIT</h1>
      <p style="color:#A6A6A8;margin:0 0 32px;letter-spacing:.1em;font-size:11px;">BUILT DIFFERENT.</p>

      <h2 style="margin:0 0 20px;font-size:18px;">Your Pre-Order Is Confirmed.</h2>
      <p style="color:#A6A6A8;line-height:1.8;font-size:12px;margin:0 0 28px;">
        Hi ${name}, your spot for the ROUGE 01 ${colourway} has been reserved.
        Complete your EFT within <strong style="color:#E6E6E6;">24 hours</strong> to secure your pair.
        Your edition number will be confirmed once payment is received.
      </p>

      <div style="border:1px solid #3A3A3C;padding:20px;margin-bottom:24px;">
        <p style="color:#D90017;font-size:10px;letter-spacing:.2em;margin:0 0 16px;">EFT BANKING DETAILS</p>
        ${[
          ['Bank', BANK.name],
          ['Account Name', BANK.accountName],
          ['Account Number', BANK.accountNumber],
          ['Branch Code', BANK.branchCode],
          ['Universal Code', BANK.universalCode],
          ['Reference', reference],
          ['Amount', `R${price}`],
        ].map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #3A3A3C;font-size:11px;">
          <span style="color:#A6A6A8;">${k}</span>
          <span style="color:#E6E6E6;font-weight:${k === 'Reference' || k === 'Amount' ? '600' : '400'};">${v}</span>
        </div>`).join('')}
      </div>

      <div style="border:1px solid #3A3A3C;padding:20px;margin-bottom:28px;">
        <p style="color:#D90017;font-size:10px;letter-spacing:.2em;margin:0 0 16px;">YOUR ORDER</p>
        ${[
          ['Product', `ROUGE 01 · ${colourway}`],
          ['Size', `${size} · ${gender}`],
          ['Collection Point', collection],
          ['Reference', reference],
        ].map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #3A3A3C;font-size:11px;">
          <span style="color:#A6A6A8;">${k}</span><span style="color:#E6E6E6;">${v}</span>
        </div>`).join('')}
      </div>

      <p style="color:#A6A6A8;font-size:10px;line-height:1.8;letter-spacing:.1em;">
        PAYMENT NOT RECEIVED WITHIN 24 HOURS WILL RELEASE YOUR SPOT.
        QUESTIONS? REPLY TO THIS EMAIL OR WHATSAPP US.
      </p>
    </div>`,
  )

  return NextResponse.json({ success: true, orderId })
}
