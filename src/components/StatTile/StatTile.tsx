import type { ReactNode } from 'react'
import styles from './StatTile.module.css'

interface StatTileProps {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
  featured?: boolean
}

export function StatTile({ label, value, hint, icon, featured }: StatTileProps) {
  return (
    <div className={`${styles.tile} ${featured ? styles.featured : ''}`}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value}</div>
      {hint && <div className={styles.hint}>{hint}</div>}
    </div>
  )
}
