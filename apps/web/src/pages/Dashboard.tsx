import { formatMinorUnits } from '@pfm/shared'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { useDashboard } from '../hooks/useDashboard'
import { useLanguage } from '../i18n/LanguageContext'
import { currentMonth, shiftMonth } from '../utils/month'
import styles from './Dashboard.module.css'

// One small fixed palette for categorical charts (spending by category,
// portfolio allocation) — this app has no design-token system for charts
// yet, so this stays local rather than inventing one (see design/README.md
// for the separate, not-yet-wired visual design track).
const CHART_COLORS = ['#2f6fed', '#1f9254', '#d1373f', '#b98900', '#7c5cff', '#0aa3a3']

function fmt(minor: number, currency = 'BRL') {
  return formatMinorUnits(minor, currency)
}

export function DashboardPage() {
  const { t } = useLanguage()
  const [month, setMonth] = useState(currentMonth)
  const dashboardQuery = useDashboard(month)
  const data = dashboardQuery.data

  return (
    <div>
      <div className={styles.header}>
        <h1>{t.dashboard.title}</h1>
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

      {dashboardQuery.isLoading && <p>{t.dashboard.loading}</p>}
      {dashboardQuery.isError && <p className={styles.error}>{t.dashboard.loadError}</p>}

      {data && (
        <div className={styles.bento}>
          <StatCard
            label={t.dashboard.cashBalance}
            valueMinor={data.cashBalanceMinor}
            hero
            span={2}
          />
          <StatCard label={t.dashboard.income} valueMinor={data.period.incomeMinor} tone="income" />
          <StatCard
            label={t.dashboard.expenses}
            valueMinor={data.period.expenseMinor}
            tone="expense"
          />

          {data.portfolio.groups.map((g) => (
            <StatCard
              key={`pv-${g.currency}`}
              label={`${t.dashboard.portfolioValue} (${g.currency})`}
              valueMinor={g.currentValueMinor}
              currency={g.currency}
            />
          ))}
          {data.portfolio.groups.map((g) => (
            <StatCard
              key={`inv-${g.currency}`}
              label={`${t.dashboard.invested} (${g.currency})`}
              valueMinor={g.totalInvestedMinor}
              currency={g.currency}
            />
          ))}
          <StatCard label={t.dashboard.available} valueMinor={data.plan.availableMinor} />
          <StatCard
            label={t.dashboard.suggestedInvestment}
            valueMinor={data.plan.suggestedMinor}
            tone="accent"
          />

          <ChartCard title={t.dashboard.incomeVsExpenses} span={2}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[
                  { name: t.dashboard.income, value: data.period.incomeMinor / 100 },
                  { name: t.dashboard.expenses, value: data.period.expenseMinor / 100 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                />
                <Bar dataKey="value">
                  <Cell fill="var(--success)" />
                  <Cell fill="var(--danger)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t.dashboard.monthlyTrend} span={2}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={data.monthlyTrend.map((m) => ({
                  month: m.month,
                  [t.dashboard.income]: m.incomeMinor / 100,
                  [t.dashboard.expenses]: m.expenseMinor / 100,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                />
                <Legend />
                <Line type="monotone" dataKey={t.dashboard.income} stroke="var(--success)" />
                <Line type="monotone" dataKey={t.dashboard.expenses} stroke="var(--danger)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t.dashboard.spendingByCategory} span={2}>
            {data.spendingByCategory.length === 0 ? (
              <p className={styles.empty}>{t.dashboard.noSpending}</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.spendingByCategory.map((s) => ({
                      name: s.categoryName,
                      value: s.amountMinor / 100,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {data.spendingByCategory.map((s, i) => (
                      <Cell key={s.categoryId} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title={t.dashboard.portfolioAllocation} span={2}>
            {data.portfolio.groups.length === 0 ? (
              <p className={styles.empty}>{t.dashboard.noInvestments}</p>
            ) : (
              data.portfolio.groups.map((g) => (
                <div key={g.currency} className={styles.allocationGroup}>
                  <span className={styles.allocationCurrency}>{g.currency}</span>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={g.allocation.map((a) => ({
                          name: a.name,
                          value: a.currentValueMinor / 100,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={70}
                        label
                      >
                        {g.allocation.map((a, i) => (
                          <Cell key={a.investmentId} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))
            )}
          </ChartCard>

          <ChartCard title={t.dashboard.investmentContributions} span={2}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data.investmentContributionsByMonth.map((m) => ({
                  month: m.month,
                  value: m.netContributedMinor / 100,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                />
                <Bar dataKey="value" fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ListCard title={t.dashboard.budgetStatus} span={2}>
            {data.budgets.length === 0 ? (
              <p className={styles.empty}>{t.dashboard.noBudgets}</p>
            ) : (
              data.budgets.map((b) => (
                <div key={b.id} className={styles.budgetRow}>
                  <span>{b.category.name}</span>
                  <div className={styles.progressBar}>
                    <div
                      className={b.isOverspent ? styles.progressFillOver : styles.progressFill}
                      style={{ width: `${Math.min(b.progressPct, 100)}%` }}
                    />
                  </div>
                  <span className={styles.budgetPct}>{b.progressPct}%</span>
                </div>
              ))
            )}
          </ListCard>

          <ListCard title={t.dashboard.recentTransactions} span={2}>
            {data.recentTransactions.length === 0 ? (
              <p className={styles.empty}>{t.dashboard.noTransactions}</p>
            ) : (
              data.recentTransactions.map((tx) => (
                <div key={tx.id} className={styles.txRow}>
                  <span>{tx.date.slice(0, 10)}</span>
                  <span className={styles.txDescription}>{tx.description}</span>
                  <span className={tx.type === 'INCOME' ? styles.income : styles.expense}>
                    {tx.type === 'INCOME' ? '+' : '-'}
                    {fmt(tx.amountMinor, tx.currency)}
                  </span>
                </div>
              ))
            )}
          </ListCard>

          <ListCard title={t.dashboard.watchlist} span={2}>
            {data.watchlist.length === 0 ? (
              <p className={styles.empty}>{t.dashboard.noWatchlist}</p>
            ) : (
              data.watchlist.map((item) => (
                <div key={item.id} className={styles.watchRow}>
                  <span>{item.symbol}</span>
                  <span>{item.price ?? '—'}</span>
                </div>
              ))
            )}
          </ListCard>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  valueMinor,
  currency,
  tone,
  hero,
  span,
}: {
  label: string
  valueMinor: number
  currency?: string
  tone?: 'income' | 'expense' | 'accent'
  hero?: boolean
  span?: 2
}) {
  const className = [styles.statCard, hero && styles.hero, span === 2 && styles.span2]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={className}>
      <span className={styles.statLabel}>{label}</span>
      <span className={tone ? styles[tone] : undefined}>
        <AnimatedNumber valueMinor={valueMinor} currency={currency} />
      </span>
    </div>
  )
}

function ChartCard({
  title,
  span,
  children,
}: {
  title: string
  span?: 2
  children: React.ReactNode
}) {
  const className = [styles.chartCard, span === 2 && styles.span2].filter(Boolean).join(' ')
  return (
    <div className={className}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

function ListCard({
  title,
  span,
  children,
}: {
  title: string
  span?: 2
  children: React.ReactNode
}) {
  const className = [styles.listCard, span === 2 && styles.span2].filter(Boolean).join(' ')
  return (
    <div className={className}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
