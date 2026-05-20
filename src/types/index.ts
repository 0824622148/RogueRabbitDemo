export interface Product {
  id: number
  name: string
  cat: string
  price: string
  image: string
  badge?: string
  sizes?: string
  compareAt?: string
  mediaBg?: string
  contain?: number
  fit?: string
  objectPos?: string
}

export interface Colourway {
  id: string
  name: string
  hex: string
  image: string
}

export interface Size {
  v: string
  oos: boolean
}
