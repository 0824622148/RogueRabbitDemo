import type { Metadata } from 'next'
import DroppingSoon from '@/components/brand/DroppingSoon'

export const metadata: Metadata = {
  title: 'Journal — Rouge Rabbit',
  description: 'The Rouge Rabbit journal — coming soon.',
}

export default function JournalPage() {
  return <DroppingSoon title="Journal" eyebrow="Rouge Rabbit · Journal" />
}
