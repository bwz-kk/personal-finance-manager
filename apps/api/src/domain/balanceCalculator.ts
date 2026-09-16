import { sumMinor } from './money.js'

export interface BalanceInput {
  type: 'INCOME' | 'EXPENSE'
  amountMinor: number
}

export interface BalanceResult {
  incomeMinor: number
  expenseMinor: number
  balanceMinor: number
}

export function calculateBalance(transactions: BalanceInput[]): BalanceResult {
  const incomeMinor = sumMinor(
    transactions.filter((t) => t.type === 'INCOME').map((t) => t.amountMinor),
  )
  const expenseMinor = sumMinor(
    transactions.filter((t) => t.type === 'EXPENSE').map((t) => t.amountMinor),
  )

  return {
    incomeMinor,
    expenseMinor,
    balanceMinor: incomeMinor - expenseMinor,
  }
}
