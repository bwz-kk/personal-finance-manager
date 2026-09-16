import { INVESTMENT_TRANSACTION_TYPES } from '@pfm/shared'
import { z } from 'zod'

const decimalString = z
  .string()
  .trim()
  .regex(/^\d+(\.\d+)?$/, 'Must be a positive decimal number')

export const createInvestmentTransactionSchema = z.object({
  type: z.enum(INVESTMENT_TRANSACTION_TYPES),
  amountMinor: z.number().int().positive(),
  quantity: decimalString.optional(),
  pricePerUnitMinor: z.number().int().positive().optional(),
  date: z.coerce.date(),
  notes: z.string().trim().max(1000).optional(),
})

export const investmentTransactionParamsSchema = z.object({
  id: z.string().min(1),
  transactionId: z.string().min(1),
})

export const investmentIdOnlyParamSchema = z.object({
  id: z.string().min(1),
})

export type CreateInvestmentTransactionInput = z.infer<typeof createInvestmentTransactionSchema>
