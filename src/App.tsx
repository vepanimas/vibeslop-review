import { Route, Routes } from 'react-router'
import { AppShell } from './app/AppShell'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Queue } from './pages/Queue/Queue'
import { ReviewDetail } from './pages/ReviewDetail/ReviewDetail'
import { HallOfSlop } from './pages/HallOfSlop/HallOfSlop'
import { Settings } from './pages/Settings/Settings'
import { NotFound } from './pages/NotFound/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="queue" element={<Queue />} />
        <Route path="review/:id" element={<ReviewDetail />} />
        <Route path="hall-of-slop" element={<HallOfSlop />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
