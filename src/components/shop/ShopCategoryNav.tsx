import Link from 'next/link'
import { SNEAKER_ORDERS_ON_HOLD } from '@/lib/store-status'

const CATEGORIES = [
  { label: 'ALL ITEMS', href: '/shop' },
  { label: 'TOPS', href: '/shop/tops' },
  { label: 'ACCESSORIES', href: '/shop/accessories' },
  { label: 'FOOTWEAR', href: '/shop/footwear', soon: SNEAKER_ORDERS_ON_HOLD },
]

/** Category pills under the catalog header — mirrors the SHOP dropdown. */
export default function ShopCategoryNav({ active }: { active: string }) {
  return (
    <nav
      className="rr-filterbar"
      aria-label="Shop categories"
      style={{ borderBottom: '1px solid #3A3A3C', padding: '18px 40px', gap: 10, flexWrap: 'wrap' }}
    >
      {CATEGORIES.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          aria-current={active === c.href ? 'page' : undefined}
          className={`rr-pill ${active === c.href ? 'rr-pill--active' : ''}`}
          style={{ textDecoration: 'none' }}
        >
          {c.label}
          {c.soon && <span style={{ color: '#D90017' }}>· DROPPING SOON</span>}
        </Link>
      ))}
    </nav>
  )
}
