import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin/session'
import { getServiceClient } from '@/lib/admin/service'
import { STOCK_REASONS } from '@/lib/admin/format'

/**
 * Set one size's stock count. Compare-and-set via admin_set_stock(): the
 * write only lands if the count is still `expected` — if a PayFast sale moved
 * it since the page loaded, returns 409 with the current count instead.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin(request)
  if (denied) return denied

  const inventoryId = Number((await params).id)
  let body: { expected?: unknown; stock?: unknown; reason?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const expected = Number(body.expected)
  const stock = Number(body.stock)
  const reason = String(body.reason ?? '')
  const valid =
    Number.isInteger(inventoryId) && inventoryId > 0 &&
    Number.isInteger(expected) && expected >= 0 &&
    Number.isInteger(stock) && stock >= 0 && stock <= 999 &&
    (STOCK_REASONS as readonly string[]).includes(reason)
  if (!valid) {
    return NextResponse.json({ error: 'Stock must be a whole number from 0 to 999, with a reason' }, { status: 400 })
  }

  const { data, error } = await getServiceClient().rpc('admin_set_stock', {
    p_inventory_id: inventoryId,
    p_expected: expected,
    p_new: stock,
    p_reason: reason,
  })
  if (error) {
    console.error('[ADMIN STOCK] update failed:', JSON.stringify(error))
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  const result = (Array.isArray(data) ? data[0] : data) as { ok: boolean; current_count: number } | undefined
  if (!result?.ok) {
    return NextResponse.json(
      { error: 'Stock changed since the page loaded', current: result?.current_count ?? null },
      { status: 409 },
    )
  }

  // Category grids and the homepage are cached (revalidate 60–300s) — refresh now.
  for (const path of ['/', '/shop', '/shop/apparel', '/shop/accessories']) revalidatePath(path)

  return NextResponse.json({ ok: true, stock: result.current_count })
}
