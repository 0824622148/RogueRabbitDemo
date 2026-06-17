import type { Metadata } from 'next'
import DroppingSoon from '@/components/brand/DroppingSoon'

export const metadata: Metadata = {
  title: 'Sale — Rouge Rabbit',
  description: 'Rouge Rabbit sale dropping soon.',
}

export default function SalePage() {
  return <DroppingSoon title="Sale" eyebrow="Rouge Rabbit · Sale" />
}
