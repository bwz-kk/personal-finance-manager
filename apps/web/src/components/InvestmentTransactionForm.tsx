import { INVESTMENT_TRANSACTION_TYPES, decimalInputToMinorUnits } from '@pfm/shared'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { InvestmentTransactionInput } from '../api/investments'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './TransactionForm.module.css'

interface InvestmentTransactionFormProps {
  onSubmit: (input: InvestmentTransactionInput) => void
  onCancel: () => void
  submitting?: boolean
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function InvestmentTransactionForm({
  onSubmit,
  onCancel,
  submitting,
}: InvestmentTransactionFormProps) {
  const { t } = useLanguage()
  const [type, setType] = useState(INVESTMENT_TRANSACTION_TYPES[0])
  const [amount, setAmount] = useState('')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState(todayIsoDate())

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      type,
      amountMinor: decimalInputToMinorUnits(amount),
      quantity: quantity.trim() ? quantity.trim() : undefined,
      date,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        {t.investments.transactionType}
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          {INVESTMENT_TRANSACTION_TYPES.map((txType) => (
            <option key={txType} value={txType}>
              {t.investments.transactionTypes[txType]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        {t.investments.amount}
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
        {t.investments.quantityOptional}
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00034521"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.investments.date}
        <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
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
