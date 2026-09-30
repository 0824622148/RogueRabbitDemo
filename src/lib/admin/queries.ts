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
