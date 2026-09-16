import { formatMinorUnits } from '@pfm/shared'
import { useState } from 'react'
import { CategoryManager } from '../components/CategoryManager'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { TransactionForm } from '../components/TransactionForm'
import { useLanguage } from '../i18n/LanguageContext'
import { useCategories } from '../hooks/useCategories'
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactionSummary,
  useTransactions,
  useUpdateTransaction,
} from '../hooks/useTransactions'
import type { Transaction, TransactionFilters, TransactionInput } from '../api/transactions'
import styles from './Transactions.module.css'

export function TransactionsPage() {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<TransactionFilters>({
    sortBy: 'date',
    sortDir: 'desc',
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null)

  const categoriesQuery = useCategories()
  const transactionsQuery = useTransactions(filters)
  const summaryQuery = useTransactionSummary({
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  })

  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()

  function updateFilter<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function toggleSort(field: NonNullable<TransactionFilters['sortBy']>) {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === 'desc' ? 'asc' : 'desc',
    }))
  }

  function handleSubmit(input: TransactionInput) {
    if (editing) {
      updateTransaction.mutate({ id: editing.id, input }, { onSuccess: () => closeForm() })
    } else {
      createTransaction.mutate(input, { onSuccess: () => closeForm() })
    }
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  function handleDelete() {
    if (!pendingDelete) return
    deleteTransaction.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    })
  }

  const categories = categoriesQuery.data ?? []
  const transactions = transactionsQuery.data ?? []
  const summary = summaryQuery.data

  return (
    <div>
      <div className={styles.header}>
        <h1>{t.transactions.title}</h1>
        <button type="button" className={styles.primary} onClick={() => setFormOpen(true)}>
          {t.transactions.addTransaction}
        </button>
      </div>

      {summary && (
        <div className={styles.summary}>
          <SummaryStat
            label={t.transactions.income}
            valueMinor={summary.incomeMinor}
            tone="income"
          />
          <SummaryStat
            label={t.transactions.expenses}
            valueMinor={summary.expenseMinor}
            tone="expense"
          />
          <SummaryStat
            label={t.transactions.balance}
            valueMinor={summary.balanceMinor}
            tone="balance"
          />
        </div>
      )}

      <div className={styles.filters}>
        <select
          value={filters.type ?? ''}
          onChange={(e) =>
            updateFilter('type', (e.target.value || undefined) as TransactionFilters['type'])
          }
        >
          <option value="">{t.transactions.allTypes}</option>
          <option value="INCOME">{t.transactions.typeIncome}</option>
          <option value="EXPENSE">{t.transactions.typeExpense}</option>
        </select>

        <select
          value={filters.categoryId ?? ''}
          onChange={(e) => updateFilter('categoryId', e.target.value || undefined)}
        >
          <option value="">{t.transactions.allCategories}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
          aria-label={t.transactions.fromDate}
        />
        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
          aria-label={t.transactions.toDate}
        />

        <input
          type="search"
          placeholder={t.transactions.search}
          value={filters.search ?? ''}
          onChange={(e) => updateFilter('search', e.target.value || undefined)}
        />
      </div>

      {transactionsQuery.isLoading && <p>{t.transactions.loading}</p>}
      {transactionsQuery.isError && <p className={styles.error}>{t.transactions.loadError}</p>}

      {!transactionsQuery.isLoading && transactions.length === 0 && (
        <p className={styles.empty}>{t.transactions.empty}</p>
      )}

      {transactions.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <button type="button" onClick={() => toggleSort('date')}>
                  {t.transactions.columnDate}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => toggleSort('description')}>
                  {t.transactions.columnDescription}
                </button>
              </th>
              <th>{t.transactions.columnCategory}</th>
              <th className={styles.amountHeader}>
                <button type="button" onClick={() => toggleSort('amountMinor')}>
                  {t.transactions.columnAmount}
                </button>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date.slice(0, 10)}</td>
                <td>
                  {tx.description}
                  {tx.notes && <div className={styles.notes}>{tx.notes}</div>}
                </td>
                <td>{tx.category.name}</td>
                <td className={tx.type === 'INCOME' ? styles.income : styles.expense}>
                  {tx.type === 'INCOME' ? '+' : '-'}
                  {formatMinorUnits(tx.amountMinor, tx.currency)}
                </td>
                <td className={styles.rowActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(tx)
                      setFormOpen(true)
                    }}
                  >
                    {t.transactions.edit}
                  </button>
                  <button type="button" onClick={() => setPendingDelete(tx)}>
                    {t.transactions.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CategoryManager categories={categories} />

      {formOpen && (
        <Modal
          title={editing ? t.transactions.editTransaction : t.transactions.addTransaction}
          onClose={closeForm}
        >
          <TransactionForm
            categories={categories}
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={createTransaction.isPending || updateTransaction.isPending}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={t.transactions.deleteTitle}
          message={t.transactions.deleteMessage(pendingDelete.description)}
          confirmLabel={t.common.delete}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

function SummaryStat({
  label,
  valueMinor,
  tone,
}: {
  label: string
  valueMinor: number
  tone: 'income' | 'expense' | 'balance'
}) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles[tone]}>{formatMinorUnits(valueMinor)}</span>
    </div>
  )
}
