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
  colourway: string
  size: string
  gender: string
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

  const itemName = `ROUGE 01 - ${order.colourway} - ${order.size} ${order.gender}`.slice(0, 100)

  // Field order matches PayFast's PHP integration example exactly.
  // Insertion order is preserved in the form POST and must match what PayFast
  // uses when rebuilding the signature during ITN/checkout validation.
  const fields: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${siteUrl}/preorder/success?ref=${order.reference}`,
    cancel_url: `${siteUrl}/preorder/cancel?ref=${order.reference}`,
    notify_url: `${siteUrl}/api/payfast/notify`,
    name_first: nameFirst,
    name_last: nameLast,
    email_address: order.email,
    m_payment_id: order.reference,
    amount: order.amountDue.toFixed(2),
    item_name: itemName,
  }

  const signature = buildSignature(fields, passphrase || undefined)
  const preHashString = Object.entries(fields)
    .filter(([, v]) => v !== '')
    .map(([k, v]) => `${k}=${pfEncode(v)}`)
    .join('&') + (passphrase ? `&passphrase=${pfEncode(passphrase)}` : '')
  console.log('[PAYFAST] pre-hash:', preHashString)
  console.log('[PAYFAST] signature:', signature)

  return {
    url: PAYFAST_URL,
    fields: { ...fields, signature },
  }
}

export async function validateITN(
  params: Record<string, string>,
  expectedAmount: number,
  expectedReference: string,
): Promise<{ valid: boolean; reason?: string }> {
  if (params.payment_status !== 'COMPLETE') {
    return { valid: false, reason: `payment_status is ${params.payment_status}` }
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
  const passphrase = process.env.PAYFAST_PASSPHRASE || ''
  const expectedSig = buildSignature(sigParams, passphrase || undefined)
  if (expectedSig !== signature) {
    return { valid: false, reason: 'signature mismatch' }
  }

  // Validate with PayFast servers
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const pfHost = SANDBOX ? 'https://sandbox.payfast.co.za' : 'https://www.payfast.co.za'
    const validateUrl = `${pfHost}/eng/query/validate`

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

    const text = await res.text()
    if (text.trim() !== 'VALID') {
      return { valid: false, reason: `PayFast validate returned: ${text.trim()}` }
    }
  } catch (err) {
    console.warn('[ITN] PayFast validate call failed:', err)
    // Do not reject the ITN solely due to validate timeout — signature + amount already checked
  }

  return { valid: true }
}
