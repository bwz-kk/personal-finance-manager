import type { WatchlistAssetClass } from '@pfm/shared'
import type { MarketPriceCache, WatchlistItem } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { isPriceStale } from '../../domain/marketFreshness.js'
import { AppError } from '../../middleware/errorHandler.js'
import { prisma } from '../../lib/prisma.js'
import type { CreateWatchlistItemInput } from '../../validation/watchlist.js'
import { bcbIndicatorProvider } from './providers/bcbIndicatorProvider.js'
import { brapiProvider } from './providers/brapiProvider.js'
import { coinGeckoProvider } from './providers/coinGeckoProvider.js'
import { exchangeRateProvider } from './providers/exchangeRateProvider.js'
import type { MarketDataProvider } from './types.js'

// The only place that knows which provider backs which asset class — see
// docs/ARCHITECTURE.md's "Market data isolation" section. Swapping a
// provider means changing one line here.
const PROVIDERS: Record<WatchlistAssetClass, MarketDataProvider> = {
  CURRENCY: exchangeRateProvider,
  CRYPTO: coinGeckoProvider,
  STOCK: brapiProvider,
  INDICATOR: bcbIndicatorProvider,
}

const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000

function withCachedPrice(item: WatchlistItem, cache: MarketPriceCache | undefined) {
  if (!cache) {
    return { ...item, price: null, asOf: null, source: null, isStale: false }
  }
  return {
    ...item,
    price: cache.price,
    asOf: cache.asOf,
    source: cache.source,
    isStale: isPriceStale(cache.asOf, new Date(), STALE_THRESHOLD_MS),
  }
}

export async function listWatchlist() {
  const items = await prisma.watchlistItem.findMany({ orderBy: { createdAt: 'asc' } })
  const caches = await prisma.marketPriceCache.findMany({
    where: { symbol: { in: items.map((i) => i.symbol) } },
  })
  const cacheBySymbol = new Map(caches.map((c) => [c.symbol, c]))
  return items.map((item) => withCachedPrice(item, cacheBySymbol.get(item.symbol)))
}

export async function createWatchlistItem(input: CreateWatchlistItemInput) {
  try {
    return await prisma.watchlistItem.create({ data: input })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, `"${input.symbol}" is already on the watchlist`)
    }
    throw err
  }
}

export async function deleteWatchlistItem(id: string) {
  const item = await prisma.watchlistItem.findUnique({ where: { id } })
  if (!item) {
    throw new AppError(404, 'Watchlist item not found')
  }
  await prisma.watchlistItem.delete({ where: { id } })
}

// Never throws on a provider failure — falls back to the cache (marked
// stale) if one exists, or to a "no price yet" result if it doesn't. This
// is what keeps one bad symbol or a provider outage from ever corrupting
// the app or failing a refresh-all batch over a single item.
async function refreshItem(item: WatchlistItem) {
  try {
    const result = await PROVIDERS[item.assetClass].fetchPrice(
      item.symbol,
      item.baseCurrency ?? 'BRL',
    )
    const cache = await prisma.marketPriceCache.upsert({
      where: { symbol: item.symbol },
      create: { symbol: item.symbol, ...result },
      update: result,
    })
    return withCachedPrice(item, cache)
  } catch {
    const cache = await prisma.marketPriceCache.findUnique({ where: { symbol: item.symbol } })
    return withCachedPrice(item, cache ?? undefined)
  }
}

export async function refreshWatchlistItem(id: string) {
  const item = await prisma.watchlistItem.findUnique({ where: { id } })
  if (!item) {
    throw new AppError(404, 'Watchlist item not found')
  }
  return refreshItem(item)
}

export async function refreshAllWatchlistItems() {
  const items = await prisma.watchlistItem.findMany()
  return Promise.all(items.map(refreshItem))
}
