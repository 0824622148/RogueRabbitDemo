// Server-side cart pricing. SERVER-ONLY (service role client).
//
// The browser only ever sends { inventoryId, qty }. Names, prices, category and
// stock are all read from the database here, so a tampered cart can't change
// what is charged.

import { getServiceClient } from '@/lib/admin/service'

export interface CartInput {
  inventoryId: number
  qty: number
}

export interface PricedLine {
  inventoryId: number
  productId: number
  colourwayId: string
  productName: string
  colourwayName: string
  sizeValue: string
  qty: number
  unitPrice: number
  category: string
}

/** Per-line and per-order limits — generous for real customers, bounded for abuse. */
export const MAX_QTY_PER_LINE = 10
export const MAX_LINES = 20

/**
 * Validate the raw `items` field from a request body. Merges duplicate lines.
 * Returns null if the shape is wrong.
 */
export function parseCartInput(raw: unknown): CartInput[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_LINES) return null
  const merged = new Map<number, number>()
  for (const r of raw) {
    const inventoryId = Number((r as Record<string, unknown>)?.inventoryId)
    const qty = Number((r as Record<string, unknown>)?.qty)
    if (!Number.isInteger(inventoryId) || inventoryId <= 0) return null
    if (!Number.isInteger(qty) || qty <= 0) return null
    merged.set(inventoryId, (merged.get(inventoryId) ?? 0) + qty)
  }
  const items: CartInput[] = []
  for (const [inventoryId, qty] of merged) {
    if (qty > MAX_QTY_PER_LINE) return null
    items.push({ inventoryId, qty })
  }
  return items
}

export class CartError extends Error {
  constructor(message: string, public status: number = 409) {
    super(message)
  }
}

/**
 * Load and price every line from the DB. Throws CartError if any line is
 * unknown, inactive, footwear (pre-order only), or short on stock.
 *
 * Stock is only checked here, not reserved — it is decremented when PayFast
 * confirms payment (apply_paid_order_stock). A simultaneous last-unit sale is
 * flagged to the admin as an oversell by the ITN handler.
 */
export async function priceCart(items: CartInput[]): Promise<PricedLine[]> {
  const db = getServiceClient()
  const { data, error } = await db
    .from('inventory')
    .select(`
      id, size_value, in_stock, stock_count,
      colourways (
        id, name,
        products ( id, name, price, category, is_active )
      )
    `)
    .in('id', items.map((i) => i.inventoryId))

  if (error) {
    console.error('[CART] inventory lookup failed:', JSON.stringify(error))
    throw new CartError('Could not check stock. Please try again.', 500)
  }

  const byId = new Map<number, any>((data ?? []).map((row: any) => [row.id, row]))

  return items.map(({ inventoryId, qty }) => {
    const row = byId.get(inventoryId)
    const cw = row?.colourways
    const product = cw?.products
    if (!row || !cw || !product || !product.is_active) {
      throw new CartError('An item in your bag is no longer available. Please remove it and try again.')
    }
    const category = String(product.category ?? '').toUpperCase()
    if (category === 'FOOTWEAR') {
      throw new CartError('ROUGE 01 is sold by pre-order only and cannot be added to the bag.', 422)
    }
    const stock = row.stock_count == null ? 0 : Number(row.stock_count)
    if (!row.in_stock || stock < qty) {
      const label = `${product.name} ${cw.name} ${row.size_value}`
      throw new CartError(
        stock > 0 && row.in_stock
          ? `Only ${stock} left of ${label}. Please reduce the quantity.`
          : `${label} has just sold out. Please remove it from your bag.`,
      )
    }
    return {
      inventoryId,
      productId: Number(product.id),
      colourwayId: String(cw.id),
      productName: String(product.name),
      colourwayName: String(cw.name),
      sizeValue: String(row.size_value),
      qty,
      unitPrice: Number(product.price),
      category,
    }
  })
}

/** Rounded to cents so float addition can't drift from what the ITN checks. */
export function cartSubtotal(lines: PricedLine[]): number {
  return Math.round(lines.reduce((s, l) => s + l.unitPrice * l.qty, 0) * 100) / 100
}

export function cartUnits(lines: PricedLine[]): number {
  return lines.reduce((s, l) => s + l.qty, 0)
}
