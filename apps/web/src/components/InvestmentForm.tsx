import { ASSET_TYPES, decimalInputToMinorUnits, minorUnitsToDecimalInput } from '@pfm/shared'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Investment, InvestmentInput } from '../api/investments'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './TransactionForm.module.css'

interface InvestmentFormProps {
  initial?: Investment
  onSubmit: (input: InvestmentInput) => void
  onCancel: () => void
  submitting?: boolean
}

export function InvestmentForm({ initial, onSubmit, onCancel, submitting }: InvestmentFormProps) {
  const { t } = useLanguage()
  const [name, setName] = useState(initial?.name ?? '')
  const [assetType, setAssetType] = useState(initial?.assetType ?? 'STOCK')
  const [institution, setInstitution] = useState(initial?.institution ?? '')
  const [currency, setCurrency] = useState(initial?.currency ?? 'BRL')
  const [currentValue, setCurrentValue] = useState(
    initial?.currentValueMinor != null ? minorUnitsToDecimalInput(initial.currentValueMinor) : '',
  )
  const [cdiPercent, setCdiPercent] = useState(initial?.cdiPercent?.toString() ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      name,
      assetType,
      institution: institution.trim() ? institution.trim() : undefined,
      currency: currency.trim().toUpperCase(),
      currentValueMinor: currentValue.trim() ? decimalInputToMinorUnits(currentValue) : undefined,
      cdiPercent: cdiPercent.trim() ? Number(cdiPercent) : undefined,
      notes: notes.trim() ? notes.trim() : undefined,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        {t.investments.name}
        <input
          type="text"
          required
          maxLength={200}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.investments.assetType}
        <select
          value={assetType}
          onChange={(e) => setAssetType(e.target.value as typeof assetType)}
        >
          {ASSET_TYPES.map((type) => (
            <option key={type} value={type}>
              {t.investments.assetTypes[type]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        {t.investments.institutionOptional}
        <input
          type="text"
          maxLength={200}
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.investments.currency}
        <input
          type="text"
          required
          maxLength={10}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.investments.currentValueOptional}
        <input
          type="number"
          step="0.01"
          min="0"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.investments.cdiPercentOptional}
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="116"
          value={cdiPercent}
          onChange={(e) => setCdiPercent(e.target.value)}
        />
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
          {t.common.save}
        </button>
      </div>
    </form>
  )
}
