'use client'

export const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
  'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
]

export interface DeliveryAddress {
  addressLine1: string
  addressLine2: string
  suburb: string
  city: string
  province: string
  postalCode: string
}

export const EMPTY_ADDRESS: DeliveryAddress = {
  addressLine1: '', addressLine2: '', suburb: '', city: '', province: '', postalCode: '',
}

export function isAddressComplete(a: DeliveryAddress): boolean {
  return Boolean(a.addressLine1.trim() && a.suburb.trim() && a.city.trim() && a.province && a.postalCode.trim())
}

/** Trimmed copy for sending to the API. */
export function cleanAddress(a: DeliveryAddress): DeliveryAddress {
  return {
    addressLine1: a.addressLine1.trim(),
    addressLine2: a.addressLine2.trim(),
    suburb: a.suburb.trim(),
    city: a.city.trim(),
    province: a.province,
    postalCode: a.postalCode.trim(),
  }
}

export const checkoutInputStyle: React.CSSProperties = {
  width: '100%', background: '#0F0F10', border: '1px solid #3A3A3C',
  color: '#E6E6E6', fontFamily: 'var(--font-body)', fontSize: 14,
  padding: '12px 14px', outline: 'none', boxSizing: 'border-box',
}

interface Props {
  value: DeliveryAddress
  onChange: (next: DeliveryAddress) => void
}

export default function DeliveryAddressFields({ value, onChange }: Props) {
  const set = (k: keyof DeliveryAddress) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange({ ...value, [k]: e.target.value })

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="rr-overline" style={{ marginBottom: 12, color: '#A6A6A8' }}>DELIVERY ADDRESS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input value={value.addressLine1} onChange={set('addressLine1')} placeholder="Street address" autoComplete="address-line1" style={checkoutInputStyle} />
        <input value={value.addressLine2} onChange={set('addressLine2')} placeholder="Apartment, unit, etc. (optional)" autoComplete="address-line2" style={checkoutInputStyle} />
        <div className="rr-checkout-row2">
          <input value={value.suburb} onChange={set('suburb')} placeholder="Suburb" autoComplete="address-level3" style={checkoutInputStyle} />
          <input value={value.city} onChange={set('city')} placeholder="City" autoComplete="address-level2" style={checkoutInputStyle} />
        </div>
        <div className="rr-checkout-row2">
          <select value={value.province} onChange={set('province')} autoComplete="address-level1" style={{ ...checkoutInputStyle, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <option value="">Province</option>
            {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input value={value.postalCode} onChange={set('postalCode')} placeholder="Postal code" inputMode="numeric" autoComplete="postal-code" style={checkoutInputStyle} />
        </div>
      </div>
    </div>
  )
}
