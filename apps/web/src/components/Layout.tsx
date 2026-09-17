import { NavLink, Outlet } from 'react-router-dom'
import { LANGUAGES, useLanguage } from '../i18n/LanguageContext'
import { ErrorBoundary } from './ErrorBoundary'
import styles from './Layout.module.css'

export function Layout() {
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { to: '/', label: t.nav.dashboard, end: true },
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
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              className={lang === language ? styles.langActive : styles.langButton}
              onClick={() => setLanguage(lang)}
            >
              {lang === 'en' ? 'EN' : 'PT-BR'}
            </button>
          ))}
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
