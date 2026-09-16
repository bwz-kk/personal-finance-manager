export interface BudgetProgress {
  limitMinor: number
  spentMinor: number
  remainingMinor: number
  progressPct: number
  isOverspent: boolean
}

export function calculateBudgetProgress(limitMinor: number, spentMinor: number): BudgetProgress {
  const remainingMinor = limitMinor - spentMinor
  const progressPct = limitMinor > 0 ? Math.round((spentMinor / limitMinor) * 100) : 0

  return {
    limitMinor,
    spentMinor,
    remainingMinor,
    progressPct,
    isOverspent: spentMinor > limitMinor,
  }
}
