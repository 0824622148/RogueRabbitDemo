import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ColourwayDB, InventoryItem } from '@/types'

// Memoised per request — two callers on the same page share one DB round-trip
const fetchAllProducts = cache(async () => {
  const { data } = await supabase
    .from('products')
    .select(`
      id, name, category, drop_label, price, compare_at_price,
      badge, slug, media_bg, image_contain, image_fit, image_object_pos,
      colourways (
        id, name, hex, sort_order,
        product_images (view, url)
      )
    `)
    .eq('is_active', true)
    .order('id')
  return (data ?? []) as any[]
})

function colourwayToProduct(p: any, cw: any, view: 'FRONT' | 'SIDE'): Product {
  const img = (cw.product_images as any[]).find((i: any) => i.view === view)?.url ?? ''
  return {
    id: cw.sort_order as number,
    name: `${p.name} · ${cw.name}`,
    slug: p.slug,
    colourwayId: cw.id as string,
    cat: `${p.category} / ${p.drop_label}`,
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

export async function getProducts(view: 'FRONT' | 'SIDE' = 'FRONT'): Promise<Product[]> {
  const data = await fetchAllProducts()
  const result: Product[] = []
  for (const p of data) {
    const sorted = [...(p.colourways as any[])].sort((a: any, b: any) => a.sort_order - b.sort_order)
    for (const cw of sorted) {
      result.push(colourwayToProduct(p, cw, view))
    }
  }
  return result
}

export async function getProduct(slug: string): Promise<{
  name: string
  price: number
  colourways: ColourwayDB[]
} | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, price,
      colourways (
        id, name, hex, sort_order,
        product_images (view, url),
        inventory (id, colourway_id, gender, size_value, in_stock, sort_order)
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null

  const colourways: ColourwayDB[] = ((data as any).colourways as any[])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((cw: any) => ({
      id: cw.id,
      name: cw.name,
      hex: cw.hex,
      image: (cw.product_images as any[]).find((i: any) => i.view === 'FRONT')?.url ?? '',
      product_id: (data as any).id,
      sort_order: cw.sort_order,
      images: cw.product_images as any[],
      inventory: (cw.inventory as InventoryItem[]).sort((a, b) => a.sort_order - b.sort_order),
    }))

  return { name: (data as any).name, price: (data as any).price, colourways }
}
