import type { Product, Colourway, Size } from '@/types'

export const HOME_PRODUCTS: Product[] = [
  { id: 1, name: 'ROUGE 01 · OBSIDIAN', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-black.jpg', badge: 'NEW', sizes: '07' },
  { id: 2, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-red.jpg',   badge: 'HOT', sizes: '06' },
  { id: 3, name: 'ROUGE 01 · ICE',      cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-blue.jpg', sizes: '07' },
  { id: 4, name: 'ROUGE 01 · ROSE',     cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-pink.jpg', sizes: '05' },
]

export const SHOP_PRODUCTS: Product[] = [
  { id: 1, name: 'ROUGE 01 · OBSIDIAN', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-black.jpg', badge: 'NEW' },
  { id: 2, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-red.jpg',   badge: 'HOT' },
  { id: 3, name: 'ROUGE 01 · ICE',      cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-blue.jpg' },
  { id: 4, name: 'ROUGE 01 · ROSE',     cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-pink.jpg' },
  { id: 5, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-red.jpg',   badge: 'LOW STOCK' },
  { id: 6, name: 'ROUGE 01 · OBSIDIAN', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-black.jpg' },
  { id: 7, name: 'ROUGE 01 · ICE',      cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-blue.jpg' },
  { id: 8, name: 'ROUGE 01 · ROSE',     cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-pink.jpg' },
]

export const NEW_ARRIVALS: Product[] = [
  { id: 11, name: 'RABBIT HOODIE',       cat: 'APPAREL · HEAVY WEIGHT', price: '1800', image: '/assets/apparel-hoodie.png', badge: 'NEW', mediaBg: '#0a0a0a', contain: 0.92 },
  { id: 12, name: 'CONTRAST CARGO',      cat: 'APPAREL · TECHNICAL',    price: '1800', image: '/assets/apparel-cargo.png',  mediaBg: '#fff', fit: 'cover', objectPos: '75% center', contain: 1 },
  { id: 13, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003',    price: '1800', image: '/assets/shoe-red.jpg',       mediaBg: '#fff' },
  { id: 14, name: 'ROUGE BUNNY TEE',     cat: 'APPAREL · 240GSM',       price: '1800',  image: '/assets/apparel-tee.png',   mediaBg: '#0a0a0a', contain: 0.88 },
]

export const RECOMMENDED_PRODUCTS: Product[] = [
  { id: 21, name: 'ROUGE 01 · ICE',      cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-blue.jpg' },
  { id: 22, name: 'ROUGE 01 · ROSE',     cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-pink.jpg' },
  { id: 23, name: 'ROUGE 01 · CARDINAL', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-red.jpg' },
  { id: 24, name: 'ROUGE 01 · OBSIDIAN', cat: 'FOOTWEAR / DROP 003', price: '1800', image: '/assets/shoe-black.jpg' },
]

export const COLOURWAYS: Colourway[] = [
  { id: 'obs', name: 'OBSIDIAN', hex: '#0F0F10', image: '/assets/shoe-black.jpg' },
  { id: 'car', name: 'CARDINAL', hex: '#D90017', image: '/assets/shoe-red.jpg' },
  { id: 'ice', name: 'ICE',      hex: '#9DC9E7', image: '/assets/shoe-blue.jpg' },
  { id: 'ros', name: 'ROSE',     hex: '#F3B0B9', image: '/assets/shoe-pink.jpg' },
]

export const SIZES: Size[] = [
  { v: 'US 6',  oos: false },
  { v: 'US 7',  oos: false },
  { v: 'US 8',  oos: false },
  { v: 'US 9',  oos: true  },
  { v: 'US 10', oos: false },
  { v: 'US 11', oos: false },
  { v: 'US 12', oos: false },
  { v: 'US 13', oos: true  },
]

export const MARQUEE_ITEMS_1 = [
  'DROP 003 · LIVE NOW', 'FREE EXPRESS · WORLDWIDE', 'NUMBERED EDITIONS · 250 PAIRS',
  'MEMBERS GET EARLY ACCESS', 'RAW BY NATURE.', 'BUILT DIFFERENT.', 'WEAR THE EDGE.', 'ROUGE IS A MOVEMENT.',
]

export const MARQUEE_ITEMS_2 = [
  'STAND OUT ALWAYS.', 'ROUGE IS A MOVEMENT.', 'NOT FOR EVERYONE.', 'REAL · RAW · ROUGE.',
  'WEAR THE EDGE.', 'BUILT DIFFERENT.', 'EST 2023 · INDEPENDENT.',
]
