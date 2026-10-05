import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import { getProductsByCollection } from '@/lib/queries/products'
import type { Collection, NavItem, PopupDrop, Product } from '@/types'

// Every visible collection, memoised per request. Returns [] if the table isn't
// there yet (code deployed before supabase/010_collections.sql) so the menu and
// /drops degrade to their plain links instead of erroring.
const COLLECTION_COLUMNS =
  'id, slug, name, parent_id, kind, tagline, story, hero_image, logo_image, release_date, status, is_featured, sort_order'

const fetchCollections = cache(async (): Promise<Collection[]> => {
  const query = (columns: string) =>
    supabase.from('collections').select(columns).neq('status', 'hidden').order('sort_order')

  const { data, error } = await query(`${COLLECTION_COLUMNS}, hero_title, hero_panels`)
  if (!error) return (data ?? []) as unknown as Collection[]

  // hero_title / hero_panels arrive with supabase/011_collection_hero.sql —
  // fall back to the single-image hero until it has run.
  const { data: legacy, error: legacyError } = await query(COLLECTION_COLUMNS)
  if (legacyError) return []
  return (legacy ?? []) as unknown as Collection[]
})

const childrenOf = (all: Collection[], id: number) => all.filter((c) => c.parent_id === id)

export interface CollectionDetail {
  collection: Collection
  parent: Collection | null
  children: { collection: Collection; products: Product[] }[]
  /** Products linked directly to this collection (not via a sub-collection). */
  products: Product[]
}

export async function getCollection(slug: string): Promise<CollectionDetail | null> {
  const all = await fetchCollections()
  const collection = all.find((c) => c.slug === slug)
  if (!collection) return null

  const kids = childrenOf(all, collection.id)
  const [products, ...childProducts] = await Promise.all([
    getProductsByCollection([collection.id]),
    ...kids.map((k) => getProductsByCollection([k.id])),
  ])

  return {
    collection,
    parent: all.find((c) => c.id === collection.parent_id) ?? null,
    children: kids.map((k, i) => ({ collection: k, products: childProducts[i] })),
    products,
  }
}

/** Top-level collections for the DROPS menu and /drops — live first, then teasers. */
export async function getDrops(): Promise<Collection[]> {
  const all = await fetchCollections()
  return all
    .filter((c) => c.parent_id === null)
    .sort((a, b) => Number(a.status !== 'live') - Number(b.status !== 'live') || a.sort_order - b.sort_order)
}

export const dropHref = (c: Pick<Collection, 'slug'>) => `/drops/${c.slug}`

/**
 * The drop that themes the members popup: the featured live drop, else any
 * live drop, else the next one coming soon. Null leaves the plain popup.
 */
export async function getPopupDrop(): Promise<PopupDrop | null> {
  const top = (await fetchCollections()).filter((c) => c.parent_id === null)
  const c =
    top.find((x) => x.is_featured && x.status === 'live') ??
    top.find((x) => x.status === 'live') ??
    top.find((x) => x.status === 'coming_soon')
  if (!c || c.status === 'hidden') return null

  // hero_image is the drop's single "card" shot (worn pieces); reuse its panel's
  // alt / framing when it's also one of the hero panels.
  const panels = c.hero_panels ?? []
  const image = c.hero_image
    ? panels.find((p) => p.src === c.hero_image) ?? { src: c.hero_image, alt: c.name }
    : panels[0] ?? null
  return { name: c.name, slug: c.slug, tagline: c.tagline, status: c.status, logo: c.logo_image, image }
}

/**
 * Product links for a menu column: one per colourway when a piece comes in
 * several ("AIR DOWN TEE · BONE"), otherwise just the piece ("SPLASH TEE").
 * The collection name is dropped from the front — it's already the heading.
 */
function productLinks(products: Product[], collectionName: string): NavItem[] {
  const perProduct = new Map<number | undefined, number>()
  for (const p of products) perProduct.set(p.productId, (perProduct.get(p.productId) ?? 0) + 1)

  const prefix = collectionName.toUpperCase() + ' '
  const seen = new Set<number | undefined>()
  const links: NavItem[] = []
  for (const p of products) {
    const [base, colour] = p.name.split(' · ')
    // Only trim when something descriptive is left ("SPLASH TEE", not just "TEE").
    const rest = base.toUpperCase().startsWith(prefix) ? base.slice(prefix.length) : base
    const short = rest.trim().includes(' ') ? rest : base
    const multi = (perProduct.get(p.productId) ?? 0) > 1
    if (!multi && seen.has(p.productId)) continue
    seen.add(p.productId)
    links.push({
      label: multi && colour ? `${short} · ${colour}` : short,
      href: `/shop/${p.slug}${p.colourwayId ? `?colour=${p.colourwayId}` : ''}`,
    })
  }
  return links
}

/** FEATURED and DROPS dropdowns, built from the collections table. */
export const getNavMenu = cache(async (): Promise<{ featured: NavItem[]; drops: NavItem[] }> => {
  const all = await fetchCollections()

  const featured = await Promise.all(
    all
      .filter((c) => c.parent_id === null && c.is_featured && c.status === 'live')
      .map(async (c): Promise<NavItem> => {
        const subs = childrenOf(all, c.id).filter((s) => s.is_featured && s.status === 'live')
        const children = await Promise.all(
          subs.map(async (s): Promise<NavItem> => ({
            label: s.name,
            href: dropHref(s),
            children: productLinks(await getProductsByCollection([s.id]), s.name),
          })),
        )
        return { label: c.name, href: dropHref(c), image: c.hero_image ?? undefined, children }
      }),
  )

  const drops = (await getDrops()).map((c): NavItem => ({
    label: c.name,
    href: dropHref(c),
    tag: c.status === 'coming_soon' ? 'SOON' : undefined,
  }))

  return { featured, drops }
})
