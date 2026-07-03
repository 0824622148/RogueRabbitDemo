import { getServiceClient } from './service'

/** All orders, newest first. Server-only (service role). */
export async function getOrders() {
  const db = getServiceClient()
  const { data } = await db.from('orders').select('*').order('created_at', { ascending: false })
  return (data ?? []) as Record<string, any>[]
}

/** All members, newest first. Server-only (service role). */
export async function getMembers() {
  const db = getServiceClient()
  const { data } = await db.from('members').select('*').order('created_at', { ascending: false })
  return (data ?? []) as Record<string, any>[]
}
