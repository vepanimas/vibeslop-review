import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  emoji?: string
  title: string
  children?: ReactNode
}

export function EmptyState({ emoji = '🫧', title, children }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.emoji}>{emoji}</div>
      <h3>{title}</h3>
      {children && <p className={styles.text}>{children}</p>}
    </div>
  )
}
