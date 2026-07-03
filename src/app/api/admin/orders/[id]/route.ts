import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/admin/service'

const VALID_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookie = request.cookies.get('rr_admin')
  if (!cookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { status } = body
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 422 })
  }

  const db = getServiceClient()
  const { error } = await db.from('orders').update({ status }).eq('id', id)

  if (error) {
    console.error('[ADMIN PATCH] DB update failed:', JSON.stringify(error))
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
