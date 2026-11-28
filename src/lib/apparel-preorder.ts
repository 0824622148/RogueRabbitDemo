/**
 * Apparel sold on PRE-ORDER through the normal bag + PayFast checkout.
 *
 * Client, 28 Nov 2026: the FREQUENCY SHORT SET is pre-order only. R2,500 is
 * the pre-order price, paid in full at checkout. The sets are made in a first
 * run of PREORDER_BATCH and are dispatched once that run is ready.
 *
 * Safe for client and server code (no imports). The storefront matches
 * products by slug; orders only store product_id / product_name, so those are
 * matched too (product id 13 on live).
 *
 * When the run is ready and the set is sold from stock, remove it from these
 * lists. Past orders will no longer show the PRE-ORDER tag in admin.
 */

/** Size of the first production run. */
export const PREORDER_BATCH = 50

const PREORDER_SLUGS = new Set(['rouge-track-set'])
const PREORDER_PRODUCT_IDS = new Set([13])
const PREORDER_PRODUCT_NAMES = new Set(['FREQUENCY SHORT SET'])

export const PREORDER_BADGE = 'PRE-ORDER'

export function isPreOrderSlug(slug: string | null | undefined): boolean {
  return !!slug && PREORDER_SLUGS.has(slug)
}

/** For order_items rows (admin, emails), which store product_id and product_name. */
export function isPreOrderLine(line: { product_id?: unknown; product_name?: unknown }): boolean {
  return (
    PREORDER_PRODUCT_IDS.has(Number(line.product_id)) ||
    PREORDER_PRODUCT_NAMES.has(String(line.product_name ?? '').toUpperCase())
  )
}

/** One sentence for the product page, the bag and checkout. */
export const PREORDER_NOTE =
  `Pre-order only. The price shown is the pre-order price, paid at checkout. Sets are made in a first run of ` +
  `${PREORDER_BATCH} and dispatched as soon as that run is ready. We'll email you with updates.`

/** Shown in the bag and at checkout under a pre-order line. */
export const PREORDER_LINE_NOTE = `PRE-ORDER · SHIPS WHEN THE FIRST ${PREORDER_BATCH} ARE READY`
