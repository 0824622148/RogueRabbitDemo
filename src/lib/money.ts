/**
 * Shared Rand formatting for the storefront.
 *
 * Prices carry cents (R1499.99), so every amount is printed with two decimals —
 * both to avoid raw float artifacts (450.00000000000006) and so a decimal price
 * never sits next to a bare integer delivery charge.
 */

/** Rand amount with cents, e.g. formatRand(1499.99) -> "R1499.99". */
export function formatRand(amount: number | null | undefined): string {
  return `R${Number(amount ?? 0).toFixed(2)}`
}
