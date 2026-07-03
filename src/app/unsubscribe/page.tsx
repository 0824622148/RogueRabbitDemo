import Link from 'next/link'

export const dynamic = 'force-dynamic'

const MESSAGES: Record<string, { title: string; body: string; colour: string }> = {
  ok: {
    title: 'YOU’RE UNSUBSCRIBED',
    body: 'You won’t receive marketing emails from Rouge Rabbit anymore. Order and shipping updates will still be sent.',
    colour: '#2A9D2A',
  },
  invalid: {
    title: 'LINK INVALID',
    body: 'This unsubscribe link is invalid or has expired. Reply to any of our emails and we’ll remove you manually.',
    colour: '#D90017',
  },
  error: {
    title: 'SOMETHING WENT WRONG',
    body: 'We couldn’t process your request right now. Please try again shortly or reply to any of our emails.',
    colour: '#D90017',
  },
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const status = typeof params.status === 'string' ? params.status : 'invalid'
  const m = MESSAGES[status] ?? MESSAGES.invalid

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#0F0F10' }}>
      <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
        <div style={{ color: '#D90017', fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '.06em' }}>
          ROUGE RABBIT
        </div>
        <div style={{ display: 'inline-flex', border: `1px solid ${m.colour}`, padding: '8px 16px', margin: '28px 0 20px' }}>
          <span style={{ color: m.colour, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.18em' }}>{m.title}</span>
        </div>
        <p style={{ color: '#A6A6A8', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.8, margin: '0 0 32px' }}>
          {m.body}
        </p>
        <Link href="/" style={{ color: '#E6E6E6', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.18em', textDecoration: 'none', borderBottom: '1px solid #3A3A3C', paddingBottom: 4 }}>
          ← BACK TO STORE
        </Link>
      </div>
    </div>
  )
}
