import styles from './Sparkline.module.css'

interface SparklineProps {
  values: number[]
  height?: number
}

export function Sparkline({ values, height = 72 }: SparklineProps) {
  const w = 100
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = height - 6 - ((v - min) / range) * (height - 12)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  const path = `M${points.join(' L')}`
  const area = `${path} L${w},${height} L0,${height} Z`
  const [lx, ly] = points[points.length - 1].split(',')

  return (
    <svg className={styles.spark} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7c3aed" stopOpacity="0.28" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke="#7c3aed" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      <circle cx={lx} cy={ly} r="2.4" fill="#7c3aed" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
