import { api } from './client'

export type InvestmentPlanConstraint =
  'targetRate' | 'cappedByBuffer' | 'cappedByMaxPercent' | 'raisedToMinimum' | 'insufficientFunds'

export interface InvestmentPlan {
  month: string
  incomeMinor: number
  actualExpensesMinor: number
  expectedRecurringExpensesMinor: number
  availableMinor: number
  targetFromRateMinor: number
  maxByBufferMinor: number
  maxByPercentMinor: number
  suggestedMinor: number
  remainingBufferMinor: number
  bindingConstraint: InvestmentPlanConstraint
}

export interface PlanConfig {
  id: string
  minMonthlyInvestmentMinor: number
  targetInvestmentRate: number
  minCashBufferMinor: number
  maxPercentOfAvailableCash: number
  expectedRecurringExpensesMinor: number
  updatedAt: string
}

export type UpdatePlanConfigInput = Partial<Omit<PlanConfig, 'id' | 'updatedAt'>>

export const plannerApi = {
  getPlan: (month: string) => api.get<InvestmentPlan>(`/planner?month=${month}`),
  getConfig: () => api.get<PlanConfig>('/planner/config'),
  updateConfig: (input: UpdatePlanConfigInput) => api.patch<PlanConfig>('/planner/config', input),
}
