import type { Bot } from '../../store/types'
import styles from './Avatar.module.css'

interface AvatarProps {
  bot: Bot
  size?: number
  wide?: boolean
}

/** Deterministic "robot face" SVG per bot, coloured by its hue. */
export function Avatar({ bot, size = 28, wide }: AvatarProps) {
  const bg = `hsl(${bot.hue} 70% 88%)`
  const fg = `hsl(${bot.hue} 60% 35%)`
  const seed = bot.id.length
  const eyeY = 13 + (seed % 3)
  const mouthW = 8 + (seed % 5)

  const width = wide ? size * 1.6 : size
  const height = size

  return (
    <svg
      className={styles.avatar}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      preserveAspectRatio={wide ? 'none' : 'xMidYMid meet'}
      role="img"
      aria-label={bot.name}
    >
      <rect width="32" height="32" rx="8" fill={bg} />
      <rect x="7" y="8" width="18" height="16" rx="4" fill={fg} />
      <circle cx="13" cy={eyeY} r="2" fill={bg} />
      <circle cx="19" cy={eyeY} r="2" fill={bg} />
      <rect x={16 - mouthW / 2} y="19" width={mouthW} height="2" rx="1" fill={bg} />
      <rect x="15" y="4" width="2" height="4" fill={fg} />
    </svg>
  )
}
