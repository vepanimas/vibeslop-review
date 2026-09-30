import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '../components/Button/Button'
import styles from './ErrorBoundary.module.css'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('VibeSlop crashed. Filing a ticket nobody will read.', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className={styles.crash}>
        <div className={styles.emoji}>🫠</div>
        <h1>Something went wrong.</h1>
        <p className={styles.text}>The AI has been notified. It does not care.</p>
        <pre className={styles.error}>{this.state.error.message}</pre>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => this.setState({ error: null })}>
            Reload and pretend it didn't happen
          </Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Actually reload
          </Button>
        </div>
      </div>
    )
  }
}
