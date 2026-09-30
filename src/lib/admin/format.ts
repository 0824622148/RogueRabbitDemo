/** Shared formatting + status helpers for the admin dashboard. */

const JHB = 'Africa/Johannesburg'

/** Date + time in SA locale/timezone (e.g. "03 Jul 2026, 14:32"). */
export function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-ZA', {
    timeZone: JHB,
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

/** Date only (e.g. "03 Jul 2026"). */
export function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    timeZone: JHB, day: '2-digit', month: 'short', year: 'numeric',
  })
}

/** Rand amount with thousands separators and cents, e.g. rand(1499.99) -> "R1 499,99". */
export function rand(amount: number | null | undefined) {
  return `R${Number(amount ?? 0).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const STATUS_COLOUR: Record<string, string> = {
  awaiting_payment: '#A6A6A8',
  pending: '#A6A6A8',
  paid: '#2A9D2A',
  shipped: '#3B82F6',
  delivered: '#2A9D2A',
  cancelled: '#D90017',
}

/** Display text for a status — only needed where the raw value reads badly. */
export const STATUS_LABEL: Record<string, string> = {
  awaiting_payment: 'AWAITING PAYMENT',
}

/** Status as shown in the UI. */
export function statusLabel(status: string) {
  return STATUS_LABEL[status] ?? String(status).toUpperCase()
}

/**
 * Statuses of a verified-paid order. The admin only ever lists orders whose
 * payment PayFast has verified (paid_at set by /api/payfast/notify) — unpaid
 * and abandoned checkouts never appear. 'cancelled' shows only for orders
 * cancelled AFTER payment (i.e. refunds).
 */
export const PAID_STATUSES = ['paid', 'shipped', 'delivered']

/** Revenue-bearing statuses. Kept as an alias for existing imports. */
export const CONFIRMED_STATUSES = PAID_STATUSES

/** Status tabs shown in the admin order tables. */
export const ADMIN_STATUS_TABS = ['paid', 'shipped', 'delivered', 'cancelled']

export type AdminOrder = Record<string, any>

export function isLocalDelivery(o: AdminOrder): boolean {
  return o.fulfilment_type === 'local_delivery'
}

/**
 * Forward-only status moves an admin may make. 'paid' is never reachable from
 * the admin — only a verified PayFast ITN sets it.
 *   paid     → shipped   (local: "out for delivery"; courier: via BOOK COLLECTION)
 *   shipped  → delivered
 *   paid / shipped → cancelled  (refund — done in PayFast, recorded here)
 */
export const ADMIN_TRANSITIONS: Record<string, string[]> = {
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
}

/** One-line summary of what was bought, for tables and email subjects. */
export function itemsLabel(o: AdminOrder): string {
  if (o.order_type === 'shop') {
    const items = (o.order_items ?? []) as AdminOrder[]
    if (!items.length) return '—'
    return items
      .map((i) => [i.product_name, i.colourway_name, i.size_value].filter(Boolean).join(' ') + ` ×${i.qty}`)
      .join(', ')
  }
  return [`ROUGE 01 ${o.colourway ?? ''}`.trim(), o.size_value && `${o.size_value} · ${o.gender ?? ''}`]
    .filter(Boolean)
    .join(' · ')
}

/** Reasons offered when the team changes a stock count (logged per change). */
export const STOCK_REASONS = ['Restock', 'Damaged / lost', 'Count correction', 'Test order', 'Other'] as const
export const LOW_STOCK_AT = 3
