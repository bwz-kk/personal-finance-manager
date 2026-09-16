import { decimalInputToMinorUnits, minorUnitsToDecimalInput } from '@pfm/shared'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { PlanConfig, UpdatePlanConfigInput } from '../api/planner'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './TransactionForm.module.css'

interface PlannerConfigFormProps {
  config: PlanConfig
  onSubmit: (input: UpdatePlanConfigInput) => void
  submitting?: boolean
  saved?: boolean
}

function rateToPercentInput(rate: number): string {
  return (rate * 100).toString()
}

export function PlannerConfigForm({ config, onSubmit, submitting, saved }: PlannerConfigFormProps) {
  const { t } = useLanguage()
  const [minMonthlyInvestment, setMinMonthlyInvestment] = useState(
    minorUnitsToDecimalInput(config.minMonthlyInvestmentMinor),
  )
  const [targetRatePct, setTargetRatePct] = useState(
    rateToPercentInput(config.targetInvestmentRate),
  )
  const [minCashBuffer, setMinCashBuffer] = useState(
    minorUnitsToDecimalInput(config.minCashBufferMinor),
  )
  const [maxPercentPct, setMaxPercentPct] = useState(
    rateToPercentInput(config.maxPercentOfAvailableCash),
  )
  const [expectedRecurring, setExpectedRecurring] = useState(
    minorUnitsToDecimalInput(config.expectedRecurringExpensesMinor),
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      minMonthlyInvestmentMinor: decimalInputToMinorUnits(minMonthlyInvestment),
      targetInvestmentRate: Number.parseFloat(targetRatePct) / 100,
      minCashBufferMinor: decimalInputToMinorUnits(minCashBuffer),
      maxPercentOfAvailableCash: Number.parseFloat(maxPercentPct) / 100,
      expectedRecurringExpensesMinor: decimalInputToMinorUnits(expectedRecurring),
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        {t.planner.minMonthlyInvestment}
        <input
          type="number"
          step="0.01"
          min="0"
          value={minMonthlyInvestment}
          onChange={(e) => setMinMonthlyInvestment(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.planner.targetInvestmentRate}
        <input
          type="number"
          step="1"
          min="0"
          max="100"
          value={targetRatePct}
          onChange={(e) => setTargetRatePct(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.planner.minCashBuffer}
        <input
          type="number"
          step="0.01"
          min="0"
          value={minCashBuffer}
          onChange={(e) => setMinCashBuffer(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.planner.maxPercentOfAvailableCash}
        <input
          type="number"
          step="1"
          min="0"
          max="100"
          value={maxPercentPct}
          onChange={(e) => setMaxPercentPct(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.planner.expectedRecurringExpenses}
        <input
          type="number"
          step="0.01"
          min="0"
          value={expectedRecurring}
          onChange={(e) => setExpectedRecurring(e.target.value)}
        />
      </label>

      <div className={styles.actions}>
        {saved && <span>{t.planner.settingsSaved}</span>}
        <button type="submit" className={styles.primary} disabled={submitting}>
          {t.planner.saveSettings}
        </button>
      </div>
    </form>
  )
}
