import type { Metadata } from 'next'
import PolicyLayout from '@/components/brand/PolicyLayout'
import { DELIVERY_FROM } from '@/lib/preorder'

export const metadata: Metadata = {
  title: 'Pre-Order Policy — Rouge Rabbit',
  description: 'Everything you need to know about Rouge Rabbit pre-orders: timelines, cancellations, refunds, and shipping.',
}

const S = {
  h2: { fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '0.01em', textTransform: 'uppercase' as const, color: '#E6E6E6', margin: '48px 0 16px', borderBottom: '1px solid #3A3A3C', paddingBottom: 10 },
  h3: { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#E6E6E6', margin: '28px 0 10px' },
  p:  { margin: '0 0 14px' },
  ul: { margin: '0 0 14px', paddingLeft: 24, display: 'flex', flexDirection: 'column' as const, gap: 6 },
  a:  { color: '#D90017', textDecoration: 'none' },
}

export default function PreorderPolicyPage() {
  return (
    <PolicyLayout title="Pre-Order Policy" lastUpdated="July 2026">

      <p style={S.p}>
        Thank you for supporting Rouge Rabbit. By placing a pre-order, you are securing your
        product before it becomes publicly available. Please read this policy carefully before
        completing your purchase.
      </p>

      <div style={{ padding: '20px 24px', background: '#1E1E20', border: '1px solid #3A3A3C', marginBottom: 32 }}>
        <p style={{ ...S.p, margin: 0, fontSize: 13, color: '#A6A6A8' }}>
          <strong style={{ color: '#E6E6E6' }}>Pre-Order Notice —</strong> Your pair is reserved
          once payment has been successfully completed. Deliveries begin from{' '}
          <strong style={{ color: '#E6E6E6' }}>{DELIVERY_FROM}</strong>. Ahead of dispatch, the
          Rouge Rabbit team will be in touch to confirm your delivery details. Your order will
          then be shipped within South Africa and tracking details will be provided.
        </p>
      </div>

      <h2 style={S.h2}>What Is a Pre-Order?</h2>
      <p style={S.p}>
        A pre-order allows customers to reserve and purchase a product before it is
        manufactured and ready for shipment.
      </p>
      <p style={S.p}>
        By participating in a Rouge Rabbit pre-order campaign, you acknowledge and accept the
        estimated production and delivery timelines outlined below.
      </p>

      <h2 style={S.h2}>Pre-Order Delivery Timeline</h2>
      <p style={S.p}>
        Deliveries for this pre-order begin from{' '}
        <strong style={{ color: '#E6E6E6' }}>{DELIVERY_FROM}</strong>. Placing a pre-order now
        secures your pair ahead of general availability.
      </p>

      <h3 style={S.h3}>Before Dispatch</h3>
      <ul style={S.ul}>
        <li>
          Deliveries are scheduled to begin from{' '}
          <strong style={{ color: '#E6E6E6' }}>{DELIVERY_FROM}</strong>.
        </li>
        <li>
          The Rouge Rabbit team will contact you to confirm your delivery details before your
          order is dispatched.
        </li>
        <li>
          Timelines are estimates and may vary due to stock availability, courier schedules, or
          unforeseen circumstances. We will communicate any significant delays as soon as possible.
        </li>
      </ul>

      <h2 style={S.h2}>Shipping Timeline</h2>
      <p style={S.p}>Once your order is ready for dispatch:</p>
      <ul style={S.ul}>
        <li>Orders will undergo final quality inspection.</li>
        <li>Orders will be packaged and prepared for dispatch.</li>
        <li>Customers will receive a shipping confirmation email with tracking information.</li>
      </ul>

      <h3 style={S.h3}>Estimated Delivery Time — Within South Africa</h3>
      <ul style={S.ul}>
        <li>Major Metropolitan Areas: <strong style={{ color: '#E6E6E6' }}>2–5 Business Days</strong></li>
        <li>Regional Areas: <strong style={{ color: '#E6E6E6' }}>3–7 Business Days</strong></li>
        <li>Remote Areas: <strong style={{ color: '#E6E6E6' }}>5–10 Business Days</strong></li>
      </ul>

      <h2 style={S.h2}>Order Updates</h2>
      <p style={S.p}>
        Customers will receive updates throughout the pre-order process, including:
      </p>
      <ul style={S.ul}>
        <li>Pre-order confirmation</li>
        <li>A personal follow-up from the team to confirm delivery details</li>
        <li>Delivery scheduling updates</li>
        <li>Shipping confirmation and tracking information</li>
      </ul>
      <p style={S.p}>
        Rouge Rabbit believes in transparency and will communicate any significant delays as
        soon as possible.
      </p>

      <h2 style={S.h2}>Cancellations</h2>

      <h3 style={S.h3}>Before Dispatch</h3>
      <p style={S.p}>
        Customers may request cancellation of their pre-order within{' '}
        <strong style={{ color: '#E6E6E6' }}>7 days</strong> of placing their order, provided the
        order has not yet been dispatched.
      </p>

      <h3 style={S.h3}>After Dispatch</h3>
      <p style={S.p}>
        Once your order has been dispatched, it can no longer be cancelled. Returns are handled
        under our standard returns policy.
      </p>

      <h2 style={S.h2}>Refunds</h2>
      <p style={S.p}>Refunds may be issued in the following circumstances:</p>
      <ul style={S.ul}>
        <li>Rouge Rabbit is unable to fulfill the order.</li>
        <li>
          Delivery is delayed significantly beyond the stated timeline without your approval.
        </li>
        <li>The product arrives damaged or defective and cannot be replaced.</li>
      </ul>
      <p style={S.p}>
        Approved refunds will be processed to the original payment method.
      </p>

      <h2 style={S.h2}>Product Changes</h2>
      <p style={S.p}>
        In rare circumstances, minor adjustments may be made during the manufacturing process
        to improve quality, comfort, durability, or product performance.
      </p>
      <p style={S.p}>
        Any material changes that significantly affect the product will be communicated to
        customers.
      </p>

      <h2 style={S.h2}>Pre-Order Pricing</h2>
      <p style={S.p}>
        Pre-order customers may receive access to exclusive launch pricing, limited-edition
        colourways, promotional gifts, or early access benefits.
      </p>
      <p style={S.p}>
        Once the pre-order campaign closes, product pricing may increase without notice.
      </p>

      <h2 style={S.h2}>Shipping</h2>
      <p style={S.p}>Rouge Rabbit currently ships exclusively within South Africa.</p>
      <h3 style={S.h3}>Free Shipping</h3>
      <ul style={S.ul}>
        <li>Free Standard Shipping on orders over <strong style={{ color: '#E6E6E6' }}>R2,000</strong></li>
        <li>Orders below R2,000 will incur a shipping fee calculated at checkout.</li>
      </ul>

      <div style={{ marginTop: 56, padding: '32px', background: '#1E1E20', border: '1px solid #3A3A3C' }}>
        <p style={{ ...S.p, fontWeight: 600, color: '#E6E6E6', marginBottom: 8 }}>Contact Us</p>
        <p style={S.p}>
          For questions regarding your pre-order, please contact:
        </p>
        <p style={{ ...S.p, margin: 0 }}>
          <strong style={{ color: '#E6E6E6' }}>Rouge Rabbit Customer Support</strong><br />
          <a href="mailto:support@rougerabbit.co.za" style={S.a}>support@rougerabbit.co.za</a>
        </p>
        <p style={{ ...S.p, marginTop: 16, marginBottom: 0, fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em', color: '#E6E6E6' }}>
          NO FEAR. JUST MOTION.
        </p>
      </div>

    </PolicyLayout>
  )
}
