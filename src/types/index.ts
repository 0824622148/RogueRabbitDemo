export interface Product {
  id: number
  name: string
  slug: string
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

export interface ProductImage {
  view: 'FRONT' | 'SIDE' | 'BACK' | 'TOP'
  url: string
}

export interface InventoryItem {
  id: number
  colourway_id: string
  gender: 'M' | 'F'
  size_value: string
  in_stock: boolean
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
