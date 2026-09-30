// Delivery rules shared by the rates API and every checkout route.
// SERVER-ONLY — imports the Shiplogic client, which reads secret env vars.
//
// Two ways an order reaches the customer:
//   1. Ennerdale (postal code in ENNERDALE_POSTAL_CODES) — free, delivered by
//      the Rouge Rabbit team themselves. Never booked with The Courier Guy.
//   2. Everywhere else — The Courier Guy, live-quoted via Shiplogic.
//
// The delivery fee is ALWAYS worked out here on the server. Checkout routes
// call verifyDelivery() and never trust a fee sent by the browser.

import { getRates, isConfigured, type Address, type Parcel, type ShippingRate } from '@/lib/shiplogic'

/** Service code stored on orders.ship_service_code for hand-delivered Ennerdale orders. */
export const LOCAL_DELIVERY_CODE = 'RR_LOCAL_ENNERDALE'

/**
 * Postal codes that qualify for free local delivery.
 * TODO(client): confirm the final list — 1830 is Ennerdale; add any
 * neighbouring codes the team is willing to drive to.
 */
export const ENNERDALE_POSTAL_CODES: readonly string[] = ['1830']

/** Shown under the local option at checkout and in the confirmation email. */
export const LOCAL_DELIVERY_ESTIMATE = '1–3 working days' // TODO(client): confirm

export function isEnnerdale(postalCode: string | null | undefined): boolean {
  const code = String(postalCode ?? '').replace(/\s+/g, '')
  return ENNERDALE_POSTAL_CODES.includes(code)
}

export function localDeliveryRate(): ShippingRate {
  return {
    code: LOCAL_DELIVERY_CODE,
    name: 'Free local delivery · Ennerdale',
    rate: 0,
    deliveryEstimate: LOCAL_DELIVERY_ESTIMATE,
  }
}

export function isLocalDelivery(serviceCode: string | null | undefined): boolean {
  return serviceCode === LOCAL_DELIVERY_CODE
}

/**
 * Courier flyer for tees and caps. Grows with the number of units so a big
 * order isn't rated as a single-tee bag. Per-unit weight overridable via env
 * once the client confirms packed weights.
 */
export function apparelParcel(units: number): Parcel {
  const n = Math.max(1, Math.floor(units))
  const perUnitKg = Number(process.env.SHIPLOGIC_APPAREL_UNIT_WEIGHT_KG ?? 0.3)
  return {
    lengthCm: 40,
    widthCm: 30,
    heightCm: Math.min(5 + (n - 1) * 3, 30),
    weightKg: Math.max(0.5, Math.round(perUnitKg * n * 100) / 100),
  }
}

export interface DeliveryQuoteInput {
  /** Parcel to rate. Omit for the default ROUGE 01 shoe box. */
  parcel?: Parcel
  /** Insured value in whole rand. */
  declaredValue: number
}

export class DeliveryError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

/**
 * Delivery options for an address. Ennerdale gets the free local option only;
 * everywhere else gets live The Courier Guy rates.
 * Throws DeliveryError with an HTTP-friendly status on failure.
 */
export async function quoteDelivery(address: Address, input: DeliveryQuoteInput): Promise<ShippingRate[]> {
  if (isEnnerdale(address.postalCode)) {
    return [localDeliveryRate()]
  }

  if (!isConfigured()) {
    throw new DeliveryError('Delivery rates are temporarily unavailable.', 503)
  }

  let rates: ShippingRate[]
  try {
    rates = await getRates(address, input.declaredValue, input.parcel)
  } catch (err) {
    console.error('[DELIVERY] Shiplogic error:', err)
    throw new DeliveryError('Could not fetch delivery rates. Please check your address and try again.', 502)
  }

  if (rates.length === 0) {
    throw new DeliveryError('No delivery options available for this address.', 422)
  }
  return rates
}

/**
 * Re-quote on the server and return the real fee for the service the customer
 * picked. Rejects a local-delivery code on a non-Ennerdale address, and any
 * courier service that isn't offered for this address.
 */
export async function verifyDelivery(
  address: Address,
  input: DeliveryQuoteInput,
  serviceCode: string,
): Promise<{ rate: ShippingRate; local: boolean }> {
  const rates = await quoteDelivery(address, input)
  const rate = rates.find((r) => r.code === serviceCode)
  if (!rate) {
    throw new DeliveryError('The selected delivery option is no longer available. Please choose again.', 409)
  }
  return { rate, local: isLocalDelivery(rate.code) }
}

/** Build a Shiplogic Address from checkout body fields (already validated). */
export function toAddress(f: {
  addressLine1: string
  addressLine2?: string
  suburb: string
  city: string
  province: string
  postalCode: string
}): Address {
  return {
    streetAddress: f.addressLine1,
    line2: f.addressLine2 || undefined,
    suburb: f.suburb,
    city: f.city,
    province: f.province,
    postalCode: f.postalCode,
    country: 'ZA',
  }
}
