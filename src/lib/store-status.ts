/**
 * Storefront-wide trading status.
 *
 * While the hold is on, every customer-facing price reads "COMING SOON" and no
 * new order can be created. Fulfilment is deliberately unaffected — the PayFast
 * ITN webhook, the cancel route, the courier webhook and the whole admin panel
 * keep working on real Rand amounts so in-flight orders still settle and ship.
 *
 * These are plain module constants rather than env vars so the client
 * components (PDPHero, ProductCard, PreOrderModal) can import them directly.
 *
 * To resume trading: set ORDERS_ON_HOLD to false. That is the only edit needed.
 */

/** Master switch. False restores normal pricing and ordering everywhere. */
export const ORDERS_ON_HOLD = true

/** Stands in for the price wherever an amount would normally be shown. */
export const COMING_SOON_LABEL = 'COMING SOON'

/** Shown on the product page and returned by /api/preorder while on hold. */
export const ORDERS_ON_HOLD_MESSAGE =
  'Orders are temporarily on hold. Pricing will be announced soon.'
