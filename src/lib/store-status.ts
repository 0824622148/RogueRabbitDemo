/**
 * Storefront trading status.
 *
 * There are two independent switches:
 *
 *  - SNEAKER_ORDERS_ON_HOLD — the ROUGE 01 pre-order (FOOTWEAR). While on, every
 *    footwear price reads "COMING SOON" and /api/preorder refuses new orders.
 *  - SHOP_ORDERS_ON_HOLD — in-stock apparel and accessories sold through the
 *    cart and /api/checkout.
 *
 * Fulfilment is deliberately unaffected by either — the PayFast ITN webhook,
 * the cancel route, the courier webhook and the whole admin panel keep working
 * so in-flight orders still settle and ship.
 *
 * These are plain module constants rather than env vars so the client
 * components (PDPHero, ProductCard, PreOrderModal, CartDrawer) can import them.
 */

/** ROUGE 01 pre-order. False restores footwear pricing and pre-ordering. */
export const SNEAKER_ORDERS_ON_HOLD = true

/** In-stock apparel and accessories (cart checkout). */
export const SHOP_ORDERS_ON_HOLD = false

/** Whether products in this category can currently be ordered. */
export function isOnHold(category: string | null | undefined): boolean {
  return String(category ?? '').toUpperCase() === 'FOOTWEAR'
    ? SNEAKER_ORDERS_ON_HOLD
    : SHOP_ORDERS_ON_HOLD
}

/** Stands in for the price wherever an amount would normally be shown. */
export const COMING_SOON_LABEL = 'COMING SOON'

/** Shown on the product page and returned by the order routes while on hold. */
export const ORDERS_ON_HOLD_MESSAGE =
  'Orders are temporarily on hold. Pricing will be announced soon.'
