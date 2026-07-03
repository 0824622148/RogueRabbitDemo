import type { CSSProperties } from 'react'

/** Shared table + surface styles for the admin dashboard (dark brand theme). */

export const cell: CSSProperties = {
  padding: '12px 14px',
  borderBottom: '1px solid #1E1E20',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '.08em',
  color: '#E6E6E6',
  whiteSpace: 'nowrap',
}

export const th: CSSProperties = {
  ...cell,
  color: '#A6A6A8',
  fontSize: 9,
  letterSpacing: '.18em',
  borderBottom: '1px solid #3A3A3C',
  background: '#0F0F10',
  textAlign: 'left',
}

/** Section overline label (e.g. "● ORDERS (12)"). */
export const overline: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '.2em',
  color: '#D90017',
  marginBottom: 16,
}

/** Bordered card surface. */
export const card: CSSProperties = {
  background: '#1E1E20',
  border: '1px solid #3A3A3C',
  padding: '24px 28px',
}

export const tableWrap: CSSProperties = {
  overflowX: 'auto',
  border: '1px solid #3A3A3C',
}
