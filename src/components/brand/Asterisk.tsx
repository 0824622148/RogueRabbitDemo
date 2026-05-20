export default function Asterisk({ size = 10, color }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M5 0V10M0 5H10M1.46 1.46L8.54 8.54M1.46 8.54L8.54 1.46"
        stroke={color || 'currentColor'}
        strokeWidth="1.2"
      />
    </svg>
  )
}
