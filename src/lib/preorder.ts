/**
 * Single source of truth for pre-order pricing and the pre-order disclaimer.
 * Imported by the modal (client), the /api/preorder route (server) and the
 * product page so the price and delivery date can never drift out of sync.
 */

/** Full pre-order price in Rand. */
export const FULL_PRICE = 1399

/** Early-access discount (ROUGE30). */
export const DISCOUNT_PCT = 0.30

/** Discounted price when the early-access code is applied (= 979). */
export const DISCOUNTED_PRICE = Math.round(FULL_PRICE * (1 - DISCOUNT_PCT))

/** Early-access code (env may override on the server). */
export const EARLY_ACCESS_CODE = 'ROUGE30'

/** Official delivery-from date shown across the pre-order flow. */
export const DELIVERY_FROM = '5 September 2026'

/**
 * Short pre-order disclaimer reused in the modal, success page and emails.
 * Kept plain-text so it can drop into JSX or an email body.
 */
export const PREORDER_DISCLAIMER =
  `This is a pre-order. Delivery is expected from ${DELIVERY_FROM}, and the Rouge Rabbit team ` +
  `will be in touch to confirm before your order is dispatched.`
