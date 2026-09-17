import type { WatchlistAssetClass } from '@pfm/shared'
import { api } from './client'

export interface WatchlistItem {
  id: string
  symbol: string
  label: string
  assetClass: WatchlistAssetClass
  baseCurrency: string | null
  createdAt: string
  price: string | null
  asOf: string | null
  source: string | null
  isStale: boolean
}

export interface WatchlistItemInput {
  symbol: string
  label: string
  assetClass: WatchlistAssetClass
  baseCurrency?: string
}

export const marketApi = {
  list: () => api.get<WatchlistItem[]>('/market/watchlist'),
  create: (input: WatchlistItemInput) => api.post<WatchlistItem>('/market/watchlist', input),
  remove: (id: string) => api.delete(`/market/watchlist/${id}`),
  refresh: (id: string) => api.post<WatchlistItem>(`/market/watchlist/${id}/refresh`, {}),
  refreshAll: () => api.post<WatchlistItem[]>('/market/refresh-all', {}),
}
