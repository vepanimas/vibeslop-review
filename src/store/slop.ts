export type SlopTone = 'success' | 'warning' | 'danger' | 'neutral'

export function slopLabel(score: number): string {
  if (score >= 90) return 'Certified Slop'
  if (score >= 75) return 'Heavy Slop'
  if (score >= 50) return 'Moderate Slop'
  if (score >= 25) return 'Mild Slop'
  return 'Suspiciously Fine'
}

/** Maps a slop score to a badge tone. */
export function slopTone(score: number): SlopTone {
  if (score >= 90) return 'success'
  if (score >= 75) return 'danger'
  if (score >= 50) return 'warning'
  return 'neutral'
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'approved':
      return 'Approved'
    case 'changes_requested':
      return 'Changes requested'
    case 'rejected':
      return 'Rejected'
    default:
      return 'Open'
  }
}

export function statusTone(status: string): SlopTone {
  switch (status) {
    case 'approved':
      return 'success'
    case 'changes_requested':
      return 'warning'
    case 'rejected':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}
