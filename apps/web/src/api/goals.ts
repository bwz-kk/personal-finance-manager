import { api } from './client'

export interface Goal {
  id: string
  name: string
  targetAmountMinor: number
  currentAmountMinor: number
  targetDate: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  remainingMinor: number
  progressPct: number
  isComplete: boolean
}

export interface GoalInput {
  name: string
  targetAmountMinor: number
  currentAmountMinor?: number
  targetDate?: string
  notes?: string
}

export const goalsApi = {
  list: () => api.get<Goal[]>('/goals'),
  create: (input: GoalInput) => api.post<Goal>('/goals', input),
  update: (id: string, input: Partial<GoalInput>) => api.patch<Goal>(`/goals/${id}`, input),
  remove: (id: string) => api.delete(`/goals/${id}`),
}
