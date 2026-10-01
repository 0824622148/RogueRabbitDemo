/** Fabric weight shown next to every T-shirt. */
export const TEE_WEIGHT_LABEL = '300 GSM'

/** T-shirts are named "… TEE" (card names add " · COLOURWAY" after it). */
export function isTee(name: string): boolean {
  return /\bTEE\b/i.test(name)
}
