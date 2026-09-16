import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { GoalInput } from '../api/goals'
import { goalsApi } from '../api/goals'

const GOALS_KEY = ['goals']

export function useGoals() {
  return useQuery({ queryKey: GOALS_KEY, queryFn: goalsApi.list })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: GoalInput) => goalsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<GoalInput> }) =>
      goalsApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => goalsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: GOALS_KEY }),
  })
}
