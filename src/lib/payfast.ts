import { createHash } from 'crypto'

const SANDBOX = process.env.PAYFAST_SANDBOX === 'true'
const PF_HOST = SANDBOX
  ? 'https://sandbox.payfast.co.za'
  : 'https://www.payfast.co.za'

export const PAYFAST_URL = `${PF_HOST}/eng/process`

function pfEncode(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, '+')
}

// Builds signature from params in their insertion order (matching PayFast PHP example).
// PayFast's ITN validation iterates $_POST in received order, so the order the fields
// are inserted here must match the order they are submitted in the form.
export function buildSignature(
  params: Record<string, string>,
  passphrase?: string,
): string {
  let paramString = Object.entries(params)
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${k}=${pfEncode(v)}`)
    .join('&')

  if (passphrase) {
    paramString += `&passphrase=${pfEncode(passphrase)}`
  }

  return createHash('md5').update(paramString).digest('hex')
}

interface PayFastOrder {
  reference: string
  name: string
  email: string
  amountDue: number
  /** Shown on the PayFast page and statement. Truncated to 100 chars. */
  itemName: string
  /** Site-relative paths PayFast sends the customer back to (the reference is appended). */
  returnPath: string
  cancelPath: string
}

export function buildPayFastPayload(order: PayFastOrder): {
  url: string
  fields: Record<string, string>
} {
  const merchantId = (process.env.PAYFAST_MERCHANT_ID ?? '').trim()
  const merchantKey = (process.env.PAYFAST_MERCHANT_KEY ?? '').trim()
  const passphrase = (process.env.PAYFAST_PASSPHRASE ?? '').trim()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim()

  const nameParts = order.name.trim().split(' ')
  const nameFirst = nameParts[0]
  const nameLast = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]

  const itemName = order.itemName.slice(0, 100)
  const ref = encodeURIComponent(order.reference)

  // Field order matches PayFast's PHP integration example exactly.
  // Insertion order is preserved in the form POST and must match what PayFast
  // uses when rebuilding the signature during ITN/checkout validation.
  const fields: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${siteUrl}${order.returnPath}?ref=${ref}`,
    cancel_url: `${siteUrl}${order.cancelPath}?ref=${ref}`,
    notify_url: `${siteUrl}/api/payfast/notify`,
    name_first: nameFirst,
    name_last: nameLast,
    email_address: order.email,
    m_payment_id: order.reference,
    amount: order.amountDue.toFixed(2),
    item_name: itemName,
  }

  // Never log the pre-hash string — it contains the passphrase.
  const signature = buildSignature(fields, passphrase || undefined)

  return {
    url: PAYFAST_URL,
    fields: { ...fields, signature },
  }
}

// PayFast's published ITN source hosts. Their current IPs are resolved at
// request time, and the published ranges below are accepted as well — see
// https://developers.payfast.co.za/docs#step_4_confirm_payment
const PAYFAST_HOSTS = ['www.payfast.co.za', 'sandbox.payfast.co.za', 'w1w.payfast.co.za', 'w2w.payfast.co.za']
const PAYFAST_CIDRS = ['197.97.145.144/28', '41.74.179.192/27', '102.216.36.0/28', '102.216.36.128/28', '144.126.193.139/32']

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  let n = 0
  for (const p of parts) {
    const v = Number(p)
    if (!Number.isInteger(v) || v < 0 || v > 255) return null
    n = (n << 8) + v
  }
  return n >>> 0
}

function inCidr(ip: string, cidr: string): boolean {
  const [base, bitsStr] = cidr.split('/')
  const ipN = ipv4ToInt(ip)
  const baseN = ipv4ToInt(base)
  const bits = Number(bitsStr)
  if (ipN === null || baseN === null) return false
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0
  return (ipN & mask) === (baseN & mask)
}

/** True if the request came from PayFast. `ip` is the client IP Vercel reports. */
export async function isPayFastSource(ip: string | null): Promise<boolean> {
  if (process.env.PAYFAST_SKIP_IP_CHECK === 'true') return true
  if (!ip) return false
  const clean = ip.trim().replace(/^::ffff:/, '')
  if (PAYFAST_CIDRS.some((c) => inCidr(clean, c))) return true
  try {
    const { lookup } = await import('dns/promises')
    const resolved = await Promise.all(
      PAYFAST_HOSTS.map((h) => lookup(h, { all: true }).catch(() => [])),
    )
    return resolved.flat().some((r) => r.address === clean)
  } catch {
    return false
  }
}

export interface ITNValidation {
  valid: boolean
  reason?: string
  /**
   * True when we couldn't reach PayFast to confirm. The route should answer
   * non-200 so PayFast re-sends the notification later, rather than either
   * accepting an unconfirmed payment or dropping a real one.
   */
  retry?: boolean
}

/**
 * Every check must pass before an order is marked paid:
 *   status COMPLETE, our merchant id, matching reference, exact amount,
 *   valid signature, and PayFast's own server confirming the data (fails
 *   closed — an unreachable validate endpoint means "try again", never "ok").
 * The source-IP check is done by the route with isPayFastSource().
 */
export async function validateITN(
  params: Record<string, string>,
  expectedAmount: number,
  expectedReference: string,
): Promise<ITNValidation> {
  if (params.payment_status !== 'COMPLETE') {
    return { valid: false, reason: `payment_status is ${params.payment_status}` }
  }

  const merchantId = (process.env.PAYFAST_MERCHANT_ID ?? '').trim()
  if (!merchantId || params.merchant_id !== merchantId) {
    return { valid: false, reason: 'merchant_id mismatch' }
  }

  if (params.m_payment_id !== expectedReference) {
    return { valid: false, reason: 'reference mismatch' }
  }

  const amountGross = parseFloat(params.amount_gross ?? '0')
  if (Math.abs(amountGross - expectedAmount) > 0.01) {
    return { valid: false, reason: `amount mismatch: got ${amountGross}, expected ${expectedAmount}` }
  }

  // Verify signature
  const { signature, ...sigParams } = params
  const passphrase = (process.env.PAYFAST_PASSPHRASE ?? '').trim()
  const expectedSig = buildSignature(sigParams, passphrase || undefined)
  if (expectedSig !== signature) {
    return { valid: false, reason: 'signature mismatch' }
  }

  // Confirm with PayFast's servers. Fails closed.
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const validateUrl = `${PF_HOST}/eng/query/validate`

    const rawBody = Object.entries(params)
      .map(([k, v]) => `${k}=${pfEncode(v)}`)
      .join('&')

    const res = await fetch(validateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: rawBody,
      signal: controller.signal,
    })
    clearTimeout(timeout)

    const text = (await res.text()).trim()
    if (text !== 'VALID') {
      return { valid: false, reason: `PayFast validate returned: ${text}` }
    }
  } catch (err) {
    console.error('[ITN] PayFast validate call failed — asking PayFast to retry:', err)
    return { valid: false, reason: 'validate endpoint unreachable', retry: true }
  }

  return { valid: true }
}
