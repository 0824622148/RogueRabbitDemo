'use client'

import { createContext, useContext } from 'react'
import { buildMenu } from '@/lib/nav'
import type { NavItem } from '@/types'

// The menu is fetched once in the root layout (server) and handed down here, so
// NavBar stays a client component that every page — including client pages like
// /sizing-guide — can render without passing props.
const NavMenuContext = createContext<NavItem[]>(buildMenu({ featured: [], drops: [] }))

export function useNavMenu() {
  return useContext(NavMenuContext)
}

export function NavMenuProvider({ menu, children }: { menu: NavItem[]; children: React.ReactNode }) {
  return <NavMenuContext.Provider value={menu}>{children}</NavMenuContext.Provider>
}
