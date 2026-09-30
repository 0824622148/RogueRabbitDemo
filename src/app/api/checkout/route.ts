import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/admin/service'
import { buildPayFastPayload } from '@/lib/payfast'
import { SHOP_ORDERS_ON_HOLD, ORDERS_ON_HOLD_MESSAGE } from '@/lib/store-status'
import { verifyDelivery, toAddress, apparelParcel, DeliveryError } from '@/lib/delivery'
import { parseCartInput, priceCart, cartSubtotal, cartUnits, CartError } from '@/lib/cart-server'
import { newOrderReference } from '@/lib/order-reference'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Starts a cart checkout for in-stock apparel and accessories.
 *
 * Everything that affects the amount is decided here from the database —
 * product prices, stock, and the delivery fee (re-quoted, or free for
 * Ennerdale). The browser only supplies inventory ids, quantities, contact
 * details, the address and the chosen delivery service code.
 *
 * The order is written as 'awaiting_payment' so the PayFast ITN has an amount
 * to verify against. It is invisible to the admin, sends no emails and
 * reserves no stock until /api/payfast/notify verifies the payment.
 */
export async function POST(request: NextRequest) {
  if (SHOP_ORDERS_ON_HOLD) {
    return NextResponse.json({ error: ORDERS_ON_HOLD_MESSAGE }, { status: 503 })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.PAYFAST_MERCHANT_ID) {
    console.error('[CHECKOUT] SUPABASE_SERVICE_ROLE_KEY / PAYFAST_MERCHANT_ID not configured')
    return NextResponse.json({ error: 'Checkout is temporarily unavailable.' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '')
  const name = str('name')
  const email = str('email').toLowerCase()
  const phone = str('phone')
  const addressLine1 = str('addressLine1')
  const addressLine2 = str('addressLine2')
  const suburb = str('suburb')
  const city = str('city')
  const province = str('province')
  const postalCode = str('postalCode')
  const serviceCode = str('serviceCode')

  if (!name || !email || !phone || !addressLine1 || !suburb || !city || !province || !postalCode || !serviceCode) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 422 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 422 })
  }

  const items = parseCartInput(body.items)
  if (!items) {
    return NextResponse.json({ error: 'Your bag is empty or invalid' }, { status: 422 })
  }

  try {
    const lines = await priceCart(items)
    const subtotal = cartSubtotal(lines)

    const delivery = await verifyDelivery(
      toAddress({ addressLine1, addressLine2, suburb, city, province, postalCode }),
      { parcel: apparelParcel(cartUnits(lines)), declaredValue: Math.round(subtotal) },
      serviceCode,
    )
    const shippingCost = delivery.rate.rate
    const amountDue = Math.round((subtotal + shippingCost) * 100) / 100

    const reference = newOrderReference()
    const db = getServiceClient()
    const { data: order, error } = await db.from('orders').insert({
      reference,
      order_type: 'shop',
      status: 'awaiting_payment',
      payment_started_at: new Date().toISOString(),
      name,
      email,
      phone,
      city,
      fulfilment_type: delivery.local ? 'local_delivery' : 'delivery',
      address_line1: addressLine1,
      address_line2: addressLine2 || null,
      suburb,
      province,
      postal_code: postalCode,
      ship_service_code: delivery.rate.code,
      ship_service_name: delivery.rate.name,
      shipping_cost: shippingCost,
      subtotal,
      amount_due: amountDue,
    }).select('id').single()

    if (error || !order) {
      console.error('[CHECKOUT] order insert failed:', JSON.stringify(error))
      return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 })
    }

    const orderId = (order as { id: number }).id
    const { error: itemsError } = await db.from('order_items').insert(
      lines.map((l) => ({
        order_id: orderId,
        product_id: l.productId,
        colourway_id: l.colourwayId,
        inventory_id: l.inventoryId,
        product_name: l.productName,
        colourway_name: l.colourwayName,
        size_value: l.sizeValue,
        qty: l.qty,
        unit_price: l.unitPrice,
      })),
    )

    if (itemsError) {
      console.error('[CHECKOUT] order_items insert failed:', JSON.stringify(itemsError))
      // Release the half-written order so it can never be paid.
      await db.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
      return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 })
    }

    const units = cartUnits(lines)
    console.log('[CHECKOUT] awaiting payment', JSON.stringify({
      orderId, reference, units, subtotal,
      service: delivery.rate.code, shippingCost, amountDue, postalCode,
    }))

    const payfast = buildPayFastPayload({
      reference,
      name,
      email,
      amountDue,
      itemName: `Rouge Rabbit order ${reference} · ${units} item${units === 1 ? '' : 's'}`,
      returnPath: '/checkout/success',
      cancelPath: '/checkout/cancel',
    })

    return NextResponse.json({ success: true, reference, payfast })
  } catch (err) {
    if (err instanceof CartError || err instanceof DeliveryError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[CHECKOUT] unexpected error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
