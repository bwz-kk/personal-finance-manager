import { decimalInputToMinorUnits, minorUnitsToDecimalInput } from '@pfm/shared'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Category } from '../api/categories'
import type { Transaction, TransactionInput } from '../api/transactions'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './TransactionForm.module.css'

interface TransactionFormProps {
  categories: Category[]
  initial?: Transaction
  onSubmit: (input: TransactionInput) => void
  onCancel: () => void
  submitting?: boolean
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function TransactionForm({
  categories,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: TransactionFormProps) {
  const { t } = useLanguage()
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>(initial?.type ?? 'EXPENSE')
  const [amount, setAmount] = useState(initial ? minorUnitsToDecimalInput(initial.amountMinor) : '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [date, setDate] = useState(initial ? initial.date.slice(0, 10) : todayIsoDate())
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const categoriesForType = categories.filter((c) => c.type === type)

  function handleTypeChange(nextType: 'INCOME' | 'EXPENSE') {
    setType(nextType)
    if (!categories.find((c) => c.id === categoryId && c.type === nextType)) {
      setCategoryId('')
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!categoryId) return
    onSubmit({
      type,
      amountMinor: decimalInputToMinorUnits(amount),
      description,
      date,
      categoryId,
      notes: notes.trim() ? notes.trim() : undefined,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.typeToggle}>
        <button
          type="button"
          className={type === 'EXPENSE' ? styles.typeActive : styles.typeButton}
          onClick={() => handleTypeChange('EXPENSE')}
        >
          {t.transactions.typeExpense}
        </button>
        <button
          type="button"
          className={type === 'INCOME' ? styles.typeActive : styles.typeButton}
          onClick={() => handleTypeChange('INCOME')}
        >
          {t.transactions.typeIncome}
        </button>
      </div>

      <label className={styles.field}>
        {t.transactions.amount}
        <input
          type="number"
          step="0.01"
          min="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.transactions.description}
        <input
          type="text"
          required
          maxLength={200}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.transactions.date}
        <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      <label className={styles.field}>
        {t.transactions.category}
        <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="" disabled>
            {t.transactions.selectCategory}
          </option>
          {categoriesForType.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        {t.transactions.notesOptional}
        <textarea
          maxLength={1000}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>
          {t.common.cancel}
        </button>
        <button type="submit" className={styles.primary} disabled={submitting}>
          {initial ? t.transactions.saveChanges : t.transactions.add}
        </button>
      </div>
    </form>
  )
}
