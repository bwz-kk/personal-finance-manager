import type { Request, Response } from 'express'
import { createWatchlistItemSchema, watchlistIdParamSchema } from '../validation/watchlist.js'
import * as marketService from '../services/market/marketService.js'

export async function listWatchlist(_req: Request, res: Response) {
  res.json(await marketService.listWatchlist())
}

export async function createWatchlistItem(req: Request, res: Response) {
  const input = createWatchlistItemSchema.parse(req.body)
  const item = await marketService.createWatchlistItem(input)
  res.status(201).json(item)
}

export async function removeWatchlistItem(req: Request, res: Response) {
  const { id } = watchlistIdParamSchema.parse(req.params)
  await marketService.deleteWatchlistItem(id)
  res.status(204).send()
}

export async function refreshWatchlistItem(req: Request, res: Response) {
  const { id } = watchlistIdParamSchema.parse(req.params)
  res.json(await marketService.refreshWatchlistItem(id))
}

export async function refreshAll(_req: Request, res: Response) {
  res.json(await marketService.refreshAllWatchlistItems())
}
