import type { Metadata } from 'next'
import DroppingSoon from '@/components/brand/DroppingSoon'

export const metadata: Metadata = {
  title: 'Lookbook — Rouge Rabbit',
  description: 'The Rouge Rabbit lookbook — coming soon.',
}

export default function LookbookPage() {
  return <DroppingSoon title="Lookbook" eyebrow="Rouge Rabbit · Lookbook" />
}
