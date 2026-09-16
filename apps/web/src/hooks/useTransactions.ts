import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { TransactionFilters, TransactionInput } from '../api/transactions'
import { transactionsApi } from '../api/transactions'

const TRANSACTIONS_KEY = ['transactions']
const SUMMARY_KEY = ['transactions', 'summary']

function invalidateTransactions(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
}

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: [...TRANSACTIONS_KEY, filters],
    queryFn: () => transactionsApi.list(filters),
  })
}

export function useTransactionSummary(filters: Pick<TransactionFilters, 'dateFrom' | 'dateTo'>) {
  return useQuery({
    queryKey: [...SUMMARY_KEY, filters],
    queryFn: () => transactionsApi.summary(filters),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TransactionInput) => transactionsApi.create(input),
    onSuccess: () => invalidateTransactions(queryClient),
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TransactionInput> }) =>
      transactionsApi.update(id, input),
    onSuccess: () => invalidateTransactions(queryClient),
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transactionsApi.remove(id),
    onSuccess: () => invalidateTransactions(queryClient),
  })
}
