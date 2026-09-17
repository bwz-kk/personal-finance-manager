import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { WatchlistItemInput } from '../api/market'
import { marketApi } from '../api/market'

const WATCHLIST_KEY = ['watchlist']

export function useWatchlist() {
  return useQuery({ queryKey: WATCHLIST_KEY, queryFn: marketApi.list })
}

export function useCreateWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: WatchlistItemInput) => marketApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY }),
  })
}

export function useDeleteWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => marketApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY }),
  })
}

export function useRefreshWatchlistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => marketApi.refresh(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY }),
  })
}

export function useRefreshAllWatchlist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => marketApi.refreshAll(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY }),
  })
}
