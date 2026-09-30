import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  actions?: ReactNode
  children: ReactNode
  padded?: boolean
}

export function Card({ title, actions, children, padded = true, className, ...rest }: CardProps) {
  return (
    <section className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
      {(title || actions) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={padded ? styles.body : undefined}>{children}</div>
    </section>
  )
}
