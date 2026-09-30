import type { ReviewFile } from '../../store/types'
import styles from './CodeBlock.module.css'

interface CodeBlockProps {
  file: ReviewFile
  commentedLines?: Set<number>
  activeLine?: number | null
  onLineClick?: (line: number) => void
}

export function CodeBlock({ file, commentedLines, activeLine, onLineClick }: CodeBlockProps) {
  const flags = new Map(file.slopLines.map((s) => [s.line, s.reason]))
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.path}>{file.path}</span>
        <span className={styles.meta}>
          {file.lines.length} lines · {file.slopLines.length} flagged
        </span>
      </div>
      <div className={styles.scroller}>
        <div className={styles.grid}>
          <div className={styles.gutter} aria-hidden="true">
            {file.lines.map((_, i) => (
              <div key={i} className={styles.gutterLine}>
                {i + 1}
              </div>
            ))}
          </div>
          <pre className={styles.code}>
            {file.lines.map((text, i) => {
              const n = i + 1
              const reason = flags.get(n)
              const cls = [
                styles.line,
                reason ? styles.flagged : '',
                commentedLines?.has(n) ? styles.commented : '',
                activeLine === n ? styles.active : '',
                onLineClick ? styles.clickable : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <div key={n} className={cls} title={reason} onClick={() => onLineClick?.(n)}>
                  <span className={styles.text}>{text || ' '}</span>
                  {reason && <span className={styles.flagIcon}>⚠</span>}
                </div>
              )
            })}
          </pre>
        </div>
      </div>
    </div>
  )
}
