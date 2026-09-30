import type { Metadata } from 'next'
import CategoryPage from '@/components/shop/CategoryPage'

export const metadata: Metadata = {
  title: 'Footwear — Rouge Rabbit',
  description: 'The Rouge 01 sneaker — five colourways, one silhouette. Coming soon.',
}

export const revalidate = 60

export default function FootwearPage() {
  return (
    <CategoryPage
      category="FOOTWEAR"
      title="Footwear"
      blurb="The Rouge 01 — five colourways, one silhouette. Built for the ones who move without permission. Pre-orders open soon."
      status={{ n: 'SOON', l: 'PRE-ORDER · COMING SOON' }}
      footnote="ROUGE 01 · COMING SOON · SUBSCRIBE FOR FIRST ACCESS"
    />
  )
}
