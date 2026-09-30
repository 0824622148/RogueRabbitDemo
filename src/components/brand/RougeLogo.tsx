import Image from 'next/image'

// Wordmark artwork is 1274 × 291 (transparent PNG)
const ASPECT = 1274 / 291

interface RougeLogoProps {
  size?: number
  color?: 'bone' | 'ink'
  className?: string
}

export default function RougeLogo({ size = 32, color = 'bone', className }: RougeLogoProps) {
  return (
    <Image
      src={color === 'bone' ? '/assets/rouge-logo-light.png' : '/assets/rouge-logo-dark.png'}
      alt="Rouge Rabbit"
      width={Math.round(size * ASPECT)}
      height={size}
      className={className}
      priority
      style={{ display: 'block', objectFit: 'contain' }}
    />
  )
}
