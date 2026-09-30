import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import styles from './Toast.module.css'

type Tone = 'info' | 'success' | 'danger'

interface ToastItem {
  id: number
  message: string
  tone: Tone
}

interface ToastApi {
  toast: (message: string, tone?: Tone) => void
}

const ToastContext = createContext<ToastApi | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, tone: Tone = 'info') => {
    const id = nextId++
    setItems((prev) => [...prev, { id, message, tone }])
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  const api = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.host} aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.tone]}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
