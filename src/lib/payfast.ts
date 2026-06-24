import { createHash } from 'crypto'

const SANDBOX = process.env.PAYFAST_SANDBOX === 'true'
const PF_HOST = SANDBOX
  ? 'https://sandbox.payfast.co.za'
  : 'https://www.payfast.co.za'

export const PAYFAST_URL = `${PF_HOST}/eng/process`
const PAYFAST_VALIDATE_URL = `${PF_HOST}/eng/query/validate`

function pfEncode(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, '+')
}

export function buildSignature(
  params: Record<string, string>,
  passphrase?: string,
): string {
  const sorted = Object.keys(params)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = params[key]
      return acc
    }, {})

  let paramString = Object.entries(sorted)
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

  const fields: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${siteUrl}/preorder/success?ref=${order.reference}`,
    cancel_url: `${siteUrl}/preorder/cancel?ref=${order.reference}`,
    notify_url: `${siteUrl}/api/payfast/notify`,
    m_payment_id: order.reference,
    amount: order.amountDue.toFixed(2),
    item_name: itemName,
    name_first: nameFirst,
    name_last: nameLast,
    email_address: order.email,
  }

  // PayFast requires merchant_key to be EXCLUDED from the signature hash.
  const { merchant_key: _mk, ...sigFields } = fields
  const signature = buildSignature(sigFields, passphrase || undefined)

  console.log('[PAYFAST PAYLOAD]', {
    url: PAYFAST_URL,
    merchant_id: merchantId,
    merchant_key_preview: merchantKey ? `${merchantKey.slice(0, 3)}...${merchantKey.slice(-3)}` : 'MISSING',
    sandbox_env: process.env.PAYFAST_SANDBOX,
    amount: fields.amount,
    notify_url: fields.notify_url,
    signature,
  })

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
