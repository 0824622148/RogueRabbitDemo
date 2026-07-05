import type { Metadata } from 'next'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import InfluencersHero from '@/components/influencers/InfluencersHero'
import CollabIntro from '@/components/influencers/CollabIntro'
import CollabSection from '@/components/influencers/CollabSection'
import InfluencersCTA from '@/components/influencers/InfluencersCTA'
import { COLLABS } from '@/components/influencers/collabs'

export const metadata: Metadata = {
  title: 'Influencers — Rouge Rabbit',
  description:
    'Meet the Rouge Rabbit collective — the creators and ambassadors behind the movement. Testimonials dropping soon.',
}

export default function InfluencersPage() {
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
        <InfluencersHero />
        <CollabIntro />
        {COLLABS.map((collab, i) => (
          <CollabSection key={collab.id} collab={collab} index={i} />
        ))}
        <InfluencersCTA />
      </main>
      <Footer />
    </div>
  )
}
