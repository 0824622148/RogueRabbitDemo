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
  // Signal and Beauty in Contrast go up to 3XL; Bagged League stops at XL.
  { size: '2XL', chest: 68, length: 78 },
  { size: '3XL', chest: 71, length: 80 },
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

// Frequency short set (Track Sets) — from the manufacturer's grading chart (client, 23 Nov 2026;
// public/assets/drops/rouge-track/size-chart.jpg). L is the approved sample,
// the rest are graded from it. Rows the chart marks unconfirmed (cap height,
// brim width, cuff length) are left out.
export interface SetSizeRow {
  size: string
  top: { bust: number; length: number; sleeve: number }
  shorts: { waist: number; hip: number; inseam: number }
}

export const SET_SIZES: SetSizeRow[] = [
  { size: 'S',   top: { bust: 55, length: 63, sleeve: 22.5 }, shorts: { waist: 36, hip: 52.5, inseam: 20 } },
  { size: 'M',   top: { bust: 57, length: 65, sleeve: 23 },   shorts: { waist: 38, hip: 54.5, inseam: 22 } },
  { size: 'L',   top: { bust: 59, length: 67, sleeve: 23.5 }, shorts: { waist: 40, hip: 56.5, inseam: 24 } },
  { size: 'XL',  top: { bust: 61, length: 69, sleeve: 24 },   shorts: { waist: 42, hip: 58.5, inseam: 26 } },
  { size: '2XL', top: { bust: 63, length: 71, sleeve: 24.5 }, shorts: { waist: 44, hip: 60.5, inseam: 28 } },
  { size: '3XL', top: { bust: 65, length: 73, sleeve: 25 },   shorts: { waist: 46, hip: 62.5, inseam: 30 } },
  { size: '4XL', top: { bust: 67, length: 75, sleeve: 25.5 }, shorts: { waist: 48, hip: 64.5, inseam: 32 } },
]

export const SET_FIT_NOTE =
  'Unisex, relaxed and slightly oversized. Top and shorts come in the same size. Take your usual size, or size down for a closer fit.'

export const SET_MEASURE_TIPS = [
  'Half bust and half waist / hip are measured flat across, so double them for the full measurement.',
  'Front length runs from the high point of the shoulder to the hem. Inseam runs from the crotch seam to the leg opening.',
  'Measurements are approximate and can vary by 1–2 cm.',
]

export const SET_CHART_IMAGE = '/assets/drops/rouge-track/size-chart.jpg'

export type ApparelKind = 'tee' | 'cap' | 'set' | null

export function apparelKind(product: { name: string; category?: string | null }): ApparelKind {
  if (isTee(product.name)) return 'tee'
  if (/\bCAP\b/i.test(product.name)) return 'cap'
  if (String(product.category ?? '').toUpperCase() === 'TRACK SETS' || /\bTRACK SET\b/i.test(product.name)) return 'set'
  return null
}

/**
 * Description paragraph and spec lines for the product page. `sizes` is the
 * product's own size run (e.g. ['S', …, '3XL']) — ranges differ between drops.
 */
export function productDetails(
  kind: ApparelKind,
  sizes: string[] = [],
): { description: string; specs: string[] } | null {
  if (kind === 'tee') {
    return {
      description:
        'Heavyweight cotton with a touch of stretch, cut oversized with dropped shoulders ' +
        'for a relaxed, structured silhouette. Built to hold its shape, wash after wash.',
      specs: [
        `${TEE_WEIGHT_LABEL} heavyweight fabric`,
        '95% cotton / 5% elastane',
        'Oversized fit · dropped shoulders',
        'Relaxed, structured silhouette',
        'Ribbed crew neckline',
        'Soft-touch finish',
        'Front ROUGE RABBIT branding · statement back artwork',
        sizes.length > 1 ? `Unisex · sizes ${sizes[0]} – ${sizes[sizes.length - 1]}` : 'Unisex',
        'Wash cold, inside out · do not tumble dry · do not iron the print',
      ],
    }
  }
  if (kind === 'set') {
    // Built from the client's packshots (19 Nov 2026). Add fabric and care
    // details once the team confirms them.
    return {
      description:
        'Two-piece Frequency short set in yellow, royal blue and red. A short-sleeve hooded half-zip ' +
        'with a front pouch pocket, and matching cargo shorts. Move different.',
      specs: [
        'Set of two: hooded half-zip top + cargo shorts',
        'Top: short sleeves, half-zip, adjustable toggle hood and hem',
        'Top: front pouch pocket · "MOVE DIFFERENT." front · "SAME DESTINATION. DIFFERENT ROUTES." back',
        'Shorts: elastic drawstring waist, two cargo pockets (snap and buckle-strap)',
        'RR monogram on top and shorts',
        'Unisex · relaxed, oversized fit',
        sizes.length > 1 ? `Sizes ${sizes[0]} – ${sizes[sizes.length - 1]} · top and shorts in the same size` : 'Sold as a set',
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
