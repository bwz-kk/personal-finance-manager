import { Router } from 'express'
import * as marketController from '../controllers/marketController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const marketRouter = Router()

marketRouter.get('/watchlist', asyncHandler(marketController.listWatchlist))
marketRouter.post('/watchlist', asyncHandler(marketController.createWatchlistItem))
marketRouter.delete('/watchlist/:id', asyncHandler(marketController.removeWatchlistItem))
marketRouter.post('/watchlist/:id/refresh', asyncHandler(marketController.refreshWatchlistItem))
marketRouter.post('/refresh-all', asyncHandler(marketController.refreshAll))
