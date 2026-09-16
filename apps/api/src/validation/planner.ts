import { z } from 'zod'
import { monthSchema } from './budget.js'

const rateSchema = z.number().min(0).max(1)

export const updatePlanConfigSchema = z.object({
  minMonthlyInvestmentMinor: z.number().int().nonnegative().optional(),
  targetInvestmentRate: rateSchema.optional(),
  minCashBufferMinor: z.number().int().nonnegative().optional(),
  maxPercentOfAvailableCash: rateSchema.optional(),
  expectedRecurringExpensesMinor: z.number().int().nonnegative().optional(),
})

export const planQuerySchema = z.object({
  month: monthSchema.optional(),
})

export type UpdatePlanConfigInput = z.infer<typeof updatePlanConfigSchema>
