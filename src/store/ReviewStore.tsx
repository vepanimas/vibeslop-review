import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Comment, ReviewStatus, Settings, StoreState } from './types'

const STORAGE_KEY = 'vibeslop:definitely-not-a-database'

const defaultSettings: Settings = {
  displayName: 'Senior Slop Inspector',
  email: 'inspector@vibeslop.dev',
  catchphrase: 'Looks good to me (it does not)',
  notifications: true,
  detectMoreSlop: false,
  autoApprove: false,
  darkMode: false,
}

const initialState: StoreState = {
  statuses: {},
  comments: [],
  settings: defaultSettings,
}

type Action =
  | { type: 'setStatus'; reviewId: string; status: ReviewStatus }
  | { type: 'addComment'; comment: Comment }
  | { type: 'updateSettings'; patch: Partial<Settings> }
  | { type: 'resetAll' }

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'setStatus':
      return { ...state, statuses: { ...state.statuses, [action.reviewId]: action.status } }
    case 'addComment':
      return { ...state, comments: [...state.comments, action.comment] }
    case 'updateSettings':
      return { ...state, settings: { ...state.settings, ...action.patch } }
    case 'resetAll':
      return initialState
  }
}

function load(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<StoreState>
    return {
      statuses: parsed.statuses ?? {},
      comments: parsed.comments ?? [],
      settings: { ...defaultSettings, ...parsed.settings },
    }
  } catch {
    return initialState
  }
}

interface StoreApi {
  state: StoreState
  setStatus: (reviewId: string, status: ReviewStatus) => void
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void
  updateSettings: (patch: Partial<Settings>) => void
  resetAll: () => void
}

const StoreContext = createContext<StoreApi | null>(null)

export function ReviewStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // The database is a localStorage key. It has failed us. Move on.
    }
  }, [state])

  const api = useMemo<StoreApi>(
    () => ({
      state,
      setStatus: (reviewId, status) => dispatch({ type: 'setStatus', reviewId, status }),
      addComment: (comment) =>
        dispatch({
          type: 'addComment',
          comment: {
            ...comment,
            id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
            createdAt: new Date().toISOString(),
          },
        }),
      updateSettings: (patch) => dispatch({ type: 'updateSettings', patch }),
      resetAll: () => dispatch({ type: 'resetAll' }),
    }),
    [state],
  )

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside ReviewStoreProvider')
  return ctx
}
