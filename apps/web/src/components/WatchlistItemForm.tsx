import { WATCHLIST_ASSET_CLASSES } from '@pfm/shared'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { WatchlistItemInput } from '../api/market'
import { useLanguage } from '../i18n/LanguageContext'
import styles from './TransactionForm.module.css'

interface WatchlistItemFormProps {
  onSubmit: (input: WatchlistItemInput) => void
  onCancel: () => void
  submitting?: boolean
}

export function WatchlistItemForm({ onSubmit, onCancel, submitting }: WatchlistItemFormProps) {
  const { t } = useLanguage()
  const [symbol, setSymbol] = useState('')
  const [label, setLabel] = useState('')
  const [assetClass, setAssetClass] = useState(WATCHLIST_ASSET_CLASSES[0])
  const [baseCurrency, setBaseCurrency] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      symbol: symbol.trim().toUpperCase(),
      label: label.trim(),
      assetClass,
      baseCurrency: baseCurrency.trim() ? baseCurrency.trim().toUpperCase() : undefined,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        {t.market.assetClass}
        <select
          value={assetClass}
          onChange={(e) => setAssetClass(e.target.value as typeof assetClass)}
        >
          {WATCHLIST_ASSET_CLASSES.map((cls) => (
            <option key={cls} value={cls}>
              {t.market.assetClasses[cls]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        {t.market.symbol}
        <input
          type="text"
          required
          maxLength={20}
          placeholder="BTC"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.market.label}
        <input
          type="text"
          required
          maxLength={100}
          placeholder="Bitcoin"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        {t.market.baseCurrencyOptional}
        <input
          type="text"
          maxLength={10}
          placeholder="BRL"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        />
      </label>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>
          {t.common.cancel}
        </button>
        <button type="submit" className={styles.primary} disabled={submitting}>
          {t.common.add}
        </button>
      </div>
    </form>
  )
}
