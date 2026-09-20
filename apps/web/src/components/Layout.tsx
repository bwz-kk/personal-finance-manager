import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { ErrorBoundary } from './ErrorBoundary'
import { LanguageDialog } from './LanguageDialog'
import styles from './Layout.module.css'

export function Layout() {
  const { t } = useLanguage()

  const navItems = [
    { to: '/', label: t.nav.dashboard, end: true },
    { to: '/daily-spending', label: t.nav.dailySpending },
    { to: '/transactions', label: t.nav.transactions },
    { to: '/budgets', label: t.nav.budgets },
    { to: '/investments', label: t.nav.investments },
    { to: '/planner', label: t.nav.planner },
    { to: '/goals', label: t.nav.goals },
    { to: '/market', label: t.nav.market },
  ]

  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.brand}>Personal Finance</div>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.languageSwitch}>
          <LanguageDialog />
        </div>
      </nav>
      <main className={styles.content}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
