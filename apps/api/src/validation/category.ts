import { TRANSACTION_TYPES } from '@pfm/shared'
import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: z.enum(TRANSACTION_TYPES),
})

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
})

export const categoryIdParamSchema = z.object({
  id: z.string().min(1),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
