import { decimalInputToMinorUnits, minorUnitsToDecimalInput } from '@pfm/shared'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Budget } from '../api/budgets'
import type { Category } from '../api/categories'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './TransactionForm.module.css'

interface BudgetFormProps {
  availableCategories: Category[]
  initial?: Budget
  onSubmit: (input: { categoryId: string; limitMinor: number }) => void
  onCancel: () => void
  submitting?: boolean
}

export function BudgetForm({
  availableCategories,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: BudgetFormProps) {
  const { t } = useLanguage()
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '')
  const [limit, setLimit] = useState(initial ? minorUnitsToDecimalInput(initial.limitMinor) : '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!categoryId) return
    onSubmit({ categoryId, limitMinor: decimalInputToMinorUnits(limit) })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        {t.budgets.category}
        <select
          required
          disabled={Boolean(initial)}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="" disabled>
            {t.budgets.selectCategory}
          </option>
          {initial && <option value={initial.categoryId}>{initial.category.name}</option>}
          {!initial &&
            availableCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </label>

      <label className={styles.field}>
        {t.budgets.limit}
        <input
          type="number"
          step="0.01"
          min="0.01"
          required
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
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
