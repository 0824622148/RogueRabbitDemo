import { randomBytes } from 'crypto'

/**
 * Server-generated order reference, e.g. "RR-7KQ2M9XA". Sent to PayFast as
 * m_payment_id. Random (not time-based) so references can't be guessed —
 * /api/preorder/cancel is public and keyed on the reference.
 */
export function newOrderReference(): string {
  // Crockford-style alphabet: no 0/O/1/I confusion when read over the phone.
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  const bytes = randomBytes(8)
  let out = ''
  for (const b of bytes) out += alphabet[b % alphabet.length]
  return `RR-${out}`
}
