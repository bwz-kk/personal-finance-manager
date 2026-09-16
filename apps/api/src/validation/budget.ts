import { z } from 'zod'

export const monthSchema = z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in "YYYY-MM" format')

export const createBudgetSchema = z.object({
  categoryId: z.string().min(1),
  month: monthSchema,
  limitMinor: z.number().int().positive(),
})

export const updateBudgetSchema = z.object({
  limitMinor: z.number().int().positive(),
})

export const budgetIdParamSchema = z.object({
  id: z.string().min(1),
})

export const budgetQuerySchema = z.object({
  month: monthSchema.optional(),
})

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>
