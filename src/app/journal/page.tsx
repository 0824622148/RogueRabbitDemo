import type { Metadata } from 'next'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import JournalHero from '@/components/journal/JournalHero'
import StatsBar from '@/components/journal/StatsBar'
import CommunityPulse from '@/components/journal/CommunityPulse'
import RabbitCode from '@/components/journal/RabbitCode'
import RabbitStories from '@/components/journal/RabbitStories'
import TheWall from '@/components/journal/TheWall'
import JournalCTA from '@/components/journal/JournalCTA'

export const metadata: Metadata = {
  title: 'The Rabbit Run — Rouge Rabbit Journal',
  description:
    'The stories, voices and culture behind Rouge Rabbit. Built in South Africa. Worn everywhere.',
}

export default function JournalPage() {
  return (
    <div
      style={{
        background: '#0F0F10',
        color: '#E6E6E6',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <NavBar />
      <main style={{ flex: 1 }}>
        <JournalHero />
        <StatsBar />
        <CommunityPulse />
        <RabbitCode />
        <RabbitStories />
        <TheWall />
        <JournalCTA />
      </main>
      <Footer />
    </div>
  )
}
