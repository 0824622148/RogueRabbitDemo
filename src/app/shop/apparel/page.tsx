import type { Metadata } from 'next'
import DroppingSoon from '@/components/brand/DroppingSoon'

export const metadata: Metadata = {
  title: 'Apparel — Rouge Rabbit',
  description: 'Rouge Rabbit apparel dropping soon.',
}

export default function ApparelPage() {
  return <DroppingSoon title="Apparel" eyebrow="Rouge Rabbit · Apparel" />
}
