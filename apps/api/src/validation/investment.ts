import { ASSET_TYPES } from '@pfm/shared'
import { z } from 'zod'

export const createInvestmentSchema = z.object({
  name: z.string().trim().min(1).max(200),
  assetType: z.enum(ASSET_TYPES),
  institution: z.string().trim().max(200).optional(),
  currency: z.string().trim().min(1).max(10),
  purchaseDate: z.coerce.date().optional(),
  currentValueMinor: z.number().int().nonnegative().optional(),
  watchlistSymbol: z.string().trim().max(20).optional(),
  cdiPercent: z.number().positive().optional(),
  notes: z.string().trim().max(1000).optional(),
})

export const updateInvestmentSchema = createInvestmentSchema.partial()

export const investmentIdParamSchema = z.object({
  id: z.string().min(1),
})

export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>
export type UpdateInvestmentInput = z.infer<typeof updateInvestmentSchema>
