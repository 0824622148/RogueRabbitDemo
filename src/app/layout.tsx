import type { Metadata } from 'next'
import { Bebas_Neue, Montserrat, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import WhatsAppWidget from '@/components/brand/WhatsAppWidget'
import { WishlistProvider } from '@/context/WishlistContext'
import WishlistDrawer from '@/components/wishlist/WishlistDrawer'
import WishlistEmailModal from '@/components/wishlist/WishlistEmailModal'

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        <WishlistProvider>
          {children}
          <WishlistDrawer />
          <WishlistEmailModal />
          <WhatsAppWidget />
        </WishlistProvider>
      </body>
    </html>
  )
}
