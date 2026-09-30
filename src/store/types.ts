export type ReviewStatus = 'open' | 'approved' | 'changes_requested' | 'rejected'

export interface Bot {
  id: string
  name: string
  handle: string
  tagline: string
  signatureMove: string
  hue: number
}

export interface SlopLine {
  line: number
  reason: string
}

export interface ReviewFile {
  path: string
  lang: 'ts' | 'tsx' | 'js' | 'css' | 'json'
  lines: string[]
  slopLines: SlopLine[]
}

export interface Review {
  id: string
  title: string
  authorId: string
  repo: string
  linesChanged: number
  slopScore: number
  createdAt: string
  aiSummary: string
  files: ReviewFile[]
}

export interface Comment {
  id: string
  reviewId: string
  filePath: string
  line: number
  text: string
  author: string
  createdAt: string
}

export interface Settings {
  displayName: string
  email: string
  catchphrase: string
  notifications: boolean
  detectMoreSlop: boolean
  autoApprove: boolean
  darkMode: boolean
}

export interface StoreState {
  statuses: Record<string, ReviewStatus>
  comments: Comment[]
  settings: Settings
}
