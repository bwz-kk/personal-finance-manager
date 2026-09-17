import { WATCHLIST_ASSET_CLASSES } from '@pfm/shared'
import { z } from 'zod'

export const createWatchlistItemSchema = z.object({
  symbol: z.string().trim().min(1).max(20),
  label: z.string().trim().min(1).max(100),
  assetClass: z.enum(WATCHLIST_ASSET_CLASSES),
  baseCurrency: z.string().trim().min(1).max(10).optional(),
})

export const watchlistIdParamSchema = z.object({
  id: z.string().min(1),
})

export type CreateWatchlistItemInput = z.infer<typeof createWatchlistItemSchema>
