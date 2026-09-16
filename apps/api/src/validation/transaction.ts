import { TRANSACTION_TYPES } from '@pfm/shared'
import { z } from 'zod'

export const createTransactionSchema = z.object({
  type: z.enum(TRANSACTION_TYPES),
  amountMinor: z.number().int().positive(),
  currency: z.string().trim().length(3).default('BRL'),
  description: z.string().trim().min(1).max(200),
  date: z.coerce.date(),
  categoryId: z.string().min(1),
  notes: z.string().trim().max(1000).optional(),
})

export const updateTransactionSchema = createTransactionSchema.partial()

export const transactionIdParamSchema = z.object({
  id: z.string().min(1),
})

const sortableFields = ['date', 'amountMinor', 'description'] as const

export const transactionQuerySchema = z.object({
  type: z.enum(TRANSACTION_TYPES).optional(),
  categoryId: z.string().min(1).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(sortableFields).default('date'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionQuery = z.infer<typeof transactionQuerySchema>
