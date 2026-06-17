import type { Metadata } from 'next'
import DroppingSoon from '@/components/brand/DroppingSoon'

export const metadata: Metadata = {
  title: 'Stockists — Rouge Rabbit',
  description: 'Find Rouge Rabbit near you — stockists coming soon.',
}

export default function StockistsPage() {
  return <DroppingSoon title="Stockists" eyebrow="Rouge Rabbit · Stockists" />
}
