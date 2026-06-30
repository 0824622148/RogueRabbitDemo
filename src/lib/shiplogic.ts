// The Courier Guy / Shiplogic API client.
// Mirrors the env-driven, fail-soft style of src/lib/payfast.ts.
//
// Env vars (set in .env.local and Vercel):
//   SHIPLOGIC_API_KEY            — Bearer token from the Courier Guy / Shiplogic portal (Settings → API)
//   SHIPLOGIC_SANDBOX            — 'true' uses the sandbox key/host, 'false' (default) production
//   SHIPLOGIC_WEBHOOK_SECRET     — optional shared secret to gate the tracking webhook
//   Origin (warehouse) address — overrides the defaults below:
//   SHIPLOGIC_COLLECTION_COMPANY, _STREET, _SUBURB, _CITY, _ZONE, _CODE, _CONTACT_NAME, _CONTACT_PHONE, _CONTACT_EMAIL
//
// NOTE: Shiplogic request/response field names below reflect the documented API
// (POST /rates, POST /shipments). Verify exact fields against the live portal docs
// (https://api-docs.shiplogic.com) before going to production.

const BASE_URL = 'https://api.shiplogic.com'

function apiKey(): string {
  return (process.env.SHIPLOGIC_API_KEY ?? '').trim()
}

export function isConfigured(): boolean {
  return apiKey() !== ''
}

export interface Address {
  company?: string
  streetAddress: string
  line2?: string
  suburb: string // local_area
  city: string
  province: string // zone
  postalCode: string // code
  country?: string // defaults ZA
}

export interface Contact {
  name: string
  phone: string
  email: string
}

export interface Parcel {
  lengthCm: number
  widthCm: number
  heightCm: number
  weightKg: number
}

export interface ShippingRate {
  code: string
  name: string
  rate: number // rand
  deliveryEstimate: string | null
}

// Fixed parcel for the single ROUGE 01 product (a boxed shoe).
// Override via env if dimensions differ.
export const ROUGE01_PARCEL: Parcel = {
  lengthCm: Number(process.env.SHIPLOGIC_PARCEL_LENGTH_CM ?? 33),
  widthCm: Number(process.env.SHIPLOGIC_PARCEL_WIDTH_CM ?? 22),
  heightCm: Number(process.env.SHIPLOGIC_PARCEL_HEIGHT_CM ?? 13),
  weightKg: Number(process.env.SHIPLOGIC_PARCEL_WEIGHT_KG ?? 1.5),
}

// Warehouse / collection origin. Replace defaults via env before launch.
export const COLLECTION_ADDRESS: Address = {
  company: process.env.SHIPLOGIC_COLLECTION_COMPANY ?? 'Rouge Rabbit',
  streetAddress: process.env.SHIPLOGIC_COLLECTION_STREET ?? '',
  suburb: process.env.SHIPLOGIC_COLLECTION_SUBURB ?? '',
  city: process.env.SHIPLOGIC_COLLECTION_CITY ?? '',
  province: process.env.SHIPLOGIC_COLLECTION_ZONE ?? '',
  postalCode: process.env.SHIPLOGIC_COLLECTION_CODE ?? '',
  country: 'ZA',
}

export const COLLECTION_CONTACT: Contact = {
  name: process.env.SHIPLOGIC_COLLECTION_CONTACT_NAME ?? 'Rouge Rabbit',
  phone: process.env.SHIPLOGIC_COLLECTION_CONTACT_PHONE ?? '',
  email: process.env.SHIPLOGIC_COLLECTION_CONTACT_EMAIL ?? 'orders@rougerabbit.co.za',
}

function toApiAddress(a: Address, type: 'business' | 'residential') {
  return {
    type,
    company: a.company ?? '',
    street_address: a.streetAddress,
    local_area: a.suburb,
    city: a.city,
    zone: a.province,
    country: a.country ?? 'ZA',
    code: a.postalCode,
  }
}

function toApiParcel(p: Parcel) {
  return {
    submitted_length_cm: p.lengthCm,
    submitted_width_cm: p.widthCm,
    submitted_height_cm: p.heightCm,
    submitted_weight_kg: p.weightKg,
  }
}

