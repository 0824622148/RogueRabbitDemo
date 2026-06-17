import type { Metadata } from 'next'
import DroppingSoon from '@/components/brand/DroppingSoon'

export const metadata: Metadata = {
  title: 'Accessories — Rouge Rabbit',
  description: 'Rouge Rabbit accessories dropping soon.',
}

export default function AccessoriesPage() {
  return <DroppingSoon title="Accessories" eyebrow="Rouge Rabbit · Accessories" />
}
