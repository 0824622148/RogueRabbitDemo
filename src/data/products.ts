import type { Product, Colourway, Size } from '@/types'

export const HOME_PRODUCTS: Product[] = [
  { id: 1, name: 'ROUGE 01 · OBSIDIAN', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-black-side.png', badge: 'NEW', sizes: '07', mediaBg: '#fff' },
  { id: 2, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-red-side.png',  badge: 'HOT', sizes: '06', mediaBg: '#fff' },
  { id: 3, name: 'ROUGE 01 · ICE',      cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-blue-side.png',  sizes: '07', mediaBg: '#fff' },
  { id: 4, name: 'ROUGE 01 · ROSE',     cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-pink-side.png',  sizes: '05', mediaBg: '#fff' },
]

export const SHOP_PRODUCTS: Product[] = [
  { id: 1, name: 'ROUGE 01 · OBSIDIAN', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-black-front.png', badge: 'NEW', mediaBg: '#fff' },
  { id: 2, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-red-front.png',   badge: 'HOT', mediaBg: '#fff' },
  { id: 3, name: 'ROUGE 01 · ICE',      cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-blue-front.png',  mediaBg: '#fff' },
  { id: 4, name: 'ROUGE 01 · ROSE',     cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-pink-front.png',  mediaBg: '#fff' },
  { id: 5, name: 'ROUGE 01 · BEIGE',    cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-brown-front.png', badge: 'NEW', mediaBg: '#fff' },
]

export const NEW_ARRIVALS: Product[] = [
  { id: 11, name: 'ROUGE 01 · OBSIDIAN', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-black-front.png', badge: 'NEW', mediaBg: '#fff' },
  { id: 12, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-red-front.png',   badge: 'HOT', mediaBg: '#fff' },
  { id: 13, name: 'ROUGE 01 · ICE',      cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-blue-front.png',  mediaBg: '#fff' },
  { id: 14, name: 'ROUGE 01 · ROSE',     cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-pink-front.png',  mediaBg: '#fff' },
  { id: 15, name: 'ROUGE 01 · BEIGE',    cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-brown-front.png', badge: 'NEW', mediaBg: '#fff' },
]

export const RECOMMENDED_PRODUCTS: Product[] = [
  { id: 21, name: 'ROUGE 01 · ICE',      cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-blue-front.png',  mediaBg: '#fff' },
  { id: 22, name: 'ROUGE 01 · ROSE',     cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-pink-front.png',  mediaBg: '#fff' },
  { id: 23, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-red-front.png',   mediaBg: '#fff' },
  { id: 24, name: 'ROUGE 01 · BEIGE',    cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-brown-front.png', mediaBg: '#fff' },
]

export const COLOURWAYS: Colourway[] = [
  { id: 'obs', name: 'OBSIDIAN', hex: '#0F0F10', image: '/assets/shoe-black-front.png' },
  { id: 'car', name: 'CARDINAL', hex: '#D90017', image: '/assets/shoe-red-front.png'   },
  { id: 'ice', name: 'ICE',      hex: '#9DC9E7', image: '/assets/shoe-blue-front.png'  },
  { id: 'ros', name: 'ROSE',     hex: '#F3B0B9', image: '/assets/shoe-pink-front.png'  },
  { id: 'brn', name: 'BEIGE',    hex: '#C4A882', image: '/assets/shoe-brown-front.png' },
]

export const MALE_SIZES: Size[] = [
  { v: 'US 6',  oos: false },
  { v: 'US 7',  oos: false },
  { v: 'US 8',  oos: false },
  { v: 'US 9',  oos: false },
  { v: 'US 10', oos: false },
  { v: 'US 11', oos: false },
  { v: 'US 12', oos: false },
  { v: 'US 13', oos: false },
]

export const FEMALE_SIZES: Size[] = [
  { v: 'US 4',  oos: false },
  { v: 'US 5',  oos: false },
  { v: 'US 6',  oos: false },
  { v: 'US 7',  oos: false },
  { v: 'US 8',  oos: false },
  { v: 'US 9',  oos: false },
  { v: 'US 10', oos: false },
  { v: 'US 11', oos: false },
]

// Keep for backwards compatibility
export const SIZES = MALE_SIZES

export const MARQUEE_ITEMS_1 = [
  'DROP 003 · LIVE NOW', 'DELIVERY COMING SOON · PRE-ORDER NOW', 'NUMBERED EDITIONS · 250 PAIRS',
  'MEMBERS GET EARLY ACCESS', 'RAW BY NATURE.', 'BUILT DIFFERENT.', 'WEAR THE EDGE.', 'ROUGE IS A MOVEMENT.',
]

export const MARQUEE_ITEMS_2 = [
  'STAND OUT ALWAYS.', 'ROUGE IS A MOVEMENT.', 'NOT FOR EVERYONE.', 'REAL · RAW · ROUGE.',
  'WEAR THE EDGE.', 'BUILT DIFFERENT.', 'EST 2023 · INDEPENDENT.',
]
