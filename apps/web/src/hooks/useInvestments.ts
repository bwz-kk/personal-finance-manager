import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { InvestmentInput, InvestmentTransactionInput } from '../api/investments'
import { investmentsApi } from '../api/investments'

const INVESTMENTS_KEY = ['investments']
const PORTFOLIO_KEY = ['portfolio']
const DETAIL_KEY = (id: string) => ['investments', id]

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: INVESTMENTS_KEY })
  queryClient.invalidateQueries({ queryKey: PORTFOLIO_KEY })
  // Adding/removing a BRL investment transaction can create/delete a linked
  // cash Transaction, so cash balance and the transaction list may change.
  queryClient.invalidateQueries({ queryKey: ['transactions'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
}

export function useInvestments() {
  return useQuery({ queryKey: INVESTMENTS_KEY, queryFn: investmentsApi.list })
}

export function useInvestment(id: string | null) {
  return useQuery({
    queryKey: DETAIL_KEY(id ?? ''),
    queryFn: () => investmentsApi.get(id!),
    enabled: id !== null,
  })
}

export function usePortfolio() {
  return useQuery({ queryKey: PORTFOLIO_KEY, queryFn: investmentsApi.portfolio })
}

export function useCreateInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: InvestmentInput) => investmentsApi.create(input),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useUpdateInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<InvestmentInput> }) =>
      investmentsApi.update(id, input),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => investmentsApi.remove(id),
    onSuccess: () => invalidateAll(queryClient),
  })
}

export function useAddInvestmentTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      investmentId,
      input,
    }: {
      investmentId: string
      input: InvestmentTransactionInput
    }) => investmentsApi.addTransaction(investmentId, input),
    onSuccess: (_data, { investmentId }) => {
      invalidateAll(queryClient)
      queryClient.invalidateQueries({ queryKey: DETAIL_KEY(investmentId) })
    },
  })
}

export function useRemoveInvestmentTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      investmentId,
      transactionId,
    }: {
      investmentId: string
      transactionId: string
    }) => investmentsApi.removeTransaction(investmentId, transactionId),
    onSuccess: (_data, { investmentId }) => {
      invalidateAll(queryClient)
      queryClient.invalidateQueries({ queryKey: DETAIL_KEY(investmentId) })
    },
  })
}
