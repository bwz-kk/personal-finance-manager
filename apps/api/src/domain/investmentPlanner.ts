// The investment-planner recommendation is the app's most important feature
// (per SPEC.md) and is NOT financial advice — it's a configurable calculator
// over the user's own numbers. Every output must be explainable: this module
// reports which constraint determined the final suggested amount.

export interface InvestmentPlanConfigInput {
  /** Floor: never suggest less than this if there's room for it. */
  minMonthlyInvestmentMinor: number
  /** Target: suggested = income * this rate, before constraints. 0..1 */
  targetInvestmentRate: number
  /** Minimum cash that must remain available after investing. */
  minCashBufferMinor: number
  /** Ceiling: suggested can never exceed available cash * this rate. 0..1 */
  maxPercentOfAvailableCash: number
  /** Anticipated expenses not yet reflected in actual transactions this
   * month (e.g. a bill due later), reserved out of available cash. */
  expectedRecurringExpensesMinor: number
}

export interface InvestmentPlanInput {
  incomeMinor: number
  actualExpensesMinor: number
  config: InvestmentPlanConfigInput
}

export type InvestmentPlanConstraint =
  'targetRate' | 'cappedByBuffer' | 'cappedByMaxPercent' | 'raisedToMinimum' | 'insufficientFunds'

export interface InvestmentPlanResult {
  incomeMinor: number
  actualExpensesMinor: number
  expectedRecurringExpensesMinor: number
  availableMinor: number
  targetFromRateMinor: number
  maxByBufferMinor: number
  maxByPercentMinor: number
  suggestedMinor: number
  remainingBufferMinor: number
  bindingConstraint: InvestmentPlanConstraint
}

export function calculateInvestmentPlan(input: InvestmentPlanInput): InvestmentPlanResult {
  const { incomeMinor, actualExpensesMinor, config } = input

  const availableMinor = incomeMinor - actualExpensesMinor - config.expectedRecurringExpensesMinor

  const targetFromRateMinor = Math.round(incomeMinor * config.targetInvestmentRate)
  const maxByBufferMinor = Math.max(0, availableMinor - config.minCashBufferMinor)
  const maxByPercentMinor = Math.max(
    0,
    Math.round(availableMinor * config.maxPercentOfAvailableCash),
  )

  // The suggestion is the most restrictive of: what the target rate wants,
  // what leaves the buffer intact, and what the max-percent ceiling allows.
  const candidates: { value: number; constraint: InvestmentPlanConstraint }[] = [
    { value: maxByBufferMinor, constraint: 'cappedByBuffer' },
    { value: maxByPercentMinor, constraint: 'cappedByMaxPercent' },
    { value: targetFromRateMinor, constraint: 'targetRate' },
  ]
  const binding = candidates.reduce((min, c) => (c.value < min.value ? c : min))

  let suggestedMinor = Math.max(0, binding.value)
  let bindingConstraint: InvestmentPlanConstraint = binding.constraint

  if (availableMinor <= 0) {
    suggestedMinor = 0
    bindingConstraint = 'insufficientFunds'
  } else if (suggestedMinor < config.minMonthlyInvestmentMinor) {
    // Only raise to the floor if there's actually room under the buffer cap
    // — a configured minimum never forces investing money that isn't there.
    const raised = Math.min(config.minMonthlyInvestmentMinor, maxByBufferMinor)
    if (raised > suggestedMinor) {
      suggestedMinor = raised
      // Only really "raised to the minimum" if the buffer had room for the
      // full configured floor — otherwise the buffer is still what's binding.
      bindingConstraint =
        raised === config.minMonthlyInvestmentMinor ? 'raisedToMinimum' : 'cappedByBuffer'
    }
  }

  const remainingBufferMinor = availableMinor - suggestedMinor

  return {
    incomeMinor,
    actualExpensesMinor,
    expectedRecurringExpensesMinor: config.expectedRecurringExpensesMinor,
    availableMinor,
    targetFromRateMinor,
    maxByBufferMinor,
    maxByPercentMinor,
    suggestedMinor,
    remainingBufferMinor,
    bindingConstraint,
  }
}
