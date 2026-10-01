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

/**
 * Courier (The Courier Guy) delivery outside Ennerdale. While false, only
 * Ennerdale postal codes can check out — everyone else sees
 * OUTSIDE_DELIVERY_AREA_MESSAGE. Enforced on the server in src/lib/delivery.ts.
 * Flip to true once the ShipLogic account is fully set up.
 */
export const NATIONWIDE_DELIVERY_LIVE = true

/** Shown at checkout to addresses outside Ennerdale while nationwide is off. */
export const OUTSIDE_DELIVERY_AREA_MESSAGE =
  'Apologies — we are delivering to your area soon. Rouge Rabbit was born in Ennerdale, ' +
  'so our home town gets first delivery (free) while we roll out nationwide.'

/** One-line delivery promise for product pages, the bag and checkout. */
export const DELIVERY_SUMMARY = NATIONWIDE_DELIVERY_LIVE
  ? 'Free in Ennerdale — the town where Rouge Rabbit was born, hand-delivered by our team. Nationwide with The Courier Guy, calculated at checkout.'
  : 'Free in Ennerdale — the town where Rouge Rabbit was born, hand-delivered by our team. Nationwide delivery coming soon.'

/** Stands in for the price wherever an amount would normally be shown. */
export const COMING_SOON_LABEL = 'COMING SOON'

/** Shown on the product page and returned by the order routes while on hold. */
export const ORDERS_ON_HOLD_MESSAGE =
  'Orders are temporarily on hold. Pricing will be announced soon.'
