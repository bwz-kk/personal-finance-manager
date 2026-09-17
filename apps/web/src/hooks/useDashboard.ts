import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard'

export function useDashboard(month: string) {
  return useQuery({ queryKey: ['dashboard', month], queryFn: () => dashboardApi.get(month) })
}
