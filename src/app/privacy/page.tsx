import type { Metadata } from 'next'
import PolicyLayout from '@/components/brand/PolicyLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy — Rouge Rabbit',
  description: 'How Rouge Rabbit collects, uses, and protects your personal information.',
}

const S = {
  h2: { fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '0.01em', textTransform: 'uppercase' as const, color: '#E6E6E6', margin: '48px 0 16px', borderBottom: '1px solid #3A3A3C', paddingBottom: 10 },
  h3: { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#E6E6E6', margin: '28px 0 10px' },
  p:  { margin: '0 0 14px' },
  ul: { margin: '0 0 14px', paddingLeft: 24, display: 'flex', flexDirection: 'column' as const, gap: 6 },
  a:  { color: '#D90017', textDecoration: 'none' },
}

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="June 2026">

      <p style={S.p}>
        At Rouge Rabbit, we respect your privacy and are committed to protecting your personal
        information. This Privacy Policy explains how we collect, use, store, and protect your
        information when you visit our website, place an order, sign up for our communications,
        or interact with our brand.
      </p>
      <p style={S.p}>
        By using our website, you agree to the collection and use of information in accordance
        with this Privacy Policy.
      </p>

      <h2 style={S.h2}>1. Who We Are</h2>
      <p style={S.p}>Rouge Rabbit is a South African fashion and footwear brand.</p>
      <p style={S.p}>
        If you have any questions regarding this Privacy Policy, please contact us at:{' '}
        <a href="mailto:support@rougerabbit.co.za" style={S.a}>support@rougerabbit.co.za</a>
      </p>

      <h2 style={S.h2}>2. Information We Collect</h2>
      <p style={S.p}>We may collect the following information:</p>

      <h3 style={S.h3}>Personal Information</h3>
      <ul style={S.ul}>
        {['Full name', 'Email address', 'Mobile phone number', 'Billing address', 'Shipping address', 'Payment information', 'Order history'].map(i => <li key={i}>{i}</li>)}
      </ul>

      <h3 style={S.h3}>Technical Information</h3>
      <ul style={S.ul}>
        {['IP address', 'Browser type', 'Device information', 'Website usage data', 'Cookies and similar technologies'].map(i => <li key={i}>{i}</li>)}
      </ul>

      <h3 style={S.h3}>Marketing Information</h3>
      <ul style={S.ul}>
        {['Newsletter subscriptions', 'Marketing preferences', 'Responses to surveys, promotions, or competitions'].map(i => <li key={i}>{i}</li>)}
      </ul>

      <h2 style={S.h2}>3. How We Use Your Information</h2>
      <p style={S.p}>We use your information to:</p>
      <ul style={S.ul}>
        {[
          'Process and fulfill orders',
          'Deliver products and services',
          'Provide customer support',
          'Verify transactions and prevent fraud',
          'Send order confirmations and shipping updates',
          'Improve our website and customer experience',
          'Send promotional communications where permitted',
          'Comply with legal obligations',
        ].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>We only collect information that is necessary for legitimate business purposes.</p>

      <h2 style={S.h2}>4. Payment Information</h2>
      <p style={S.p}>Rouge Rabbit does not store your full payment card information.</p>
      <p style={S.p}>
        Payments are processed securely through trusted third-party payment providers that
        comply with industry security standards.
      </p>

      <h2 style={S.h2}>5. Marketing Communications</h2>
      <p style={S.p}>With your consent, we may send:</p>
      <ul style={S.ul}>
        {['Product launch announcements', 'Exclusive offers', 'Pre-order updates', 'Brand news and events'].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>
        You may unsubscribe from marketing communications at any time by clicking the
        unsubscribe link in our emails or contacting us directly.
      </p>

      <h2 style={S.h2}>6. Cookies</h2>
      <p style={S.p}>Our website may use cookies and similar technologies to:</p>
      <ul style={S.ul}>
        {['Improve website performance', 'Remember user preferences', 'Analyze website traffic', 'Enhance customer experience'].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>
        You can disable cookies through your browser settings, although some website features
        may not function properly.
      </p>

      <h2 style={S.h2}>7. Sharing Your Information</h2>
      <p style={S.p}>Rouge Rabbit does not sell, rent, or trade your personal information.</p>
      <p style={S.p}>We may share information with trusted service providers, including:</p>
      <ul style={S.ul}>
        {['Payment processors', 'Courier and delivery partners', 'Website hosting providers', 'Marketing and analytics platforms', 'Professional advisors where legally required'].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>
        All third parties are required to handle personal information securely and in accordance
        with applicable laws.
      </p>

      <h2 style={S.h2}>8. Data Security</h2>
      <p style={S.p}>
        We take reasonable technical and organizational measures to protect your personal
        information against:
      </p>
      <ul style={S.ul}>
        {['Unauthorized access', 'Loss', 'Misuse', 'Alteration', 'Disclosure'].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>
        While we strive to protect your information, no internet transmission or electronic
        storage system can be guaranteed to be 100% secure.
      </p>

      <h2 style={S.h2}>9. Your Rights</h2>
      <p style={S.p}>
        In accordance with South African privacy laws, including POPIA, you may have the right to:
      </p>
      <ul style={S.ul}>
        {[
          'Access your personal information',
          'Correct inaccurate information',
          'Request deletion of your information where legally permissible',
          'Withdraw consent for marketing communications',
          'Object to certain processing activities',
        ].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>
        To exercise these rights, please contact us at{' '}
        <a href="mailto:support@rougerabbit.co.za" style={S.a}>support@rougerabbit.co.za</a>.
      </p>

      <h2 style={S.h2}>10. Data Retention</h2>
      <p style={S.p}>We retain personal information only for as long as necessary to:</p>
      <ul style={S.ul}>
        {['Fulfill orders', 'Meet legal and tax obligations', 'Resolve disputes', 'Enforce our agreements'].map(i => <li key={i}>{i}</li>)}
      </ul>
      <p style={S.p}>
        When information is no longer required, it will be securely deleted or anonymized.
      </p>

      <h2 style={S.h2}>11. Third-Party Links</h2>
      <p style={S.p}>
        Our website may contain links to third-party websites. Rouge Rabbit is not responsible
        for the privacy practices or content of those websites.
      </p>
      <p style={S.p}>
        We encourage users to review the privacy policies of any external sites they visit.
      </p>

      <h2 style={S.h2}>12. Children&apos;s Privacy</h2>
      <p style={S.p}>
        Rouge Rabbit does not knowingly collect personal information from individuals under
        the age of 18 without parental or guardian consent.
      </p>
      <p style={S.p}>
        If we become aware that personal information has been collected from a minor without
        appropriate consent, we will take reasonable steps to remove that information.
      </p>

      <h2 style={S.h2}>13. Changes to This Privacy Policy</h2>
      <p style={S.p}>Rouge Rabbit reserves the right to update this Privacy Policy at any time.</p>
      <p style={S.p}>Any changes will be posted on this page with an updated revision date.</p>
      <p style={S.p}>
        Continued use of the website after changes are published constitutes acceptance of the
        revised Privacy Policy.
      </p>

      <div style={{ marginTop: 56, padding: '32px', background: '#1E1E20', border: '1px solid #3A3A3C' }}>
        <p style={{ ...S.p, fontWeight: 600, color: '#E6E6E6', marginBottom: 8 }}>Contact Us</p>
        <p style={S.p}>For privacy-related questions or requests, please contact:</p>
        <p style={{ ...S.p, margin: 0 }}>
          <strong style={{ color: '#E6E6E6' }}>Rouge Rabbit Customer Support</strong><br />
          <a href="mailto:support@rougerabbit.co.za" style={S.a}>support@rougerabbit.co.za</a>
        </p>
      </div>

    </PolicyLayout>
  )
}
