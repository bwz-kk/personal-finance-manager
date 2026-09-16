import { decimalInputToMinorUnits, minorUnitsToDecimalInput } from '@pfm/shared'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Goal, GoalInput } from '../api/goals'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './TransactionForm.module.css'

interface GoalFormProps {
  initial?: Goal
  onSubmit: (input: GoalInput) => void
  onCancel: () => void
  submitting?: boolean
}

export function GoalForm({ initial, onSubmit, onCancel, submitting }: GoalFormProps) {
  const { t } = useLanguage()
  const [name, setName] = useState(initial?.name ?? '')
  const [targetAmount, setTargetAmount] = useState(
    initial ? minorUnitsToDecimalInput(initial.targetAmountMinor) : '',
  )
  const [currentAmount, setCurrentAmount] = useState(
    initial ? minorUnitsToDecimalInput(initial.currentAmountMinor) : '0',
  )
  const [targetDate, setTargetDate] = useState(initial?.targetDate?.slice(0, 10) ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      name,
      targetAmountMinor: decimalInputToMinorUnits(targetAmount),
      currentAmountMinor: decimalInputToMinorUnits(currentAmount || '0'),
      targetDate: targetDate || undefined,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        {t.goals.name}
        <input
          type="text"
          required
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.goals.targetAmount}
        <input
          type="number"
          step="0.01"
          min="0.01"
          required
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.goals.currentAmount}
        <input
          type="number"
          step="0.01"
          min="0"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.goals.targetDateOptional}
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      </label>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>
          {t.common.cancel}
        </button>
        <button type="submit" className={styles.primary} disabled={submitting}>
          {t.common.save}
        </button>
      </div>
    </form>
  )
}
