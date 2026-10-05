import { isTee, TEE_WEIGHT_LABEL } from '@/lib/fabric'

// Copy and size data for tees and caps — shared by the product page and
// /sizing-guide. Tee measurements are typical figures for a 300 GSM oversized
// cut, shown as approximate. Swap in the team's measured numbers when they
// have them.

export interface TeeSizeRow {
  size: string
  /** Chest, measured flat armpit to armpit. */
  chest: number
  /** Body length, high point of the shoulder to the hem. */
  length: number
}

export const TEE_SIZES: TeeSizeRow[] = [
  { size: 'S',  chest: 56, length: 70 },
  { size: 'M',  chest: 59, length: 72 },
  { size: 'L',  chest: 62, length: 74 },
  { size: 'XL', chest: 65, length: 76 },
]

export const TEE_FIT_NOTE =
  'Oversized, boxy fit. Take your usual size for the intended dropped-shoulder look, or size down for a closer fit.'

export const TEE_MEASURE_TIPS = [
  'Lay a tee you already own flat and measure straight across from armpit to armpit — compare that to the chest column.',
  'Measure length from the highest point of the shoulder, next to the collar, down to the hem.',
  'Measurements are approximate and can vary by 1–2 cm.',
]

export const CAP_FIT_NOTE =
  'One size with an adjustable strap and buckle at the back. Fits most heads — roughly 55 to 60 cm around.'

export const CAP_MEASURE_TIPS = [
  'Wrap a tape measure around your head about 1 cm above the eyebrows and ears.',
  'Pull the strap through the buckle to tighten, or let it out to loosen, until the cap sits snug without pressing.',
]

export type ApparelKind = 'tee' | 'cap' | null

export function apparelKind(product: { name: string; category?: string | null }): ApparelKind {
  if (isTee(product.name)) return 'tee'
  if (/\bCAP\b/i.test(product.name)) return 'cap'
  return null
}

/** Description paragraph and spec lines for the product page. */
export function productDetails(kind: ApparelKind): { description: string; specs: string[] } | null {
  if (kind === 'tee') {
    return {
      description:
        'Heavyweight cotton, cut oversized and boxy with dropped shoulders and a wide body. ' +
        'Built to hold its shape, wash after wash.',
      specs: [
        `${TEE_WEIGHT_LABEL} heavyweight cotton`,
        'Oversized, boxy fit · dropped shoulders',
        'Sizes S – XL',
        'Wash cold, inside out · do not tumble dry · do not iron the print',
      ],
    }
  }
  if (kind === 'cap') {
    return {
      description:
        'Five-panel cap with an adjustable strap and buckle at the back. One size, set to fit.',
      specs: [
        '5-panel construction',
        'Adjustable strap with buckle closure',
        'One size fits most · approx. 55 – 60 cm',
        'Spot clean only · do not machine wash',
      ],
    }
  }
  return null
}
