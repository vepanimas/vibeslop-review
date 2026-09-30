import { Link } from 'react-router'
import { EmptyState } from '../../components/EmptyState/EmptyState'

export function NotFound() {
  return (
    <EmptyState emoji="👻" title="This page was hallucinated.">
      The AI was very confident it existed. <Link to="/">Back to the dashboard</Link>.
    </EmptyState>
  )
}
