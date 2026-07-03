import crypto from 'crypto'

/**
 * Marketing email helpers for the admin "email all members" feature.
 * Reuses the Resend HTTP API already used by the transactional emails
 * (payfast/notify + ship routes) — no new dependency.
 */

export const MARKETING_FROM =
  process.env.MARKETING_FROM ?? 'Rouge Rabbit <hello@rougerabbit.co.za>'

const UNSUB_SECRET =
  process.env.UNSUBSCRIBE_SECRET ?? process.env.ADMIN_PASSWORD ?? 'rouge-rabbit-unsub'

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rougerabbit.co.za').replace(/\/$/, '')
}

/** Stateless, per-email unsubscribe token (no DB token column needed). */
export function unsubscribeToken(email: string): string {
  return crypto
    .createHmac('sha256', UNSUB_SECRET)
    .update(email.trim().toLowerCase())
    .digest('hex')
    .slice(0, 32)
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email)
  if (token.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

export function unsubscribeUrl(email: string): string {
  const params = new URLSearchParams({ email, token: unsubscribeToken(email) })
  return `${siteUrl()}/unsubscribe?${params.toString()}`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Wrap the admin-composed plain-text message in the Rouge Rabbit brand shell. */
export function campaignHtml(message: string, recipientEmail: string): string {
  const body = escapeHtml(message).replace(/\n/g, '<br/>')
  const unsub = unsubscribeUrl(recipientEmail)
  return `<div style="font-family:monospace;background:#0F0F10;color:#E6E6E6;padding:32px;max-width:560px;">
    <h1 style="color:#D90017;font-size:28px;margin:0 0 8px;">ROUGE RABBIT</h1>
    <p style="color:#A6A6A8;margin:0 0 32px;letter-spacing:.1em;font-size:11px;">BUILT DIFFERENT.</p>
    <div style="color:#E6E6E6;line-height:1.9;font-size:13px;margin:0 0 32px;">${body}</div>
    <p style="color:#3A3A3C;font-size:10px;line-height:1.8;letter-spacing:.08em;border-top:1px solid #1E1E20;padding-top:16px;">
      You're receiving this because you joined the Rouge Rabbit list.
      <a href="${unsub}" style="color:#A6A6A8;">Unsubscribe</a>.
    </p>
  </div>`
}

interface BatchEmail {
  from: string
  to: string[]
  subject: string
  html: string
}

/** Send a batch of up to 100 emails via Resend's batch endpoint. */
async function sendResendBatch(apiKey: string, emails: BatchEmail[]) {
  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(emails),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend batch failed (${res.status}): ${text}`)
  }
}

/**
 * Send `subject` + `message` to every recipient, chunked into batches of 100,
 * each with its own unsubscribe link. Returns the number sent.
 */
export async function sendCampaign(
  recipients: string[],
  subject: string,
  message: string,
): Promise<number> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY not set')

  let sent = 0
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100)
    const emails: BatchEmail[] = chunk.map((email) => ({
      from: MARKETING_FROM,
      to: [email],
      subject,
      html: campaignHtml(message, email),
    }))
    await sendResendBatch(apiKey, emails)
    sent += chunk.length
  }
  return sent
}
