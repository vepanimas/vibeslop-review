import { useEffect, useState } from 'react'
import { slopLabel } from '../../store/slop'
import styles from './SlopMeter.module.css'

interface SlopMeterProps {
  score: number
  size?: number
}

/** Half-circle gauge that animates from 0 to `score` on mount. */
export function SlopMeter({ score, size = 160 }: SlopMeterProps) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 900
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(score * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const r = 44
  const c = Math.PI * r
  const offset = c - (shown / 100) * c
  const color = shown >= 75 ? '#dc2626' : shown >= 50 ? '#d97706' : '#16a34a'

  return (
    <div className={styles.meter} style={{ width: size }}>
      <svg viewBox="0 0 100 56" width={size} height={size * 0.56}>
        <path d="M6 50 A44 44 0 0 1 94 50" fill="none" stroke="var(--color-surface-alt)" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M6 50 A44 44 0 0 1 94 50"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.value}>{shown}</div>
      <div className={styles.label}>{slopLabel(score)}</div>
    </div>
  )
}
