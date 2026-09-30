// Transactional email via Resend. SERVER-ONLY.
// (Member campaign sends live in src/lib/admin/email.ts.)

const RESEND_FROM = 'Rouge Rabbit <orders@rougerabbit.co.za>'

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL ?? 'orders@rougerabbit.co.za'
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[EMAIL] RESEND_API_KEY not set — skipping:', subject)
    return
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
    })
    if (!res.ok) {
      console.error('[EMAIL] Resend error:', res.status, await res.text())
    }
  } catch (err) {
    // An email failure must never fail the request that triggered it.
    console.error('[EMAIL] Resend request failed:', err)
  }
}

/** Escape customer-supplied text before it goes into an HTML email. */
export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
