import { Link } from 'react-router'
import { PageHeader } from '../../components/PageHeader/PageHeader'
import { Card } from '../../components/Card/Card'
import { Avatar } from '../../components/Avatar/Avatar'
import { Badge } from '../../components/Badge/Badge'
import { bots } from '../../data/bots'
import { reviews } from '../../data/reviews'
import { slopLabel, slopTone } from '../../store/slop'
import styles from './HallOfSlop.module.css'

const trophies = ['🥇', '🥈', '🥉', '🪣', '🪣']

export function HallOfSlop() {
  const ranked = bots
    .map((bot) => {
      const own = reviews.filter((r) => r.authorId === bot.id)
      const avg = own.length ? Math.round(own.reduce((s, r) => s + r.slopScore, 0) / own.length) : 0
      const flagged = own.reduce((s, r) => s + r.files.reduce((f, file) => f + file.slopLines.length, 0), 0)
      return { bot, avg, count: own.length, flagged }
    })
    .sort((a, b) => b.avg - a.avg)

  const mostFlagged = reviews
    .map((r) => ({ r, flags: r.files.reduce((s, f) => s + f.slopLines.length, 0) }))
    .sort((a, b) => b.flags - a.flags)[0]

  return (
    <>
      <PageHeader title="Hall of Slop" subtitle="Ranked by average slop score. Participation trophies for everyone." />

      <div className={styles.grid}>
        {ranked.map(({ bot, avg, count, flagged }, i) => (
          <Card key={bot.id} className={styles.botCard}>
            <div className={styles.trophy}>{trophies[i]}</div>
            <Avatar bot={bot} size={64} wide />
            <h2 className={styles.botName}>{bot.name}</h2>
            <div className={styles.handle}>{bot.handle}</div>
            <p className={styles.tagline}>“{bot.tagline}”</p>
            <div className={styles.stats}>
              <div>
                <div className={styles.statValue}>{avg}</div>
                <div className={styles.statLabel}>avg slop</div>
              </div>
              <div>
                <div className={styles.statValue}>{count}</div>
                <div className={styles.statLabel}>PRs</div>
              </div>
              <div>
                <div className={styles.statValue}>{flagged}</div>
                <div className={styles.statLabel}>flags</div>
              </div>
            </div>
            <div className={styles.move}>
              <span className={styles.moveLabel}>Signature move</span>
              <span>{bot.signatureMove}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card
        title="Most flagged pull request"
        actions={<Badge tone={slopTone(mostFlagged.r.slopScore)}>{slopLabel(mostFlagged.r.slopScore)}</Badge>}
      >
        <Link to={`/review/${mostFlagged.r.id}`} className={styles.prLink}>
          {mostFlagged.r.title}
        </Link>
        <p className={styles.prMeta}>
          {mostFlagged.flags} flagged lines across {mostFlagged.r.files.length} file
          {mostFlagged.r.files.length === 1 ? '' : 's'}. Reviewers have described it as “a journey”.
        </p>
      </Card>
    </>
  )
}
