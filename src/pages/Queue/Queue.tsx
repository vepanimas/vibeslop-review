import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { Card } from '../../components/Card/Card'
import { Badge } from '../../components/Badge/Badge'
import { Button } from '../../components/Button/Button'
import { Avatar } from '../../components/Avatar/Avatar'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { reviews } from '../../data/reviews'
import { botById } from '../../data/bots'
import { useStore } from '../../store/ReviewStore'
import { formatRelative, slopLabel, slopTone, statusLabel, statusTone } from '../../store/slop'
import type { ReviewStatus } from '../../store/types'
import styles from './Queue.module.css'

const PAGE_SIZE = 5
type SortKey = 'slop' | 'date' | 'lines'
type StatusFilter = 'all' | ReviewStatus

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'approved', label: 'Approved' },
  { value: 'changes_requested', label: 'Changes requested' },
  { value: 'rejected', label: 'Rejected' },
]

export function Queue() {
  const navigate = useNavigate()
  const { state } = useStore()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('slop')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  console.log('here')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = reviews.filter((r) => {
      const s = state.statuses[r.id] ?? 'open'
      if (status !== 'all' && s !== status) return false
      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        r.repo.toLowerCase().includes(q) ||
        botById(r.authorId).name.toLowerCase().includes(q)
      )
    })
    return list.sort((a, b) => {
      if (sort === 'slop') return b.slopScore - a.slopScore
      if (sort === 'lines') return b.linesChanged - a.linesChanged
      return b.createdAt.localeCompare(a.createdAt)
    })
  }, [query, sort, status, state.statuses])

  const totalPages = Math.floor(filtered.length / PAGE_SIZE) + (filtered.length % PAGE_SIZE ? 1 : 0)
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const update = (fn: () => void) => {
    fn()
    setPage(1)
  }

  return (
    <>
      <PageHeader
        title="Review Queue"
        subtitle={`${reviews.length} pull requests await your judgement. They will not improve while waiting.`}
      />

      <Card padded={false}>
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search title, repo or bot…"
            value={query}
            onChange={(e) => update(() => setQuery(e.target.value))}
            aria-label="Search reviews"
          />
          <div className={styles.chips}>
            {statusFilters.map((f) => (
              <button
                className={`${styles.chip} ${status === f.value ? styles.chipActive : ''}`}
                onClick={() => update(() => setStatus(f.value))}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className={styles.sort}>
            Sort by
            <select value={sort} onChange={(e) => update(() => setSort(e.target.value as SortKey))}>
              <option value="slop">Slop score</option>
              <option value="date">Newest</option>
              <option value="lines">Lines changed</option>
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <EmptyState emoji="🧹" title="No slop matches.">
            Either you filtered too hard or the bots are having a good day. It is the first one.
          </EmptyState>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pull request</th>
                <th>Author</th>
                <th>Repo</th>
                <th className={styles.num}>Lines</th>
                <th>Slop score</th>
                <th>Status</th>
                <th className={styles.num}>Age</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const bot = botById(r.authorId)
                const s = state.statuses[r.id] ?? 'open'
                return (
                  <tr key={r.id} className={styles.row} onClick={() => navigate(`/review/${r.id}`)}>
                    <td>
                      <div className={styles.title}>{r.title}</div>
                      <div className={styles.id}>{r.id.toUpperCase()}</div>
                    </td>
                    <td>
                      <span className={styles.author}>
                        <Avatar bot={bot} size={22} />
                        {bot.name}
                      </span>
                    </td>
                    <td>
                      <code>{r.repo}</code>
                    </td>
                    <td className={styles.num}>{r.linesChanged}</td>
                    <td className={styles.num}>
                      <Badge tone={slopTone(r.slopScore)} title={slopLabel(r.slopScore)}>
                        {r.slopScore}
                      </Badge>
                    </td>
                    <td>
                      <Badge tone={statusTone(s)}>{statusLabel(s)}</Badge>
                    </td>
                    <td className={`${styles.num} ${styles.muted}`}>{formatRelative(r.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        <div className={styles.pagination}>
          <span className={styles.muted}>
            Page {page} of {totalPages}
          </span>
          <div className={styles.pageButtons}>
            <Button size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              ← Previous
            </Button>
            <Button size="sm" onClick={() => setPage((p) => p + 1)} disabled={page > totalPages}>
              Next →
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
}
