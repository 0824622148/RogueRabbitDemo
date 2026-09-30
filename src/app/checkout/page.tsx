import type { Metadata } from 'next'
import NavBar from '@/components/brand/NavBar'
import Footer from '@/components/brand/Footer'
import CheckoutForm from '@/components/checkout/CheckoutForm'

export const metadata: Metadata = {
  title: 'Checkout — Rouge Rabbit',
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <div style={{ background: '#0F0F10', color: '#E6E6E6', fontFamily: 'var(--font-body)' }}>
      <NavBar />
      <CheckoutForm />
      <Footer />
    </div>
  )
}
