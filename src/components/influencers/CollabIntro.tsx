import SectionHead from '@/components/brand/SectionHead'

export default function CollabIntro() {
  return (
    <section id="collabs" style={{ borderBottom: '1px solid #3A3A3C' }}>
      <div style={{ padding: '60px 40px 0' }}>
        <SectionHead index="00" kicker="THE PROGRAM · SNEAK PEEK" title="WHAT'S COOKING" />
      </div>

      <div
        style={{
          padding: '0 40px 60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 40,
          maxWidth: 1100,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            lineHeight: 1.8,
            color: '#E6E6E6',
            margin: 0,
          }}
        >
          We&apos;re teaming up with a handful of creators who live the Rouge
          Rabbit code — not as adverts, but as ambassadors. Each collab is being
          built right now: the fits, the photos, and a short testimonial film
          shot in their own city.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            lineHeight: 1.85,
            color: '#A6A6A8',
            margin: 0,
          }}
        >
          Below is an early look at who&apos;s involved. The testimonial videos
          land on our YouTube and link straight back here as each one goes live.
          Bookmark the page — the rabbit run is just getting started.
        </p>
      </div>
    </section>
  )
}
