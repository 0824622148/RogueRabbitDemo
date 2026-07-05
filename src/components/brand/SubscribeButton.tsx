'use client'

import { useSubscribeModal } from '@/context/SubscribeContext'

type Tone = 'onDark' | 'onRed'

interface SubscribeButtonProps {
  label?: string
  /** onRed = sits on the red members panel; onDark = sits on a dark surface. */
  tone?: Tone
  /** Touchpoint tag stored on the member row (e.g. 'homepage', 'footer'). */
  source?: string
}

const TONES: Record<Tone, { bg: string; color: string }> = {
  onDark: { bg: '#D90017', color: '#E6E6E6' },
  onRed: { bg: '#0F0F10', color: '#E6E6E6' },
}

export default function SubscribeButton({ label = 'JOIN', tone = 'onDark', source = 'navbar' }: SubscribeButtonProps) {
  const { openSubscribe } = useSubscribeModal()
  const t = TONES[tone]

  return (
    <button
      onClick={() => openSubscribe(source)}
      style={{
        background: t.bg,
        color: t.color,
        border: 'none',
        padding: '16px 26px',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '.22em',
        cursor: 'pointer',
      }}
    >
      {label} →
    </button>
  )
}
