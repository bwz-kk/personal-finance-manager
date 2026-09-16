import { formatMinorUnits } from '@pfm/shared'
import { useState } from 'react'
import { PlannerConfigForm } from '../components/PlannerConfigForm'
import { useLanguage } from '../i18n/LanguageContext'
import { usePlan, usePlanConfig, useUpdatePlanConfig } from '../hooks/usePlanner'
import { currentMonth, shiftMonth } from '../utils/month'
import styles from './Planner.module.css'

export function PlannerPage() {
  const { t } = useLanguage()
  const [month, setMonth] = useState(currentMonth)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const planQuery = usePlan(month)
  const configQuery = usePlanConfig()
  const updateConfig = useUpdatePlanConfig()

  const plan = planQuery.data

  return (
    <div>
      <div className={styles.header}>
        <h1>{t.planner.title}</h1>
        <button type="button" className={styles.link} onClick={() => setSettingsOpen((v) => !v)}>
          {t.planner.settings}
        </button>
      </div>

      <p className={styles.disclaimer}>{t.planner.disclaimer}</p>

      <div className={styles.monthNav}>
        <button type="button" onClick={() => setMonth((m) => shiftMonth(m, -1))}>
          ‹
        </button>
        <span>{month}</span>
        <button type="button" onClick={() => setMonth((m) => shiftMonth(m, 1))}>
          ›
        </button>
      </div>

      {settingsOpen && configQuery.data && (
        <div className={styles.settingsPanel}>
          <PlannerConfigForm
            config={configQuery.data}
            submitting={updateConfig.isPending}
            saved={justSaved}
            onSubmit={(input) =>
              updateConfig.mutate(input, {
                onSuccess: () => {
                  setJustSaved(true)
                  setTimeout(() => setJustSaved(false), 3000)
                },
              })
            }
          />
        </div>
      )}

      {planQuery.isLoading && <p>{t.planner.loading}</p>}
      {planQuery.isError && <p className={styles.error}>{t.planner.loadError}</p>}

      {plan && (
        <div className={styles.plan}>
          <div className={styles.row}>
            <span>{t.planner.income}</span>
            <span>{formatMinorUnits(plan.incomeMinor)}</span>
          </div>
          <div className={styles.row}>
            <span>{t.planner.expenses}</span>
            <span>{formatMinorUnits(plan.actualExpensesMinor)}</span>
          </div>
          {plan.expectedRecurringExpensesMinor > 0 && (
            <div className={styles.row}>
              <span>{t.planner.expectedRecurring}</span>
              <span>{formatMinorUnits(plan.expectedRecurringExpensesMinor)}</span>
            </div>
          )}
          <div className={styles.row}>
            <span>{t.planner.available}</span>
            <span>{formatMinorUnits(plan.availableMinor)}</span>
          </div>

          <div className={styles.suggested}>
            <span className={styles.suggestedLabel}>{t.planner.suggested}</span>
            <span className={styles.suggestedAmount}>{formatMinorUnits(plan.suggestedMinor)}</span>
            <span className={styles.constraint}>
              {t.planner.constraints[plan.bindingConstraint]}
            </span>
          </div>

          <div className={styles.row}>
            <span>{t.planner.remainingBuffer}</span>
            <span>{formatMinorUnits(plan.remainingBufferMinor)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
