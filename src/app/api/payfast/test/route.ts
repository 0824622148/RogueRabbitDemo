import { NextResponse } from 'next/server'
import { buildPayFastPayload, PAYFAST_URL } from '@/lib/payfast'

// Temp: remove this file after debugging
export async function GET() {
  const payload = buildPayFastPayload({
    reference: 'RR-TEST01',
    name: 'Test User',
    email: 'test@test.com',
    amountDue: 20,
    colourway: 'OBSIDIAN',
    size: 'US 9',
    gender: 'MALE',
  })

  return NextResponse.json({
    url: payload.url,
    merchant_id: payload.fields.merchant_id,
    merchant_key_preview: payload.fields.merchant_key
      ? `${payload.fields.merchant_key.slice(0, 4)}...${payload.fields.merchant_key.slice(-4)}`
      : 'MISSING',
    merchant_key_length: payload.fields.merchant_key?.length ?? 0,
    sandbox_env: process.env.PAYFAST_SANDBOX,
    amount: payload.fields.amount,
    notify_url: payload.fields.notify_url,
    signature: payload.fields.signature,
    all_field_keys: Object.keys(payload.fields),
  })
}
