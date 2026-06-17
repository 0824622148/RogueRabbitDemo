import type { Metadata } from 'next'
import PolicyLayout from '@/components/brand/PolicyLayout'

export const metadata: Metadata = {
  title: 'Shipping & Returns — Rouge Rabbit',
  description: 'Rouge Rabbit shipping times, costs, return eligibility, and the 30-Day Fit Guarantee.',
}

const S = {
  h2: { fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '0.01em', textTransform: 'uppercase' as const, color: '#E6E6E6', margin: '48px 0 16px', borderBottom: '1px solid #3A3A3C', paddingBottom: 10 },
  h3: { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#E6E6E6', margin: '28px 0 10px' },
  p:  { margin: '0 0 14px' },
  ul: { margin: '0 0 14px', paddingLeft: 24, display: 'flex', flexDirection: 'column' as const, gap: 6 },
  ol: { margin: '0 0 14px', paddingLeft: 24, display: 'flex', flexDirection: 'column' as const, gap: 6 },
  a:  { color: '#D90017', textDecoration: 'none' },
}

export default function ShippingReturnsPage() {
  return (
    <PolicyLayout title="Shipping & Returns" lastUpdated="June 2026">

      <p style={S.p}>
        At Rouge Rabbit, we are committed to delivering premium products and an exceptional
        customer experience. Please review our Shipping &amp; Returns Policy before placing
        your order.
      </p>

      {/* ── SHIPPING ────────────────────────────── */}
      <h2 style={S.h2}>Shipping Policy</h2>

      <h3 style={S.h3}>Delivery Areas</h3>
      <p style={S.p}>Rouge Rabbit currently ships exclusively within South Africa.</p>

      <h3 style={S.h3}>Processing Times</h3>
      <p style={S.p}>
        All orders are processed within <strong style={{ color: '#E6E6E6' }}>3–5 business days</strong> after
        payment confirmation. During product launches, promotions, and peak periods, processing
        times may be slightly longer.
      </p>

      <h3 style={S.h3}>Delivery Times</h3>
      <p style={S.p}>Estimated delivery times are:</p>
      <ul style={S.ul}>
        <li>Major Metropolitan Areas: <strong style={{ color: '#E6E6E6' }}>3–5 business days</strong></li>
        <li>Regional Areas: <strong style={{ color: '#E6E6E6' }}>3–7 business days</strong></li>
        <li>Remote Areas: <strong style={{ color: '#E6E6E6' }}>5–10 business days</strong></li>
      </ul>
      <p style={S.p}>
        Delivery times are estimates and may vary depending on courier operations, weather
        conditions, public holidays, and other factors beyond our control.
      </p>

      <h3 style={S.h3}>Shipping Costs</h3>
      <ul style={S.ul}>
        <li><strong style={{ color: '#E6E6E6' }}>Free Standard Shipping</strong> on all orders over <strong style={{ color: '#E6E6E6' }}>R2,000</strong></li>
        <li>Orders below R2,000 will incur a shipping fee calculated at checkout.</li>
      </ul>

      <h3 style={S.h3}>Order Tracking</h3>
      <p style={S.p}>
        Once your order has been dispatched, you will receive a tracking number via email or
        SMS so you can monitor your shipment.
      </p>

      <h3 style={S.h3}>Incorrect Delivery Information</h3>
      <p style={S.p}>
        Customers are responsible for ensuring that all shipping information is accurate. Rouge
        Rabbit is not responsible for delays or additional charges resulting from incorrect
        delivery details provided by the customer.
      </p>

      <h3 style={S.h3}>Lost or Damaged Parcels</h3>
      <p style={S.p}>
        If your parcel arrives damaged or appears to be lost in transit, please contact us
        within <strong style={{ color: '#E6E6E6' }}>48 hours</strong> of the expected delivery date at{' '}
        <a href="mailto:support@rougerabbit.co.za" style={S.a}>support@rougerabbit.co.za</a>.
      </p>
      <p style={S.p}>
        We will work with the courier partner to resolve the issue as quickly as possible.
      </p>

      {/* ── RETURNS ─────────────────────────────── */}
      <h2 style={S.h2}>Returns Policy</h2>

      <h3 style={S.h3}>Returns Window</h3>
      <p style={S.p}>
        Customers may request a return within <strong style={{ color: '#E6E6E6' }}>14 days</strong> of
        receiving their order.
      </p>

      <h3 style={S.h3}>Eligibility for Returns</h3>
      <p style={S.p}>To qualify for a return, items must:</p>
      <ul style={S.ul}>
        <li>Be unworn and unused</li>
        <li>Be in original condition</li>
        <li>Include all original packaging, tags, accessories, and documentation</li>
        <li>Be free from stains, marks, odors, or damage</li>
        <li>Include proof of purchase</li>
      </ul>
      <p style={S.p}>
        Rouge Rabbit reserves the right to refuse returns that do not meet these conditions.
      </p>

      <h3 style={S.h3}>Non-Returnable Items</h3>
      <p style={S.p}>The following items cannot be returned:</p>
      <ul style={S.ul}>
        <li>Products showing signs of wear or use</li>
        <li>Customized or personalized products</li>
        <li>Gift cards</li>
        <li>Clearance, promotional, or final-sale items (unless defective)</li>
      </ul>

      <h3 style={S.h3}>Exchanges</h3>
      <p style={S.p}>
        We offer exchanges for a different size, subject to stock availability.
      </p>
      <p style={S.p}>
        If the requested size is unavailable, customers may choose store credit or a refund
        (subject to approval and inspection).
      </p>

      <h3 style={S.h3}>Return Shipping Costs</h3>
      <ul style={S.ul}>
        <li>
          If the return is due to a manufacturing defect or an error on our part, Rouge Rabbit
          will cover the return shipping costs.
        </li>
        <li>
          For size changes, preference changes, or other customer-initiated returns, the
          customer is responsible for return shipping costs.
        </li>
      </ul>

      <h3 style={S.h3}>Refund Process</h3>
      <p style={S.p}>
        Once your returned item has been received and inspected, we will notify you of the
        outcome. Approved refunds will be processed to the original payment method within{' '}
        <strong style={{ color: '#E6E6E6' }}>5–10 business days</strong>.
      </p>
      <p style={S.p}>
        Shipping fees paid on the original order are non-refundable unless the return is due
        to a defective product or an error by Rouge Rabbit.
      </p>

      <h3 style={S.h3}>Defective or Incorrect Items</h3>
      <p style={S.p}>
        If you receive a defective, damaged, or incorrect item, please contact us within{' '}
        <strong style={{ color: '#E6E6E6' }}>7 days</strong> of delivery. Please include:
      </p>
      <ul style={S.ul}>
        <li>Your order number</li>
        <li>Photos of the product</li>
        <li>A brief description of the issue</li>
      </ul>
      <p style={S.p}>
        Our team will assess the claim and arrange a replacement, exchange, or refund where
        appropriate.
      </p>

      <h3 style={S.h3}>How to Initiate a Return</h3>
      <p style={S.p}>
        To begin a return request, contact us at{' '}
        <a href="mailto:support@rougerabbit.co.za" style={S.a}>support@rougerabbit.co.za</a>.
        Please include your full name, order number, reason for return, and photos if applicable.
        Our customer support team will guide you through the process.
      </p>

      {/* ── 30-DAY FIT GUARANTEE ─────────────────── */}
      <h2 style={S.h2}>30-Day Fit Guarantee</h2>

      <p style={S.p}>
        At Rouge Rabbit, we want you to move with confidence. If your Rouge Rabbit footwear
        doesn&apos;t fit as expected, we&apos;ve got you covered.
      </p>

      <h3 style={S.h3}>How It Works</h3>
      <p style={S.p}>
        First-time customers may request a size exchange within{' '}
        <strong style={{ color: '#E6E6E6' }}>30 days</strong> of receiving their footwear.
      </p>

      <h3 style={S.h3}>Eligibility</h3>
      <p style={S.p}>To qualify for the 30-Day Fit Guarantee:</p>
      <ul style={S.ul}>
        <li>The footwear must be in unworn condition.</li>
        <li>The footwear must only have been tried on indoors.</li>
        <li>The original shoe box, packaging, tags, and accessories must be included.</li>
        <li>The product must show no signs of outdoor use, damage, dirt, creasing, or excessive wear.</li>
      </ul>

      <h3 style={S.h3}>Exchange Process</h3>
      <ol style={S.ol}>
        <li>Contact our Customer Support team within 30 days of receiving your order.</li>
        <li>Provide your order number and the size you wish to exchange for.</li>
        <li>Once approved, return instructions will be provided.</li>
        <li>Upon receipt and inspection, we will dispatch the replacement size, subject to stock availability.</li>
      </ol>

      <h3 style={S.h3}>Shipping Costs</h3>
      <ul style={S.ul}>
        <li>The customer is responsible for the return shipping cost to Rouge Rabbit.</li>
        <li>Rouge Rabbit will cover the shipping cost of sending the replacement pair back to the customer within South Africa.</li>
      </ul>

      <h3 style={S.h3}>Stock Availability</h3>
      <p style={S.p}>
        Size exchanges are subject to product availability. If the requested size is
        unavailable, customers may choose between store credit or a refund in accordance
        with our Returns Policy.
      </p>

      <h3 style={S.h3}>Exclusions</h3>
      <p style={S.p}>
        The 30-Day Fit Guarantee applies only to sizing issues and does not cover:
      </p>
      <ul style={S.ul}>
        <li>General wear and tear</li>
        <li>Accidental damage</li>
        <li>Products that have been worn outdoors</li>
        <li>Clearance, promotional, or final-sale products</li>
      </ul>
      <p style={S.p}>
        Rouge Rabbit reserves the right to refuse exchanges where products do not meet the
        eligibility requirements outlined above.
      </p>

      <div style={{ marginTop: 56, padding: '32px', background: '#1E1E20', border: '1px solid #3A3A3C' }}>
        <p style={{ ...S.p, fontWeight: 600, color: '#E6E6E6', marginBottom: 8 }}>Contact Us</p>
        <p style={S.p}>
          For any questions regarding shipping, returns, or exchanges, please contact:
        </p>
        <p style={{ ...S.p, margin: 0 }}>
          <strong style={{ color: '#E6E6E6' }}>Rouge Rabbit Customer Support</strong><br />
          <a href="mailto:support@rougerabbit.co.za" style={S.a}>support@rougerabbit.co.za</a>
        </p>
        <p style={{ ...S.p, marginTop: 12, marginBottom: 0, fontSize: 13, color: '#A6A6A8' }}>
          Rouge Rabbit reserves the right to amend this Shipping &amp; Returns Policy at any
          time without prior notice.
        </p>
      </div>

    </PolicyLayout>
  )
}
