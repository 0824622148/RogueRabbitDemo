import { getServiceClient } from './service'

/**
 * Orders whose payment PayFast has verified, newest payment first, with their
 * line items. Server-only (service role).
 *
 * This is the ONLY order query the admin uses. Checkouts that were started but
 * never paid (awaiting_payment / cancelled-before-payment / legacy pending)
 * have no paid_at and are deliberately never shown — they stay in the
 * database as an audit trail only.
 */
export async function getPaidOrders() {
  const db = getServiceClient()
  const { data, error } = await db
    .from('orders')
    .select('*, order_items(*)')
    .not('paid_at', 'is', null)
    .order('paid_at', { ascending: false })
  if (error) console.error('[ADMIN] getPaidOrders failed:', JSON.stringify(error))
  return (data ?? []) as Record<string, any>[]
}

/** All members, newest first. Server-only (service role). */
export async function getMembers() {
  const db = getServiceClient()
  const { data } = await db.from('members').select('*').order('created_at', { ascending: false })
  return (data ?? []) as Record<string, any>[]
}

export interface StockRow {
  inventoryId: number
  size: string
  stock: number
  sortOrder: number
}

export interface StockColourway {
  id: string
  name: string
  hex: string | null
  sizes: StockRow[]
}

export interface StockProduct {
  id: number
  name: string
  category: string
  colourways: StockColourway[]
}

/** Stock-tracked products (tees + caps), grouped product → colourway → size. */
export async function getInventory(): Promise<StockProduct[]> {
  const db = getServiceClient()
  const { data, error } = await db
    .from('products')
    .select('id, name, category, colourways (id, name, hex, sort_order, inventory (id, size_value, stock_count, sort_order))')
    .in('category', ['APPAREL', 'ACCESSORIES'])
    .eq('is_active', true)
    .order('category', { ascending: false })
    .order('id')
  if (error) console.error('[ADMIN] getInventory failed:', JSON.stringify(error))
  return ((data ?? []) as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    colourways: [...(p.colourways ?? [])]
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((cw: any) => ({
        id: cw.id,
        name: cw.name,
        hex: cw.hex,
        sizes: [...(cw.inventory ?? [])]
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((i: any) => ({
            inventoryId: i.id,
            size: i.size_value,
            stock: i.stock_count ?? 0,
            sortOrder: i.sort_order,
          })),
      })),
  }))
}

export interface StockAdjustment {
  id: number
  label: string
  oldCount: number | null
  newCount: number
  reason: string
  createdAt: string
}

/** Most recent manual stock changes, newest first. */
export async function getStockAdjustments(limit = 20): Promise<StockAdjustment[]> {
  const db = getServiceClient()
  const { data, error } = await db
    .from('stock_adjustments')
    .select('id, old_count, new_count, reason, created_at, inventory (size_value, colourways (name, products (name)))')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) console.error('[ADMIN] getStockAdjustments failed:', JSON.stringify(error))
  return ((data ?? []) as any[]).map((a) => {
    const inv = a.inventory
    const cw = inv?.colourways
    const label = inv
      ? [cw?.products?.name, cw?.name, inv.size_value].filter(Boolean).join(' · ')
      : 'Removed item'
    return {
      id: a.id,
      label,
      oldCount: a.old_count,
      newCount: a.new_count,
      reason: a.reason,
      createdAt: a.created_at,
    }
  })
}
