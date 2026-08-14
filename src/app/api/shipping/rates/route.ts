import { NextRequest, NextResponse } from 'next/server'
import { getRates, isConfigured, type Address } from '@/lib/shiplogic'
import { FULL_PRICE } from '@/lib/preorder'

export const dynamic = 'force-dynamic'

// Product value used as the declared value for insurance/rating.
// Defaults to the pre-order full price so the two never drift. Rounded to whole
// rand — the price carries cents, but Shiplogic rates on whole-rand cover.
const DECLARED_VALUE = Math.round(Number(process.env.SHIPLOGIC_DECLARED_VALUE ?? FULL_PRICE))

export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: 'Delivery rates are temporarily unavailable.' },
      { status: 503 },
    )
  }

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

  const delivery: Address = {
    streetAddress: addressLine1,
    line2: addressLine2,
    suburb,
    city,
    province,
    postalCode,
    country: 'ZA',
  }

  try {
    const rates = await getRates(delivery, DECLARED_VALUE)
    if (rates.length === 0) {
      return NextResponse.json(
        { error: 'No delivery options available for this address.' },
        { status: 422 },
      )
    }
    return NextResponse.json({ rates })
  } catch (err) {
    console.error('[SHIPPING RATES] Shiplogic error:', err)
    return NextResponse.json(
      { error: 'Could not fetch delivery rates. Please check your address and try again.' },
      { status: 502 },
    )
  }
}
