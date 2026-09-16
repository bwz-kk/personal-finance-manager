import { formatMinorUnits } from '@pfm/shared'
import { useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { GoalForm } from '../components/GoalForm'
import { Modal } from '../components/Modal'
import { useCreateGoal, useDeleteGoal, useGoals, useUpdateGoal } from '../hooks/useGoals'
import { useLanguage } from '../i18n/LanguageContext'
import type { Goal, GoalInput } from '../api/goals'
import styles from './Goals.module.css'

export function GoalsPage() {
  const { t } = useLanguage()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Goal | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Goal | null>(null)

  const goalsQuery = useGoals()
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  const goals = goalsQuery.data ?? []

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  function handleSubmit(input: GoalInput) {
    if (editing) {
      updateGoal.mutate({ id: editing.id, input }, { onSuccess: () => closeForm() })
    } else {
      createGoal.mutate(input, { onSuccess: () => closeForm() })
    }
  }

  function handleDelete() {
    if (!pendingDelete) return
    deleteGoal.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>{t.goals.title}</h1>
        <button type="button" className={styles.primary} onClick={() => setFormOpen(true)}>
          {t.goals.addGoal}
        </button>
      </div>

      {goalsQuery.isLoading && <p>{t.goals.loading}</p>}
      {goalsQuery.isError && <p className={styles.error}>{t.goals.loadError}</p>}
      {!goalsQuery.isLoading && goals.length === 0 && (
        <p className={styles.empty}>{t.goals.empty}</p>
      )}

      <div className={styles.list}>
        {goals.map((goal) => (
          <div key={goal.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.name}>{goal.name}</span>
                {goal.targetDate && (
                  <span className={styles.date}>{goal.targetDate.slice(0, 10)}</span>
                )}
              </div>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(goal)
                    setFormOpen(true)
                  }}
                >
                  {t.transactions.edit}
                </button>
                <button type="button" onClick={() => setPendingDelete(goal)}>
                  {t.transactions.delete}
                </button>
              </div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={goal.isComplete ? styles.progressFillComplete : styles.progressFill}
                style={{ width: `${goal.progressPct}%` }}
              />
            </div>

            <div className={styles.stats}>
              <span>
                {formatMinorUnits(goal.currentAmountMinor)} /{' '}
                {formatMinorUnits(goal.targetAmountMinor)}
              </span>
              <span className={goal.isComplete ? styles.complete : undefined}>
                {goal.isComplete
                  ? t.goals.complete
                  : `${t.goals.remaining}: ${formatMinorUnits(goal.remainingMinor)}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <Modal title={editing ? t.goals.editGoal : t.goals.addGoal} onClose={closeForm}>
          <GoalForm
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={createGoal.isPending || updateGoal.isPending}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={t.goals.deleteTitle}
          message={t.goals.deleteMessage(pendingDelete.name)}
          confirmLabel={t.common.delete}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
