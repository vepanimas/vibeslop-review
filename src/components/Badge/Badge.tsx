import type { ReactNode } from 'react'
import type { SlopTone } from '../../store/slop'
import styles from './Badge.module.css'

interface BadgeProps {
  tone?: SlopTone
  children: ReactNode
  title?: string
}

export function Badge({ tone = 'neutral', children, title }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`} title={title}>
      {children}
    </span>
  )
}
