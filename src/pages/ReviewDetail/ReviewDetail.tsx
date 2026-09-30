import { useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { Card } from '../../components/Card/Card'
import { Button } from '../../components/Button/Button'
import { Badge } from '../../components/Badge/Badge'
import { Avatar } from '../../components/Avatar/Avatar'
import { Modal } from '../../components/Modal/Modal'
import { CodeBlock } from '../../components/CodeBlock/CodeBlock'
import { SlopMeter } from '../../components/SlopMeter/SlopMeter'
import { EmptyState } from '../../components/EmptyState/EmptyState'
import { useToast } from '../../components/Toast/Toast'
import { reviewById } from '../../data/reviews'
import { botById } from '../../data/bots'
import { aiSummaryPhrases, cannedComments } from '../../data/comments'
import { useStore } from '../../store/ReviewStore'
import { formatRelative, statusLabel, statusTone } from '../../store/slop'
import styles from './ReviewDetail.module.css'

type Tab = 'files' | 'comments' | 'summary'

const rejectSteps = [
  { title: 'Reject this pull request?', body: 'Are you sure?', confirm: 'Yes, reject' },
  { title: 'Really?', body: 'The bot worked really hard on this. For about 0.3 seconds.', confirm: 'Really reject' },
  { title: 'Fine.', body: 'It took the AI 0.3s to write this. It will take it 0.3s to write it again.', confirm: 'Reject it already' },
]

export function ReviewDetail() {
  const { id } = useParams()
  const review = reviewById(id)
  const { state, setStatus, addComment } = useStore()
  const { toast } = useToast()

  const [tab, setTab] = useState<Tab>('files')
  const [activeFile, setActiveFile] = useState(0)
  const [activeLine, setActiveLine] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [rejectStep, setRejectStep] = useState<number | null>(null)
  const [confetti, setConfetti] = useState(false)

  const comments = useMemo(() => state.comments.filter((c) => c.reviewId === id), [state.comments, id])

  if (!review) {
    return (
      <EmptyState emoji="🔍" title="Pull request not found.">
        It may have been merged by accident. <Link to="/queue">Back to the queue</Link>.
      </EmptyState>
    )
  }

  const bot = botById(review.authorId)
  const status = state.statuses[review.id] ?? 'open'
  const file = review.files[activeFile]
  const commentedLines = new Set(comments.filter((c) => c.filePath === file.path).map((c) => c.line))
  const totalFlags = review.files.reduce((s, f) => s + f.slopLines.length, 0)

  const approve = () => {
    setStatus(review.id, 'approved')
    setConfetti(true)
    window.setTimeout(() => setConfetti(false), 1600)
    toast('Approved. Future you sends their regards.', 'success')
  }
  const requestChanges = () => {
    setStatus(review.id, 'changes_requested')
    toast('Changes requested. Again.')
  }
  const advanceReject = () => {
    if (rejectStep === null) return
    if (rejectStep < rejectSteps.length - 1) {
      setRejectStep(rejectStep + 1)
      return
    }
    setRejectStep(null)
    setStatus(review.id, 'rejected')
    toast('Rejected. The bot has already opened a new PR.', 'danger')
  }
  const submitComment = (text: string) => {
    if (!text.trim() || activeLine === null) return
    addComment({ reviewId: review.id, filePath: file.path, line: activeLine, text: text.trim(), author: state.settings.displayName })
    setDraft('')
    setActiveLine(null)
    toast('Comment posted. It will be ignored shortly.')
  }

  return (
    <>
      <div className={styles.back}>
        <Link to="/queue">← Back to queue</Link>
      </div>

      <div className={styles.head}>
        <div className={styles.headMain}>
          <div className={styles.headTop}>
            <span className={styles.prId}>{review.id.toUpperCase()}</span>
            <Badge tone={statusTone(status)}>{statusLabel(status)}</Badge>
          </div>
          <h1 className={styles.title}>{review.title}</h1>
          <div className={styles.meta}>
            <Avatar bot={bot} size={22} />
            <strong>{bot.name}</strong>
            <span>wants to merge into</span>
            <code>{review.repo}</code>
            <span>· {formatRelative(review.createdAt)}</span>
            <span>· {review.linesChanged} lines</span>
            <span>· {totalFlags} flags</span>
          </div>
          <div className={styles.actions}>
            <Button variant="success" onClick={approve} disabled={status === 'approved'}>
              ✓ Approve
            </Button>
            <Button onClick={requestChanges} disabled={status === 'changes_requested'}>
              Request changes
            </Button>
            <Button variant="danger" onClick={() => setRejectStep(0)} disabled={status === 'rejected'}>
              Reject
            </Button>
          </div>
        </div>
        <Card className={styles.meterCard}>
          <SlopMeter score={review.slopScore} />
        </Card>
      </div>

      <div className={styles.tabs} role="tablist">
        <TabButton active={tab === 'files'} onClick={() => setTab('files')}>
          Files <span className={styles.count}>{review.files.length}</span>
        </TabButton>
        <TabButton active={tab === 'comments'} onClick={() => setTab('comments')}>
          Comments <span className={styles.count}>{comments.length}</span>
        </TabButton>
        <TabButton active={tab === 'summary'} onClick={() => setTab('summary')}>
          AI Summary <span className={styles.count}>✨</span>
        </TabButton>
      </div>

      {tab === 'files' && (
        <div className={styles.filesLayout}>
          <aside className={styles.fileList}>
            {review.files.map((f, i) => (
              <button
                key={f.path}
                className={`${styles.fileItem} ${i === activeFile ? styles.fileActive : ''}`}
                onClick={() => {
                  setActiveFile(i)
                  setActiveLine(null)
                }}
              >
                <span className={styles.fileName}>{f.path.split('/').pop()}</span>
                <span className={styles.fileFlags}>{f.slopLines.length} ⚠</span>
              </button>
            ))}
            <p className={styles.hint}>Click any line to leave a comment. Hover a ⚠ line to see why it was flagged.</p>
          </aside>
          <div className={styles.codeCol}>
            <CodeBlock file={file} commentedLines={commentedLines} activeLine={activeLine} onLineClick={setActiveLine} />
            {activeLine !== null && (
              <Card className={styles.composer} title={`Comment on line ${activeLine}`}>
                <div className={styles.canned}>
                  {cannedComments.slice(0, 5).map((c) => (
                    <button key={c} className={styles.cannedChip} onClick={() => submitComment(c)}>
                      {c}
                    </button>
                  ))}
                </div>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Or write your own devastating remark…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className={styles.composerActions}>
                  <Button variant="ghost" size="sm" onClick={() => setActiveLine(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => submitComment(draft)} disabled={!draft.trim()}>
                    Post comment
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {tab === 'comments' && (
        <Card padded={comments.length === 0}>
          {comments.length === 0 ? (
            <EmptyState emoji="🦗" title="No comments yet.">
              Be the first to point out the obvious.
            </EmptyState>
          ) : (
            <ul className={styles.commentList}>
              <li className={styles.commentHeader}>{comments.length} comments</li>
              {comments.map((c) => (
                <li key={c.id} className={styles.comment}>
                  <div className={styles.commentMeta}>
                    <strong>{c.author}</strong>
                    <span>
                      on <code>{c.filePath.split('/').pop()}</code>:{c.line}
                    </span>
                    <span>· {formatRelative(c.createdAt)}</span>
                  </div>
                  <p>{c.text}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {tab === 'summary' && (
        <Card title="AI-generated summary" actions={<Badge tone="warning">Generated in 0.3s</Badge>}>
          <p className={styles.summary}>{review.aiSummary}</p>
          <ul className={styles.summaryList}>
            {aiSummaryPhrases.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className={styles.summaryFoot}>Confidence: 100%. Accuracy: not measured.</p>
        </Card>
      )}

      <Modal
        open={rejectStep !== null}
        title={rejectStep !== null ? rejectSteps[rejectStep].title : ''}
        onClose={() => setRejectStep(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectStep(null)}>
              Never mind
            </Button>
            <Button variant="danger" onClick={advanceReject}>
              {rejectStep !== null ? rejectSteps[rejectStep].confirm : ''}
            </Button>
          </>
        }
      >
        {rejectStep !== null && rejectSteps[rejectStep].body}
      </Modal>

      {confetti && (
        <div className={styles.confetti} aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} style={{ left: `${(i / 24) * 100}%`, animationDelay: `${(i % 6) * 60}ms` }} />
          ))}
        </div>
      )}
    </>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button role="tab" aria-selected={active} className={`${styles.tab} ${active ? styles.tabActive : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
