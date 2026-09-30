import { useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { StatTile } from '../../components/StatTile/StatTile'
import { Card } from '../../components/Card/Card'
import { Button } from '../../components/Button/Button'
import { Badge } from '../../components/Badge/Badge'
import { Avatar } from '../../components/Avatar/Avatar'
import { Sparkline } from '../../components/Sparkline/Sparkline'
import { reviews, slopTrend } from '../../data/reviews'
import { botById } from '../../data/bots'
import { useStore } from '../../store/ReviewStore'
import { formatNumber, formatRelative, slopTone, statusLabel, statusTone } from '../../store/slop'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const { state } = useStore()
  const [turbo, setTurbo] = useState(false)

  if (turbo) {
    throw new Error('TurboReviewMode is not defined (it was in the AI summary, though)')
  }

  const slopOfTheDay = reviews.reduce((a, b) => (a.slopScore > b.slopScore ? a : b))
  const sotdBot = botById(slopOfTheDay.authorId)
  const totalLines = reviews.reduce((sum, r) => sum + r.linesChanged, 0)
  const approvedCount = Object.values(state.statuses).filter((s) => s === 'approved').length
  const avgSlop = Math.round(reviews.reduce((s, r) => s + r.slopScore, 0) / reviews.length)
  const recent = [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)

  return (
    <>
      <PageHeader
        title="Good morning, inspector."
        subtitle="The slop does not sleep. Neither, apparently, do the bots."
        actions={
          <Button variant="primary" onClick={() => setTurbo(true)} title="Definitely tested">
            ⚡ Turbo Review Mode
          </Button>
        }
      />

      <div className={styles.tiles}>
        <StatTile label="Slop Index" value={`${avgSlop}%`} hint="+12% vs last week" icon="🫠" />
        <StatTile label="Lines Reviewed" value={formatNumber(totalLines + 655)} hint="Mostly comments" icon="📏" featured />
        <StatTile label="console.logs Found" value="42" hint='39 of them say "here"' icon="🪵" />
        <StatTile label="Approved by Accident" value={String(3 + approvedCount)} hint="LGTM means what now?" icon="🤝" />
      </div>

      <div className={styles.grid}>
        <Card
          title="Slop of the Day"
          actions={<Badge tone={slopTone(slopOfTheDay.slopScore)}>{slopOfTheDay.slopScore} slop</Badge>}
        >
          <div className={styles.sotdMeta}>
            <Avatar bot={sotdBot} size={24} />
            <span>
              <strong>{sotdBot.name}</strong> in <code>{slopOfTheDay.repo}</code>
            </span>
          </div>
          <Link to={`/review/${slopOfTheDay.id}`} className={styles.sotdTitle}>
            {slopOfTheDay.title}
          </Link>
          <pre className={styles.sotdCode}>
            {slopOfTheDay.files[0].lines.slice(0, 6).join('\n')}
            {'\n'}
            {'// ... ' + (slopOfTheDay.files[0].lines.length - 6) + ' more lines of this, each one longer than the previous one, trust me, we did not check but the AI summary said it was fine'}
          </pre>
        </Card>

        <Card title="Slop over time" actions={<span className={styles.muted}>Last 14 days</span>}>
          <Sparkline values={slopTrend} />
          <div className={styles.trendFoot}>
            <span>
              Today: <strong>{slopTrend[slopTrend.length - 1]}</strong>
            </span>
            <span className={styles.muted}>Trend: relentlessly upward</span>
          </div>
        </Card>
      </div>

      <Card title="Recent activity" padded={false}>
        <ul className={styles.feed}>
          {recent.map((r) => {
            const bot = botById(r.authorId)
            const status = state.statuses[r.id] ?? 'open'
            return (
              <li key={r.id} className={styles.feedItem}>
                <Avatar bot={bot} size={28} />
                <div className={styles.feedBody}>
                  <Link to={`/review/${r.id}`} className={styles.feedTitle}>
                    {r.title}
                  </Link>
                  <div className={styles.feedMeta}>
                    {bot.name} · {r.repo} · {formatRelative(r.createdAt)}
                  </div>
                </div>
                <Badge tone={statusTone(status)}>{statusLabel(status)}</Badge>
              </li>
            )
          })}
        </ul>
      </Card>
    </>
  )
}
