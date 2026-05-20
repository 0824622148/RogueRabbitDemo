import Image from 'next/image'

interface RougeLogoProps {
  size?: number
  withWordmark?: boolean
  color?: string
}

export default function RougeLogo({ size = 32, withWordmark = false, color = 'bone' }: RougeLogoProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <Image
        src="/assets/rouge-logo.png"
        alt="Rouge Rabbit"
        width={size}
        height={size}
        style={{
          objectFit: 'contain',
          filter:
            color === 'bone'
              ? 'invert(94%) sepia(2%) saturate(0%) hue-rotate(0deg) brightness(102%) contrast(90%)'
              : 'none',
        }}
      />
      {withWordmark && (
        <span
          className="rr-display"
          style={{ fontSize: size * 0.9, color: color === 'bone' ? '#E6E6E6' : '#0F0F10', letterSpacing: '.06em' }}
        >
          ROUGE RABBIT
        </span>
      )}
    </div>
  )
}
