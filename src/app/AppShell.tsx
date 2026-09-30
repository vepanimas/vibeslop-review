import { NavLink, Outlet, useLocation } from 'react-router'
import { ErrorBoundary } from './ErrorBoundary'
import { useStore } from '../store/ReviewStore'
import styles from './AppShell.module.css'

const nav = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/queue', label: 'Review Queue', icon: '📥' },
  { to: '/hall-of-slop', label: 'Hall of Slop', icon: '🏆' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export function AppShell() {
  const { state } = useStore()
  const location = useLocation()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img src="/favicon.svg" alt="" width={28} height={28} />
          <div>
            <div className={styles.brandName}>VibeSlop Review</div>
            <div className={styles.brandSub}>Certified Slop Inspector</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.user}>
            <div className={styles.userAvatar}>{state.settings.displayName.slice(0, 1)}</div>
            <div className={styles.userMeta}>
              <div className={styles.userName}>{state.settings.displayName}</div>
              <div className={styles.userRole}>Reviewer · Level 3</div>
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.crumb}>{crumbFor(location.pathname)}</div>
          <div className={styles.topbarRight}>
            <span className={styles.statusDot} /> All systems slopping
          </div>
        </header>
        <main className={styles.content}>
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
        <footer className={styles.footer}>© 2023 VibeSlop Inc. · Reviewing slop so you don't have to.</footer>
      </div>
    </div>
  )
}

function crumbFor(path: string): string {
  if (path === '/') return 'Dashboard'
  if (path.startsWith('/queue')) return 'Review Queue'
  if (path.startsWith('/review/')) return 'Review Queue / ' + path.split('/')[2]
  if (path.startsWith('/hall-of-slop')) return 'Hall of Slop'
  if (path.startsWith('/settings')) return 'Settings'
  return 'Unknown territory'
}
