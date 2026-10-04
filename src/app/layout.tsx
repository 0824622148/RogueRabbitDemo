import type { Metadata } from 'next'
import { Bebas_Neue, Montserrat, JetBrains_Mono } from 'next/font/google'
import './globals.css'
// WhatsApp chat button temporarily hidden while the team sets up their official
// WhatsApp Business number. To restore: re-add this import and <WhatsAppWidget /> below.
// import WhatsAppWidget from '@/components/brand/WhatsAppWidget'
import { WishlistProvider } from '@/context/WishlistContext'
import WishlistDrawer from '@/components/wishlist/WishlistDrawer'
import WishlistEmailModal from '@/components/wishlist/WishlistEmailModal'
import { SubscribeProvider } from '@/context/SubscribeContext'
import SubscribeModal from '@/components/brand/SubscribeModal'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/shop/CartDrawer'
import { NavMenuProvider } from '@/context/NavMenuContext'
import { getNavMenu } from '@/lib/queries/collections'
import { buildMenu } from '@/lib/nav'

// The menu (FEATURED / DROPS) is read from the collections table. Pages without
// their own shorter revalidate pick up collection changes within 5 minutes.
export const revalidate = 300

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://rougerabbit.co.za'),
  title: 'Rouge Rabbit — Built Different.',
  description: 'Modern streetwear for the youth who refuse to blend in. Shop the Rouge 01 silhouette and latest drops.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const menu = buildMenu(await getNavMenu())

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${montserrat.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="antialiased"
        style={{
          fontFamily: 'var(--font-body)',
          background: '#0F0F10',
          color: '#E6E6E6',
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'optimizeLegibility',
        }}
      >
        <NavMenuProvider menu={menu}>
          <SubscribeProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <WishlistDrawer />
                <CartDrawer />
                <WishlistEmailModal />
                <SubscribeModal />
              </CartProvider>
            </WishlistProvider>
          </SubscribeProvider>
        </NavMenuProvider>
      </body>
    </html>
  )
}
