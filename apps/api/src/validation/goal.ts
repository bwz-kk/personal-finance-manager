import { z } from 'zod'

export const createGoalSchema = z.object({
  name: z.string().trim().min(1).max(200),
  targetAmountMinor: z.number().int().positive(),
  currentAmountMinor: z.number().int().nonnegative().default(0),
  targetDate: z.coerce.date().optional(),
  notes: z.string().trim().max(1000).optional(),
})

export const updateGoalSchema = createGoalSchema.partial()

export const goalIdParamSchema = z.object({
  id: z.string().min(1),
})

export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
