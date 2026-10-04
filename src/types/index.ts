export interface Product {
  /** Display/React key only — NOT a database id. Use productId for the DB. */
  id: number
  /** products.id */
  productId?: number
  /** products.category, e.g. FOOTWEAR / APPAREL / ACCESSORIES */
  category?: string
  name: string
  slug: string
  colourwayId?: string
  cat: string
  drop_label: string
  price: number
  image: string
  badge?: string
  sizes?: string
  compareAt?: number
  mediaBg?: string
  contain?: number
  fit?: string
  objectPos?: string
}

export interface HeroPanel {
  src: string
  alt: string
  /** CSS object-position keeping the subject in frame, e.g. "55% 60%". */
  pos?: string
}

/** collections row — drives the FEATURED / DROPS menus and /drops/[slug]. */
export interface Collection {
  id: number
  slug: string
  name: string
  parent_id: number | null
  kind: 'collab' | 'drop' | 'sub'
  tagline: string | null
  story: string | null
  hero_image: string | null
  logo_image: string | null
  /** Headline for the drop page hero — falls back to name. */
  hero_title?: string | null
  /** Side-by-side campaign photos; when set, replaces the single hero_image on the drop page. */
  hero_panels?: HeroPanel[] | null
  release_date: string | null
  status: 'live' | 'coming_soon' | 'hidden'
  is_featured: boolean
  sort_order: number
}

/** One entry in the site menu. Top-level items with children open a dropdown. */
export interface NavItem {
  label: string
  href: string
  /** Small tag after the label, e.g. "DROPPING SOON". */
  tag?: string
  /** Campaign image shown in the dropdown panel. */
  image?: string
  children?: NavItem[]
}

export interface ProductImage {
  view: 'FRONT' | 'SIDE' | 'BACK' | 'TOP'
  url: string
}

export interface InventoryItem {
  id: number
  colourway_id: string
  gender: 'M' | 'F' | 'U'
  size_value: string
  in_stock: boolean
  stock_count?: number | null
  sort_order: number
}

export interface Colourway {
  id: string
  name: string
  hex: string
  image: string
}

export interface ColourwayDB extends Colourway {
  product_id: number
  sort_order: number
  images: ProductImage[]
  inventory: InventoryItem[]
}

export interface Size {
  v: string
  oos: boolean
}
