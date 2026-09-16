import type { TransactionType } from '@pfm/shared'
import type { Category } from './categories'
import { api } from './client'

export interface Transaction {
  id: string
  type: TransactionType
  amountMinor: number
  currency: string
  description: string
  date: string
  categoryId: string
  category: Category
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface TransactionInput {
  type: TransactionType
  amountMinor: number
  description: string
  date: string
  categoryId: string
  notes?: string
}

export interface TransactionFilters {
  type?: TransactionType
  categoryId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  sortBy?: 'date' | 'amountMinor' | 'description'
  sortDir?: 'asc' | 'desc'
}

export interface BalanceSummary {
  incomeMinor: number
  expenseMinor: number
  balanceMinor: number
}

function toQueryString(filters: TransactionFilters): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const transactionsApi = {
  list: (filters: TransactionFilters = {}) =>
    api.get<Transaction[]>(`/transactions${toQueryString(filters)}`),
  summary: (filters: Pick<TransactionFilters, 'dateFrom' | 'dateTo' | 'categoryId'> = {}) =>
    api.get<BalanceSummary>(`/transactions/summary${toQueryString(filters)}`),
  create: (input: TransactionInput) => api.post<Transaction>('/transactions', input),
  update: (id: string, input: Partial<TransactionInput>) =>
    api.patch<Transaction>(`/transactions/${id}`, input),
  remove: (id: string) => api.delete(`/transactions/${id}`),
}
