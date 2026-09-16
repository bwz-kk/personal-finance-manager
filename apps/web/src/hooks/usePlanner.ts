import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdatePlanConfigInput } from '../api/planner'
import { plannerApi } from '../api/planner'

export function usePlan(month: string) {
  return useQuery({ queryKey: ['planner', month], queryFn: () => plannerApi.getPlan(month) })
}

export function usePlanConfig() {
  return useQuery({ queryKey: ['planner', 'config'], queryFn: plannerApi.getConfig })
}

export function useUpdatePlanConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdatePlanConfigInput) => plannerApi.updateConfig(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['planner'] }),
  })
}
