import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/admin/service'
import { buildPayFastPayload } from '@/lib/payfast'
import { FULL_PRICE, DISCOUNTED_PRICE, EARLY_ACCESS_CODE as DEFAULT_EARLY_ACCESS_CODE } from '@/lib/preorder'
import { SNEAKER_ORDERS_ON_HOLD, ORDERS_ON_HOLD_MESSAGE } from '@/lib/store-status'
import { verifyDelivery, toAddress, DeliveryError } from '@/lib/delivery'
import { newOrderReference } from '@/lib/order-reference'

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

// Price constants come from src/lib/preorder.ts (shared with the modal & PDP);
// the early-access code may still be overridden via env.
const EARLY_ACCESS_CODE = process.env.EARLY_ACCESS_CODE ?? DEFAULT_EARLY_ACCESS_CODE

// ROUGE 01 declared value for the delivery re-quote (matches /api/shipping/rates).
const DECLARED_VALUE = Math.round(Number(process.env.SHIPLOGIC_DECLARED_VALUE ?? FULL_PRICE))

/**
 * Starts a ROUGE 01 pre-order checkout.
 *
 * The order row is written here (status 'awaiting_payment') because the
 * PayFast ITN only posts back the reference — it needs a stored amount to
 * verify against. Nothing else happens until payment is verified: no admin
 * email, no members enrolment, and the admin dashboard doesn't list the order.
 * All of that lives in /api/payfast/notify.
 */
export async function POST(request: NextRequest) {
  // Trading hold. Checked before anything else so a direct API call can't slip
  // past the disabled UI and start a payment we aren't ready to honour.
  if (SNEAKER_ORDERS_ON_HOLD) {
    return NextResponse.json({ error: ORDERS_ON_HOLD_MESSAGE }, { status: 503 })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.PAYFAST_MERCHANT_ID) {
    console.error('[PRE-ORDER] SUPABASE_SERVICE_ROLE_KEY / PAYFAST_MERCHANT_ID not configured')
    return NextResponse.json({ error: 'Checkout is temporarily unavailable.' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const {
    name, email, phone, colourway, size, gender,
    addressLine1, addressLine2, suburb, city, province, postalCode,
    serviceCode, earlyAccessCode,
  } = body as Record<string, string>

  if (
    !name || !email || !phone || !colourway || !size ||
    !addressLine1 || !suburb || !city || !province || !postalCode || !serviceCode
  ) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 422 })
  }

  // Delivery fee is re-quoted here — never taken from the browser.
  let delivery
  try {
    delivery = await verifyDelivery(
      toAddress({ addressLine1, addressLine2, suburb, city, province, postalCode }),
      { declaredValue: DECLARED_VALUE },
      serviceCode,
    )
  } catch (err) {
    if (err instanceof DeliveryError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    throw err
  }
  const shippingCost = delivery.rate.rate

  const discountApplied =
    typeof earlyAccessCode === 'string' &&
    earlyAccessCode.trim().toUpperCase() === EARLY_ACCESS_CODE
  const productPrice = discountApplied ? DISCOUNTED_PRICE : FULL_PRICE
  // Total charged via PayFast. Rounded to cents so float addition can't drift
  // away from the amount stored on the order (the ITN compares the two).
  const price = Math.round((productPrice + shippingCost) * 100) / 100

  const reference = newOrderReference()
  const db = getServiceClient()
  const { data, error } = await db.from('orders').insert({
    reference,
    order_type: 'preorder',
    status: 'awaiting_payment',
    payment_started_at: new Date().toISOString(),
    colourway,
    gender: gender === 'FEMALE' ? 'F' : 'M',
    size_value: size,
    city,
    name,
    email,
    phone,
    fulfilment_type: delivery.local ? 'local_delivery' : 'delivery',
    address_line1: addressLine1,
    address_line2: addressLine2 || null,
    suburb,
    province,
    postal_code: postalCode,
    ship_service_code: delivery.rate.code,
    ship_service_name: delivery.rate.name,
    shipping_cost: shippingCost,
    early_access: discountApplied,
    discount_pct: discountApplied ? 30 : 0,
    subtotal: productPrice,
    amount_due: price,
  }).select('id').single()

  // No stored order = the ITN could never verify the payment. Don't take money.
  if (error || !data) {
    console.error('[PRE-ORDER] DB insert failed:', JSON.stringify(error))
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 })
  }

  console.log('[PRE-ORDER] awaiting payment', JSON.stringify({
    orderId: (data as { id: number }).id, reference,
    colourway, size, gender, postalCode,
    service: delivery.rate.code, shippingCost, discountApplied, amountDue: price,
  }))

  const payfast = buildPayFastPayload({
    reference,
    name,
    email,
    amountDue: price,
    itemName: `ROUGE 01 - ${colourway} - ${size} ${gender}`,
    returnPath: '/preorder/success',
    cancelPath: '/preorder/cancel',
  })

  return NextResponse.json({ success: true, reference, payfast })
}
