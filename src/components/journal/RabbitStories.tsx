import Image from 'next/image'
import SectionHead from '@/components/brand/SectionHead'

const STORIES = [
  {
    name: 'KHANYA',
    city: 'CAPE TOWN',
    image: '/assets/ig-01.png',
    quote: '"Rouge feels local. But when I wear them, it feels global."',
  },
  {
    name: 'SIPHO',
    city: 'SOWETO',
    image: '/assets/ig-02.png',
    quote: '"First pair. Then another. Then another. At this point it\'s a problem."',
  },
  {
    name: 'AYANDA',
    city: 'DURBAN',
    image: '/assets/ig-03.png',
    quote: 'People ask what brand they are. That\'s when the conversation starts.',
  },
]

export default function RabbitStories() {
  return (
    <section style={{ borderBottom: '1px solid #3A3A3C' }}>
      <div style={{ padding: '60px 40px 0' }}>
        <SectionHead
          index="01"
          kicker="COMMUNITY · VOICES"
          title="RABBIT STORIES"
          action="VIEW ALL STORIES"
          actionHref="/journal/stories"
        />
      </div>

      <div
        className="rr-journal-stories"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid #3A3A3C',
        }}
      >
        {STORIES.map((story, i) => (
          <div
            key={i}
            style={{ borderLeft: i > 0 ? '1px solid #3A3A3C' : undefined }}
          >
            {/* Name + city header */}
            <div
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid #3A3A3C',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                className="rr-mono"
                style={{ fontSize: 11, letterSpacing: '0.2em', color: '#E6E6E6' }}
              >
                {story.name}
              </span>
              <span
                className="rr-mono"
                style={{ fontSize: 10, letterSpacing: '0.16em', color: '#A6A6A8' }}
              >
                · {story.city}
              </span>
            </div>

            {/* Portrait photo */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 5',
                background: '#1E1E20',
                overflow: 'hidden',
              }}
            >
              <Image
                src={story.image}
                alt={`${story.name} from ${story.city}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Quote */}
            <div style={{ padding: '24px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  lineHeight: 1.75,
                  color: '#A6A6A8',
                  margin: 0,
                }}
              >
                {story.quote}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
