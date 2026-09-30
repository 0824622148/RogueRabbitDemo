import { NextRequest, NextResponse } from 'next/server'
import { FULL_PRICE } from '@/lib/preorder'
import { quoteDelivery, toAddress, apparelParcel, DeliveryError, type DeliveryQuoteInput } from '@/lib/delivery'
import { parseCartInput, priceCart, cartSubtotal, cartUnits, CartError } from '@/lib/cart-server'

export const dynamic = 'force-dynamic'

// ROUGE 01 declared value (insurance/rating) when no cart items are sent.
// Rounded to whole rand — Shiplogic rates on whole-rand cover.
const PREORDER_DECLARED_VALUE = Math.round(Number(process.env.SHIPLOGIC_DECLARED_VALUE ?? FULL_PRICE))

/**
 * Delivery options for an address.
 *
 * Body: address fields, plus optional `items: [{ inventoryId, qty }]` from the
 * cart. With items, the parcel and declared value come from the cart; without,
 * the ROUGE 01 shoe box and pre-order price are used.
 *
 * Ennerdale postal codes get the free local option only (no Shiplogic call).
 * These rates are for display — checkout routes re-quote on the server.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { addressLine1, addressLine2, suburb, city, province, postalCode } =
    body as Record<string, string>

  if (!addressLine1 || !suburb || !city || !province || !postalCode) {
    return NextResponse.json(
      { error: 'A complete delivery address is required' },
      { status: 422 },
    )
  }

  let quote: DeliveryQuoteInput = { declaredValue: PREORDER_DECLARED_VALUE }

  if (body.items !== undefined) {
    const items = parseCartInput(body.items)
    if (!items) {
      return NextResponse.json({ error: 'Invalid bag contents' }, { status: 422 })
    }
    try {
      const lines = await priceCart(items)
      quote = {
        parcel: apparelParcel(cartUnits(lines)),
        declaredValue: Math.round(cartSubtotal(lines)),
      }
    } catch (err) {
      if (err instanceof CartError) {
        return NextResponse.json({ error: err.message }, { status: err.status })
      }
      throw err
    }
  }

  try {
    const rates = await quoteDelivery(
      toAddress({ addressLine1, addressLine2, suburb, city, province, postalCode }),
      quote,
    )
    return NextResponse.json({ rates })
  } catch (err) {
    if (err instanceof DeliveryError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[SHIPPING RATES] Unexpected error:', err)
    return NextResponse.json({ error: 'Could not fetch delivery rates.' }, { status: 500 })
  }
}
