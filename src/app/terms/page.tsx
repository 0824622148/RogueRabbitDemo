import type { Metadata } from 'next'
import Link from 'next/link'
import PolicyLayout from '@/components/brand/PolicyLayout'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Rouge Rabbit',
  description: 'Terms and Conditions governing your use of the Rouge Rabbit website and purchase of products.',
}

const S = {
  h2: { fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '0.01em', textTransform: 'uppercase' as const, color: '#E6E6E6', margin: '48px 0 16px', borderBottom: '1px solid #3A3A3C', paddingBottom: 10 },
  h3: { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#E6E6E6', margin: '28px 0 10px' },
  p:  { margin: '0 0 14px' },
  ul: { margin: '0 0 14px', paddingLeft: 24, display: 'flex', flexDirection: 'column' as const, gap: 6 },
  a:  { color: '#D90017', textDecoration: 'none' },
}

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="June 2026">

      <p style={S.p}>
        Welcome to Rouge Rabbit. These Terms &amp; Conditions govern your use of our website
        and the purchase of products from Rouge Rabbit.
      </p>
      <p style={S.p}>
        By accessing our website or placing an order, you agree to be bound by these Terms &amp;
        Conditions.
      </p>
      <p style={S.p}>
        If you do not agree with any part of these Terms &amp; Conditions, please do not use
        our website.
      </p>

      <h2 style={S.h2}>1. About Rouge Rabbit</h2>
      <p style={S.p}>Rouge Rabbit is a South African fashion and footwear brand.</p>
      <p style={S.p}>
        These Terms &amp; Conditions apply to all visitors, customers, and users of our website.
      </p>

      <h2 style={S.h2}>2. Eligibility</h2>
      <p style={S.p}>By using this website, you confirm that:</p>
      <ul style={S.ul}>
        <li>You are at least 18 years old or have permission from a parent or legal guardian.</li>
        <li>You are legally capable of entering into binding agreements.</li>
        <li>The information you provide is accurate and complete.</li>
      </ul>

      <h2 style={S.h2}>3. Products</h2>
      <p style={S.p}>We strive to display our products as accurately as possible. However:</p>
      <ul style={S.ul}>
        <li>Product colours may vary depending on screen settings.</li>
        <li>Minor manufacturing variations may occur.</li>
        <li>Product images are for illustrative purposes and may differ slightly from the final product.</li>
      </ul>
      <p style={S.p}>
        Rouge Rabbit reserves the right to discontinue or modify products at any time without
        prior notice.
      </p>

      <h2 style={S.h2}>4. Pricing</h2>
      <p style={S.p}>All prices displayed on our website are in South African Rand (ZAR).</p>
      <p style={S.p}>Rouge Rabbit reserves the right to:</p>
      <ul style={S.ul}>
        <li>Change prices without notice.</li>
        <li>Correct pricing errors.</li>
        <li>Cancel orders affected by pricing mistakes.</li>
      </ul>
      <p style={S.p}>
        If an order is cancelled due to a pricing error, customers will receive a full refund.
      </p>

      <h2 style={S.h2}>5. Orders</h2>
      <p style={S.p}>All orders are subject to acceptance and product availability.</p>
      <p style={S.p}>Rouge Rabbit reserves the right to:</p>
      <ul style={S.ul}>
        <li>Refuse any order.</li>
        <li>Limit quantities purchased.</li>
        <li>Cancel orders suspected of fraud or unauthorized activity.</li>
      </ul>
      <p style={S.p}>Order confirmation does not guarantee acceptance of an order.</p>

      <h2 style={S.h2}>6. Pre-Orders</h2>
      <p style={S.p}>Certain products may be offered on a pre-order basis.</p>
      <p style={S.p}>By placing a pre-order, customers acknowledge that:</p>
      <ul style={S.ul}>
        <li>Manufacturing begins after the pre-order campaign closes.</li>
        <li>Production timelines are estimates.</li>
        <li>Delivery dates are not guaranteed.</li>
        <li>Pre-orders are subject to the Rouge Rabbit Pre-Order Policy.</li>
      </ul>
      <p style={S.p}>
        Customers are encouraged to review the{' '}
        <Link href="/preorder-policy" style={S.a}>Pre-Order Policy</Link> before completing
        their purchase.
      </p>

      <h2 style={S.h2}>7. Payment</h2>
      <p style={S.p}>Payment must be received in full before an order is processed.</p>
      <p style={S.p}>
        Rouge Rabbit accepts approved payment methods available at checkout.
      </p>
      <p style={S.p}>
        We reserve the right to cancel orders where payment cannot be verified.
      </p>

      <h2 style={S.h2}>8. Shipping</h2>
      <p style={S.p}>Rouge Rabbit currently ships exclusively within South Africa.</p>
      <p style={S.p}>
        Shipping times provided on the website are estimates only and may vary due to
        circumstances beyond our control.
      </p>
      <p style={S.p}>
        Customers are responsible for ensuring that delivery information is accurate.
      </p>

      <h2 style={S.h2}>9. Returns and Refunds</h2>
      <p style={S.p}>
        Returns, exchanges, and refunds are governed by the{' '}
        <Link href="/shipping-returns" style={S.a}>Rouge Rabbit Shipping &amp; Returns Policy</Link>.
      </p>
      <p style={S.p}>
        By placing an order, customers agree to the terms outlined in that policy.
      </p>

      <h2 style={S.h2}>10. Intellectual Property</h2>
      <p style={S.p}>
        All content on the Rouge Rabbit website is owned by or licensed to Rouge Rabbit.
        This includes:
      </p>
      <ul style={S.ul}>
        {['Logos', 'Trademarks', 'Product designs', 'Artwork', 'Graphics', 'Images', 'Videos', 'Text', 'Branding elements', 'Website content'].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>
        The Rouge Rabbit name, logo, rabbit emblem, RR branding, slogans, and associated
        designs are protected intellectual property.
      </p>
      <p style={S.p}>
        No content may be copied, reproduced, modified, distributed, sold, or used without
        prior written permission from Rouge Rabbit.
      </p>

      <h2 style={S.h2}>11. User Conduct</h2>
      <p style={S.p}>Users agree not to:</p>
      <ul style={S.ul}>
        <li>Use the website for unlawful purposes.</li>
        <li>Attempt unauthorized access to website systems.</li>
        <li>Upload harmful software or malicious code.</li>
        <li>Interfere with website functionality.</li>
        <li>Violate the rights of Rouge Rabbit or other users.</li>
      </ul>
      <p style={S.p}>
        Rouge Rabbit reserves the right to restrict access to users who violate these Terms.
      </p>

      <h2 style={S.h2}>12. Limitation of Liability</h2>
      <p style={S.p}>
        To the maximum extent permitted by South African law, Rouge Rabbit shall not be
        liable for:
      </p>
      <ul style={S.ul}>
        {['Indirect damages', 'Consequential damages', 'Loss of profits', 'Loss of data', 'Business interruption', 'Delays caused by third parties'].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>
        Rouge Rabbit&apos;s total liability shall not exceed the amount paid by the customer
        for the relevant product or service.
      </p>

      <h2 style={S.h2}>13. Force Majeure</h2>
      <p style={S.p}>
        Rouge Rabbit shall not be held responsible for delays or failure to perform obligations
        caused by circumstances beyond reasonable control, including:
      </p>
      <ul style={S.ul}>
        {['Natural disasters', 'Power outages', 'Strikes', 'Manufacturing disruptions', 'Transportation delays', 'Government actions', 'Pandemics'].map(i => <li key={i}>{i}</li>)}
      </ul>

      <h2 style={S.h2}>14. Privacy</h2>
      <p style={S.p}>
        Your use of our website is also governed by our{' '}
        <Link href="/privacy" style={S.a}>Privacy Policy</Link>.
      </p>
      <p style={S.p}>
        By using our website, you consent to the collection and use of information as described
        in that policy.
      </p>

      <h2 style={S.h2}>15. Governing Law</h2>
      <p style={S.p}>
        These Terms &amp; Conditions shall be governed by and interpreted in accordance with
        the laws of the Republic of South Africa.
      </p>
      <p style={S.p}>
        Any disputes arising from these Terms shall be subject to the jurisdiction of South
        African courts.
      </p>

      <h2 style={S.h2}>16. Changes to These Terms</h2>
      <p style={S.p}>
        Rouge Rabbit reserves the right to update or modify these Terms &amp; Conditions at
        any time.
      </p>
      <p style={S.p}>
        Updated versions will be published on the website with a revised effective date.
      </p>
      <p style={S.p}>
        Continued use of the website constitutes acceptance of any changes.
      </p>

      <div style={{ marginTop: 56, padding: '32px', background: '#1E1E20', border: '1px solid #3A3A3C' }}>
        <p style={{ ...S.p, fontWeight: 600, color: '#E6E6E6', marginBottom: 8 }}>Contact Us</p>
        <p style={S.p}>
          For questions regarding these Terms &amp; Conditions, please contact:
        </p>
        <p style={{ ...S.p, margin: 0 }}>
          <strong style={{ color: '#E6E6E6' }}>Rouge Rabbit Customer Support</strong><br />
          <a href="mailto:support@rougerabbit.co.za" style={S.a}>support@rougerabbit.co.za</a>
        </p>
      </div>

    </PolicyLayout>
  )
}
