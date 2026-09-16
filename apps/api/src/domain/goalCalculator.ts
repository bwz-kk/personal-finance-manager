export interface GoalProgress {
  targetAmountMinor: number
  currentAmountMinor: number
  remainingMinor: number
  progressPct: number
  isComplete: boolean
}

export function calculateGoalProgress(
  targetAmountMinor: number,
  currentAmountMinor: number,
): GoalProgress {
  const remainingMinor = Math.max(0, targetAmountMinor - currentAmountMinor)
  const progressPct =
    targetAmountMinor > 0
      ? Math.min(100, Math.round((currentAmountMinor / targetAmountMinor) * 100))
      : 0

  return {
    targetAmountMinor,
    currentAmountMinor,
    remainingMinor,
    progressPct,
    isComplete: currentAmountMinor >= targetAmountMinor && targetAmountMinor > 0,
  }
}
