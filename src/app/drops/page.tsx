import type { Metadata } from 'next'
import DroppingSoon from '@/components/brand/DroppingSoon'

export const metadata: Metadata = {
  title: 'Drops Calendar — Rouge Rabbit',
  description: 'See what Rouge Rabbit is dropping next.',
}

export default function DropsPage() {
  return <DroppingSoon title="Drops" eyebrow="Rouge Rabbit · Drops Calendar" />
}
