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

/**
 * Hides the ROUGE 01 from the storefront until it launches (client, 22 Oct 2026):
 * no footwear in listings, menus or the home page, and /shop/footwear and
 * /shop/rouge-01 redirect to /shop. Flip to false to bring it all back.
 */
export const SNEAKERS_HIDDEN = true

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
 * Free hand delivery to Ennerdale postal codes. Off at the client's request
 * (24 Nov 2026): Ennerdale now gets the same options as everywhere else.
 */
export const LOCAL_DELIVERY_LIVE = false

/**
 * Courier (The Courier Guy) delivery. While false, no address can check out
 * (unless LOCAL_DELIVERY_LIVE) — customers see OUTSIDE_DELIVERY_AREA_MESSAGE. Enforced on the server in src/lib/delivery.ts.
 * Flip to true once the ShipLogic account is fully set up.
 */
export const NATIONWIDE_DELIVERY_LIVE = true

/**
 * Free delivery once the bag subtotal reaches this many
 * rand (client, 19 Nov 2026). Offered as its own option (FREE_NATIONWIDE_CODE),
 * dispatched manually by the team; faster paid Courier Guy options stay.
 * Enforced in src/lib/delivery.ts.
 */
export const FREE_SHIPPING_THRESHOLD = 900

/**
 * Service code stored on orders.ship_service_code for free R900+ orders.
 * These are dispatched manually by the Rouge Rabbit team — never booked
 * through "Book collection".
 */
export const FREE_NATIONWIDE_CODE = 'RR_FREE_NATIONWIDE'

/** Delivery estimate shown on the free option. */
export const FREE_SHIPPING_ESTIMATE = '3–5 working days'

/** Shown at checkout while nationwide delivery is off. */
export const OUTSIDE_DELIVERY_AREA_MESSAGE =
  'Apologies — we are delivering to your area soon.'

/** One-line delivery promise for product pages, the bag and checkout. */
export const DELIVERY_SUMMARY = NATIONWIDE_DELIVERY_LIVE
  ? 'Nationwide with The Courier Guy — free on orders of R' + FREE_SHIPPING_THRESHOLD + '+ (3–5 working days), otherwise calculated at checkout.'
  : 'Nationwide delivery coming soon.'

/** Stands in for the price wherever an amount would normally be shown. */
export const COMING_SOON_LABEL = 'COMING SOON'

/** Shown on the product page and returned by the order routes while on hold. */
export const ORDERS_ON_HOLD_MESSAGE =
  'Orders are temporarily on hold. Pricing will be announced soon.'
