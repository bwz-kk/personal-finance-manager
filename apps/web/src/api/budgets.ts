import type { Category } from './categories'
import { api } from './client'

export interface Budget {
  id: string
  categoryId: string
  category: Category
  month: string
  limitMinor: number
  spentMinor: number
  remainingMinor: number
  progressPct: number
  isOverspent: boolean
  createdAt: string
}

export interface CreateBudgetInput {
  categoryId: string
  month: string
  limitMinor: number
}

export interface UpdateBudgetInput {
  limitMinor: number
}

export const budgetsApi = {
  list: (month: string) => api.get<Budget[]>(`/budgets?month=${month}`),
  create: (input: CreateBudgetInput) => api.post<Budget>('/budgets', input),
  update: (id: string, input: UpdateBudgetInput) => api.patch<Budget>(`/budgets/${id}`, input),
  remove: (id: string) => api.delete(`/budgets/${id}`),
}
