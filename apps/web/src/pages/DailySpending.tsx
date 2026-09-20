import { useState } from 'react'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { useDashboard } from '../hooks/useDashboard'
import { useLanguage } from '../i18n/LanguageContext'
import { currentMonth, shiftMonth } from '../utils/month'
import styles from './Dashboard.module.css'

export function DailySpendingPage() {
  const { t } = useLanguage()
  const [month, setMonth] = useState(currentMonth)
  const dashboardQuery = useDashboard(month)
  const data = dashboardQuery.data

  return (
    <div>
      <div className={styles.header}>
        <h1>{t.dailySpending.title}</h1>
        <div className={styles.monthNav}>
          <button type="button" onClick={() => setMonth((m) => shiftMonth(m, -1))}>
            ‹
          </button>
          <span>{month}</span>
          <button type="button" onClick={() => setMonth((m) => shiftMonth(m, 1))}>
            ›
          </button>
        </div>
      </div>

      {dashboardQuery.isLoading && <p>{t.dailySpending.loading}</p>}
      {dashboardQuery.isError && <p className={styles.error}>{t.dailySpending.loadError}</p>}

      {data && (
        <div className={styles.bento}>
          <div className={`${styles.statCard} ${styles.hero} ${styles.span2}`}>
            <span className={styles.statLabel}>{t.dailySpending.average}</span>
            <span>
              <AnimatedNumber valueMinor={data.averageDailySpendingMinor} />
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t.dailySpending.totalExpenses}</span>
            <span className={styles.expense}>
              <AnimatedNumber valueMinor={data.period.expenseMinor} />
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
