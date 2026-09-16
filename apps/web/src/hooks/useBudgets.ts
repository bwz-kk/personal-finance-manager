import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateBudgetInput, UpdateBudgetInput } from '../api/budgets'
import { budgetsApi } from '../api/budgets'

const BUDGETS_KEY = ['budgets']

export function useBudgets(month: string) {
  return useQuery({
    queryKey: [...BUDGETS_KEY, month],
    queryFn: () => budgetsApi.list(month),
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBudgetInput) => budgetsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBudgetInput }) =>
      budgetsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => budgetsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BUDGETS_KEY }),
  })
}
