import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './i18n/LanguageContext'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/Dashboard'
import { DailySpendingPage } from './pages/DailySpending'
import { TransactionsPage } from './pages/Transactions'
import { BudgetsPage } from './pages/Budgets'
import { InvestmentsPage } from './pages/Investments'
import { PlannerPage } from './pages/Planner'
import { GoalsPage } from './pages/Goals'
import { MarketPage } from './pages/Market'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="daily-spending" element={<DailySpendingPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="investments" element={<InvestmentsPage />} />
              <Route path="planner" element={<PlannerPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="market" element={<MarketPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App
