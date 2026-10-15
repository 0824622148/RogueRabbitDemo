'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSubscribeModal } from '@/context/SubscribeContext'

interface Props {
  /** "BEAUTY IN CONTRAST + SIGNAL" */
  names: string
  /** "FRI 23 OCT" */
  date: string
  /** The drop's teaser page, or /drops when several land together. */
  href: string
}

// Kept out of purchase / admin flows, same as the welcome popup.
const HIDDEN_PATHS = ['/admin', '/checkout', '/preorder', '/unsubscribe']

/** Thin red strip above the nav announcing the next dated drop. */
export default function DropBanner({ names, date, href }: Props) {
  const pathname = usePathname()
  const { openSubscribe } = useSubscribeModal()
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null

  return (
    <div className="rr-drop-banner" role="region" aria-label="Next drop">
      <Link href={href} className="rr-drop-banner-text">
        <span className="rr-drop-banner-names">{names} · </span>
        DROPPING {date}
      </Link>
      <button type="button" onClick={() => openSubscribe('banner')} className="rr-drop-banner-cta">
        <span className="rr-drop-banner-long">GET 48H EARLY ACCESS →</span>
        <span className="rr-drop-banner-short">JOIN →</span>
      </button>
    </div>
  )
}
