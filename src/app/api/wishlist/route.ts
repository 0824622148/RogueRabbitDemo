import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  const db = getServiceClient()
  const { data, error } = await db
    .from('wishlist')
    .select(`
      id, product_id, colourway_id,
      products ( name, slug, price, media_bg ),
      colourways ( name, hex, product_images ( view, url ) )
    `)
    .eq('email', email.toLowerCase())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[WISHLIST] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email, productId, colourwayId } = body as {
    email: string
    productId: number
    colourwayId?: string
  }

  if (!email || !isValidEmail(email) || !productId) {
    return NextResponse.json({ error: 'email and productId required' }, { status: 422 })
  }

  const db = getServiceClient()
  const { error } = await db.from('wishlist').upsert(
    {
      email: email.toLowerCase(),
      product_id: productId,
      colourway_id: colourwayId ?? null,
    },
    { onConflict: 'email,product_id,colourway_id', ignoreDuplicates: true },
  )

  if (error) {
    console.error('[WISHLIST] POST error:', error)
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email, productId, colourwayId } = body as {
    email: string
    productId: number
    colourwayId?: string | null
  }

  if (!email || !isValidEmail(email) || !productId) {
    return NextResponse.json({ error: 'email and productId required' }, { status: 422 })
  }

  const db = getServiceClient()
  let query = db
    .from('wishlist')
    .delete()
    .eq('email', email.toLowerCase())
    .eq('product_id', productId)

  if (colourwayId) {
    query = query.eq('colourway_id', colourwayId)
  } else {
    query = query.is('colourway_id', null)
  }

  const { error } = await query

  if (error) {
    console.error('[WISHLIST] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
