import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/transactions', label: 'Transactions' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/investments', label: 'Investments' },
  { to: '/planner', label: 'Planner' },
  { to: '/goals', label: 'Goals' },
  { to: '/market', label: 'Market' },
]

export function Layout() {
  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.brand}>Personal Finance</div>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
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
      </nav>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
