import { SNEAKER_ORDERS_ON_HOLD } from '@/lib/store-status'
import type { NavItem } from '@/types'

/**
 * The site menu: FEATURED · SHOP · DROPS · JOURNAL.
 * FEATURED and DROPS come from the collections table (getNavMenu); SHOP and
 * JOURNAL are fixed. Shared by NavBar (desktop dropdowns + mobile accordion).
 */
export function buildMenu({ featured, drops }: { featured: NavItem[]; drops: NavItem[] }): NavItem[] {
  return [
    { label: 'FEATURED', href: featured[0]?.href ?? '/drops', image: featured[0]?.image, children: featured },
    {
      label: 'SHOP',
      href: '/shop',
      children: [
        { label: 'ALL ITEMS', href: '/shop' },
        { label: 'TOPS', href: '/shop/tops' },
        { label: 'ACCESSORIES', href: '/shop/accessories' },
        { label: 'FOOTWEAR', href: '/shop/footwear', tag: SNEAKER_ORDERS_ON_HOLD ? 'DROPPING SOON' : undefined },
      ],
    },
    { label: 'DROPS', href: '/drops', children: drops },
    {
      label: 'JOURNAL',
      href: '/journal',
      children: [
        { label: 'THE RABBIT RUN', href: '/journal' },
        { label: 'INFLUENCERS', href: '/influencers' },
      ],
    },
  ]
}

/** Every href in an item's subtree — used for the active underline. */
export function hrefsOf(item: NavItem): string[] {
  return [item.href, ...(item.children ?? []).flatMap(hrefsOf)]
}
