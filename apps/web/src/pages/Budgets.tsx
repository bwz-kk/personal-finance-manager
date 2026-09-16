import { formatMinorUnits } from '@pfm/shared'
import { useState } from 'react'
import { BudgetForm } from '../components/BudgetForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { useCategories } from '../hooks/useCategories'
import { useBudgets, useCreateBudget, useDeleteBudget, useUpdateBudget } from '../hooks/useBudgets'
import { useLanguage } from '../i18n/LanguageContext'
import { currentMonth, shiftMonth } from '../utils/month'
import type { Budget } from '../api/budgets'
import styles from './Budgets.module.css'

export function BudgetsPage() {
  const { t } = useLanguage()
  const [month, setMonth] = useState(currentMonth)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Budget | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Budget | null>(null)

  const categoriesQuery = useCategories()
  const budgetsQuery = useBudgets(month)

  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()
  const deleteBudget = useDeleteBudget()

  const budgets = budgetsQuery.data ?? []
  const expenseCategories = (categoriesQuery.data ?? []).filter((c) => c.type === 'EXPENSE')
  const budgetedCategoryIds = new Set(budgets.map((b) => b.categoryId))
  const availableCategories = expenseCategories.filter((c) => !budgetedCategoryIds.has(c.id))

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  function handleSubmit(input: { categoryId: string; limitMinor: number }) {
    if (editing) {
      updateBudget.mutate(
        { id: editing.id, input: { limitMinor: input.limitMinor } },
        { onSuccess: () => closeForm() },
      )
    } else {
      createBudget.mutate({ ...input, month }, { onSuccess: () => closeForm() })
    }
  }

  function handleDelete() {
    if (!pendingDelete) return
    deleteBudget.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>{t.budgets.title}</h1>
        <button
          type="button"
          className={styles.primary}
          disabled={availableCategories.length === 0}
          onClick={() => setFormOpen(true)}
        >
          {t.budgets.addBudget}
        </button>
      </div>

      <div className={styles.monthNav}>
        <button
          type="button"
          aria-label={t.budgets.previousMonth}
          onClick={() => setMonth((m) => shiftMonth(m, -1))}
        >
          ‹
        </button>
        <span>{month}</span>
        <button
          type="button"
          aria-label={t.budgets.nextMonth}
          onClick={() => setMonth((m) => shiftMonth(m, 1))}
        >
          ›
        </button>
      </div>

      {availableCategories.length === 0 && expenseCategories.length > 0 && (
        <p className={styles.hint}>{t.budgets.noCategoriesLeft}</p>
      )}

      {budgetsQuery.isLoading && <p>{t.budgets.loading}</p>}
      {budgetsQuery.isError && <p className={styles.error}>{t.budgets.loadError}</p>}
      {!budgetsQuery.isLoading && budgets.length === 0 && (
        <p className={styles.empty}>{t.budgets.empty}</p>
      )}

      <div className={styles.list}>
        {budgets.map((budget) => (
          <div key={budget.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.categoryName}>{budget.category.name}</span>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(budget)
                    setFormOpen(true)
                  }}
                >
                  {t.transactions.edit}
                </button>
                <button type="button" onClick={() => setPendingDelete(budget)}>
                  {t.transactions.delete}
                </button>
              </div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={budget.isOverspent ? styles.progressFillOver : styles.progressFill}
                style={{ width: `${Math.min(budget.progressPct, 100)}%` }}
              />
            </div>

            <div className={styles.stats}>
              <span>
                {t.budgets.spent}: {formatMinorUnits(budget.spentMinor)}
              </span>
              <span>
                {t.budgets.limit}: {formatMinorUnits(budget.limitMinor)}
              </span>
              <span className={budget.isOverspent ? styles.overspent : undefined}>
                {budget.isOverspent
                  ? t.budgets.overspent
                  : `${t.budgets.remaining}: ${formatMinorUnits(budget.remainingMinor)}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <Modal title={editing ? t.budgets.editBudget : t.budgets.addBudget} onClose={closeForm}>
          <BudgetForm
            availableCategories={availableCategories}
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={createBudget.isPending || updateBudget.isPending}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={t.budgets.deleteTitle}
          message={t.budgets.deleteMessage(pendingDelete.category.name)}
          confirmLabel={t.common.delete}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
