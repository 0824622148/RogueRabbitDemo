import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ColourwayDB, InventoryItem } from '@/types'

const LISTING_COLUMNS = `
  id, name, category, drop_label, price, compare_at_price,
  badge, slug, media_bg, image_contain, image_fit, image_object_pos,
  colourways (
    id, name, hex, sort_order,
    product_images (view, url)
  )
`

// Memoised per request — two callers on the same page share one DB round-trip.
// Newest release first ("All Items — latest release"); id breaks ties so pieces
// from the same drop keep their seeded order.
const fetchAllProducts = cache(async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`${LISTING_COLUMNS}, collection_id, release_date`)
    .eq('is_active', true)
    .order('release_date', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false })
  if (!error) return (data ?? []) as any[]

  // release_date / collection_id arrive with supabase/010_collections.sql —
  // keep the shop up if the code deploys before the migration has run.
  const { data: legacy } = await supabase
    .from('products')
    .select(LISTING_COLUMNS)
    .eq('is_active', true)
    .order('id')
  return (legacy ?? []) as any[]
})

function colourwayToProduct(p: any, cw: any, view: 'FRONT' | 'SIDE'): Product {
  const images = cw.product_images as any[]
  // Apparel has no SIDE shot — fall back to FRONT rather than a blank card.
  const img =
    images.find((i: any) => i.view === view)?.url ??
    images.find((i: any) => i.view === 'FRONT')?.url ??
    ''
  return {
    id: cw.sort_order as number,
    productId: p.id as number,
    category: p.category ?? undefined,
    name: `${p.name} · ${cw.name}`,
    slug: p.slug,
    colourwayId: cw.id as string,
    cat: [p.category, p.drop_label].filter(Boolean).join(' / '),
    drop_label: p.drop_label,
    price: p.price as number,
    image: img,
    badge: p.badge ?? undefined,
    compareAt: p.compare_at_price ?? undefined,
    mediaBg: p.media_bg ?? undefined,
    contain: p.image_contain ?? undefined,
    fit: p.image_fit ?? undefined,
    objectPos: p.image_object_pos ?? undefined,
  }
}

function toProducts(rows: any[], view: 'FRONT' | 'SIDE'): Product[] {
  const result: Product[] = []
  for (const p of rows) {
    const sorted = [...(p.colourways as any[])].sort((a: any, b: any) => a.sort_order - b.sort_order)
    for (const cw of sorted) {
      result.push(colourwayToProduct(p, cw, view))
    }
  }
  return result
}

export async function getProducts(view: 'FRONT' | 'SIDE' = 'FRONT'): Promise<Product[]> {
  return toProducts(await fetchAllProducts(), view)
}

/** One card per colourway for a single category (APPAREL, ACCESSORIES, …). */
export async function getProductsByCategory(
  category: string,
  view: 'FRONT' | 'SIDE' = 'FRONT',
): Promise<Product[]> {
  const rows = (await fetchAllProducts()).filter(
    (p) => String(p.category ?? '').toUpperCase() === category.toUpperCase(),
  )
  return toProducts(rows, view)
}

/** One card per colourway for the given collections (a collection plus its sub-collections). */
export async function getProductsByCollection(
  collectionIds: number[],
  view: 'FRONT' | 'SIDE' = 'FRONT',
): Promise<Product[]> {
  const ids = new Set(collectionIds)
  const rows = (await fetchAllProducts()).filter((p) => ids.has(p.collection_id))
  return toProducts(rows, view)
}

export interface ProductDetail {
  id: number
  name: string
  slug: string
  category: string | null
  dropLabel: string | null
  price: number
  compareAt: number | null
  badge: string | null
  mediaBg: string | null
  colourways: ColourwayDB[]
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, slug, category, drop_label, price, compare_at_price, badge, media_bg,
      colourways (
        id, name, hex, sort_order,
        product_images (view, url),
        inventory (id, colourway_id, gender, size_value, in_stock, stock_count, sort_order)
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  const d = data as any

  const colourways: ColourwayDB[] = (d.colourways as any[])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((cw: any) => ({
      id: cw.id,
      name: cw.name,
      hex: cw.hex,
      image: (cw.product_images as any[]).find((i: any) => i.view === 'FRONT')?.url ?? '',
      product_id: d.id,
      sort_order: cw.sort_order,
      images: cw.product_images as any[],
      inventory: (cw.inventory as InventoryItem[]).sort((a, b) => a.sort_order - b.sort_order),
    }))

  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    category: d.category ?? null,
    dropLabel: d.drop_label ?? null,
    price: Number(d.price),
    compareAt: d.compare_at_price != null ? Number(d.compare_at_price) : null,
    badge: d.badge ?? null,
    mediaBg: d.media_bg ?? null,
    colourways,
  }
}
