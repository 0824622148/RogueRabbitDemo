// Meta Conversions API: server-side Purchase events. SERVER-ONLY.
//
// Added 28 Nov 2026. The pixel (src/lib/meta-pixel.ts) fires Purchase from the
// thank-you page, but that is missed when a buyer closes the tab or blocks the
// pixel. This sends the same Purchase from the PayFast ITN, with the order
// reference as event_id, so Meta deduplicates the pair.
//
// CONSENT: only for buyers who accepted cookies (the client passes
// metaConsent at checkout). Buyers who declined send nothing, the same as the
// pixel. The privacy policy (Advertising Cookies) already covers hashed email
// and phone.
//
// Browser context (fbp/fbc cookies, IP, user agent) can't be stored on the
// order without a DB migration, so it rides through PayFast's custom_str1–5
// fields and comes back on the ITN. Values are restricted to characters that
// URL-encode the same way in JS and PHP, or PayFast's signature check fails —
// hence the user agent is base64url-encoded.

import { createHash } from 'crypto'
import { META_PIXEL_ID } from '@/lib/meta-pixel'

const GRAPH_VERSION = 'v25.0'

/** Marks an order whose buyer accepted cookies (custom_str5). */
const CONSENT_MARK = 'meta1'

/** PayFast limits each custom_str to 255 characters. */
const MAX_FIELD = 255

const FBP_RE = /^fb\.\d\.\d+\.\d+$/
const FBC_RE = /^fb\.\d\.\d+\.[A-Za-z0-9_-]+$/
const IP_RE = /^[0-9a-fA-F:.]{3,45}$/

export interface MetaBrowserContext {
  fbp?: string
  fbc?: string
  ip?: string
  userAgent?: string
}

/**
 * Checkout: PayFast custom fields carrying the browser context, or {} when the
 * buyer didn't accept cookies.
 */
export function metaCustomFields(consent: boolean, ctx: MetaBrowserContext): Record<string, string> {
  if (!consent) return {}
  const fbp = ctx.fbp && FBP_RE.test(ctx.fbp) && ctx.fbp.length <= MAX_FIELD ? ctx.fbp : ''
  const fbc = ctx.fbc && FBC_RE.test(ctx.fbc) && ctx.fbc.length <= MAX_FIELD ? ctx.fbc : ''
  const ip = ctx.ip && IP_RE.test(ctx.ip) ? ctx.ip : ''
  // 189 bytes → 252 base64url chars, under the 255 limit.
  const ua = ctx.userAgent ? Buffer.from(ctx.userAgent.slice(0, 189), 'utf8').toString('base64url') : ''
  return {
    custom_str1: fbp,
    custom_str2: fbc,
    custom_str3: ip,
    custom_str4: ua,
    custom_str5: CONSENT_MARK,
  }
}

/** ITN: read the browser context back. null = no consent, so send nothing. */
export function metaContextFromITN(params: Record<string, string>): MetaBrowserContext | null {
  if ((params.custom_str5 ?? '').trim() !== CONSENT_MARK) return null
  const get = (k: string) => (params[k] ?? '').trim() || undefined
  let userAgent: string | undefined
  const ua = get('custom_str4')
  if (ua) {
    try { userAgent = Buffer.from(ua, 'base64url').toString('utf8') } catch { /* ignore */ }
  }
  return { fbp: get('custom_str1'), fbc: get('custom_str2'), ip: get('custom_str3'), userAgent }
}

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex')

/** Meta wants lower-case, trimmed values, hashed. Empty values are left out. */
function hashed(v: string | null | undefined): string[] | undefined {
  const n = String(v ?? '').trim().toLowerCase()
  return n ? [sha256(n)] : undefined
}

/** South African numbers to E.164 digits: "082 123 4567" → "27821234567". */
function normalisePhone(raw: string | null | undefined): string {
  let d = String(raw ?? '').replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.length === 10 && d.startsWith('0')) d = '27' + d.slice(1)
  return d
}

export interface MetaPurchase {
  reference: string
  email: string
  phone?: string | null
  name?: string | null
  city?: string | null
  postalCode?: string | null
  /** Goods only, excluding delivery — matches the pixel's Purchase value. */
  value: number
  /** Product slugs and quantities — the pixel uses slugs as content ids. */
  contents: { id: string; quantity: number }[]
}

/**
 * Sends one Purchase event. Never throws: a Meta outage must not affect the
 * payment flow. Returns whether Meta accepted it.
 */
export async function sendMetaPurchase(order: MetaPurchase, ctx: MetaBrowserContext): Promise<boolean> {
  const token = (process.env.META_CAPI_TOKEN ?? '').trim()
  if (!token) {
    console.warn('[META CAPI] META_CAPI_TOKEN not set — Purchase not sent')
    return false
  }

  const [first, ...rest] = String(order.name ?? '').trim().split(/\s+/)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rougerabbit.co.za').trim()

  const event = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: order.reference,
    action_source: 'website',
    event_source_url: `${siteUrl}/checkout`,
    user_data: {
      em: hashed(order.email),
      ph: hashed(normalisePhone(order.phone)),
      fn: hashed(first),
      ln: hashed(rest.join(' ')),
      ct: hashed(String(order.city ?? '').replace(/\s+/g, '')),
      zp: hashed(order.postalCode),
      country: hashed('za'),
      external_id: hashed(order.email),
      client_ip_address: ctx.ip,
      client_user_agent: ctx.userAgent,
      fbp: ctx.fbp,
      fbc: ctx.fbc,
    },
    custom_data: {
      currency: 'ZAR',
      value: Math.round(order.value * 100) / 100,
      content_type: 'product',
      content_ids: order.contents.map((c) => c.id),
      contents: order.contents,
      num_items: order.contents.reduce((s, c) => s + c.quantity, 0),
      order_id: order.reference,
    },
  }

  const body = new URLSearchParams({ data: JSON.stringify([event]), access_token: token })
  const testCode = (process.env.META_TEST_EVENT_CODE ?? '').trim()
  if (testCode) body.set('test_event_code', testCode)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events`, {
      method: 'POST',
      body,
      signal: controller.signal,
    })
    clearTimeout(timeout)
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('[META CAPI] Purchase rejected:', order.reference, res.status, JSON.stringify(json))
      return false
    }
    console.log('[META CAPI] Purchase sent:', order.reference, JSON.stringify(json))
    return true
  } catch (err) {
    console.error('[META CAPI] Purchase failed:', order.reference, err)
    return false
  }
}
