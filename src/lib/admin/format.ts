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
  pending: '#A6A6A8',
  paid: '#2A9D2A',
  shipped: '#3B82F6',
  delivered: '#2A9D2A',
  cancelled: '#D90017',
}

/** Statuses that count as confirmed (paid or further along the pipeline). */
export const CONFIRMED_STATUSES = ['paid', 'shipped', 'delivered']

export const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]
