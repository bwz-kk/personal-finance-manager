import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
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

          {data.spendingByCategory.map((s) => (
            <div key={s.categoryId} className={styles.statCard}>
              <span className={styles.statLabel}>{s.categoryName}</span>
              <span className={styles.expense}>
                <AnimatedNumber valueMinor={s.averageDailyMinor} />
              </span>
            </div>
          ))}

          <div className={`${styles.chartCard} ${styles.span2}`}>
            <h2>{t.dailySpending.byCategory}</h2>
            {data.spendingByCategory.length === 0 ? (
              <p className={styles.empty}>{t.dailySpending.noSpending}</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={data.spendingByCategory.map((s) => ({
                    name: s.categoryName,
                    value: s.averageDailyMinor / 100,
                  }))}
                  margin={{ bottom: 32 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  />
                  <Bar dataKey="value" fill="var(--danger)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