async function shiplogicFetch(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${apiKey()}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
}

/**
 * Fetch live shipping rates for a delivery address using the fixed ROUGE 01 parcel.
 * Throws if not configured or if Shiplogic returns an error.
 */
export async function getRates(
  delivery: Address,
  declaredValue: number,
  parcel: Parcel = ROUGE01_PARCEL,
): Promise<ShippingRate[]> {
  if (!isConfigured()) {
    throw new Error('SHIPLOGIC_API_KEY not configured')
  }

  const res = await shiplogicFetch('/rates', {
    method: 'POST',
    body: JSON.stringify({
      collection_address: toApiAddress(COLLECTION_ADDRESS, 'business'),
      delivery_address: toApiAddress(delivery, 'residential'),
      parcels: [toApiParcel(parcel)],
      declared_value: declaredValue,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Shiplogic /rates ${res.status}: ${body}`)
  }

  const data = (await res.json()) as { rates?: ShiplogicRate[] }
  const rates = data.rates ?? []

  return rates.map((r) => ({
    code: r.service_level?.code ?? '',
    name: r.service_level?.name ?? 'Delivery',
    rate: Math.round(r.rate ?? 0),
    deliveryEstimate: formatEstimate(r.service_level?.delivery_date_to),
  }))
}

// Shiplogic returns ISO timestamps (e.g. "2026-07-02T15:00:00+02:00").
// Surface a short, human date like "Thu, 02 Jul".
function formatEstimate(iso?: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-ZA', { weekday: 'short', day: '2-digit', month: 'short' })
}

interface ShiplogicRate {
  rate?: number
  service_level?: {
    code?: string
    name?: string
    delivery_date_from?: string
    delivery_date_to?: string
  }
}

export interface CreateShipmentInput {
  reference: string
  delivery: Address
  deliveryContact: Contact
  serviceLevelCode: string
  declaredValue: number
  parcel?: Parcel
  specialInstructions?: string
}

export interface CreateShipmentResult {
  shipmentId: string
  trackingNumber: string
}

/**
 * Book a Courier Guy collection / create a shipment.
 * Throws if not configured or if Shiplogic returns an error.
 */
export async function createShipment(
  input: CreateShipmentInput,
): Promise<CreateShipmentResult> {
  if (!isConfigured()) {
    throw new Error('SHIPLOGIC_API_KEY not configured')
  }

  const parcel = input.parcel ?? ROUGE01_PARCEL

  const res = await shiplogicFetch('/shipments', {
    method: 'POST',
    body: JSON.stringify({
      collection_address: toApiAddress(COLLECTION_ADDRESS, 'business'),
      collection_contact: {
        name: COLLECTION_CONTACT.name,
        mobile_number: COLLECTION_CONTACT.phone,
        email: COLLECTION_CONTACT.email,
      },
      delivery_address: toApiAddress(input.delivery, 'residential'),
      delivery_contact: {
        name: input.deliveryContact.name,
        mobile_number: input.deliveryContact.phone,
        email: input.deliveryContact.email,
      },
      parcels: [toApiParcel(parcel)],
      declared_value: input.declaredValue,
      service_level_code: input.serviceLevelCode,
      customer_reference: input.reference,
      special_instructions_delivery: input.specialInstructions ?? '',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Shiplogic /shipments ${res.status}: ${body}`)
  }

  const data = (await res.json()) as {
    id?: number | string
    short_tracking_reference?: string
    tracking_reference?: string
  }

  return {
    shipmentId: String(data.id ?? ''),
    trackingNumber: data.short_tracking_reference ?? data.tracking_reference ?? '',
  }
}

/**
 * Look up tracking status for a shipment reference.
 */
export async function getTracking(trackingReference: string): Promise<unknown> {
  if (!isConfigured()) {
    throw new Error('SHIPLOGIC_API_KEY not configured')
  }
  const res = await shiplogicFetch(
    `/tracking?tracking_reference=${encodeURIComponent(trackingReference)}`,
    { method: 'GET' },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Shiplogic /tracking ${res.status}: ${body}`)
  }
  return res.json()
}
