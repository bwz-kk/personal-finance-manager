import { formatMinorUnits } from '@pfm/shared'
import { useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { InvestmentForm } from '../components/InvestmentForm'
import { InvestmentTransactionForm } from '../components/InvestmentTransactionForm'
import { Modal } from '../components/Modal'
import {
  useAddInvestmentTransaction,
  useCreateInvestment,
  useDeleteInvestment,
  useInvestment,
  useInvestments,
  useRemoveInvestmentTransaction,
  useUpdateInvestment,
  usePortfolio,
} from '../hooks/useInvestments'
import { useLanguage } from '../i18n/LanguageContext'
import type { Investment, InvestmentInput, InvestmentTransaction } from '../api/investments'
import styles from './Investments.module.css'

export function InvestmentsPage() {
  const { t } = useLanguage()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Investment | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Investment | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addingTxTo, setAddingTxTo] = useState<string | null>(null)
  const [pendingDeleteTx, setPendingDeleteTx] = useState<InvestmentTransaction | null>(null)

  const investmentsQuery = useInvestments()
  const portfolioQuery = usePortfolio()
  const detailQuery = useInvestment(expandedId)

  const createInvestment = useCreateInvestment()
  const updateInvestment = useUpdateInvestment()
  const deleteInvestment = useDeleteInvestment()
  const addTransaction = useAddInvestmentTransaction()
  const removeTransaction = useRemoveInvestmentTransaction()

  const investments = investmentsQuery.data ?? []
  const portfolioGroups = portfolioQuery.data?.groups ?? []

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  function handleSubmit(input: InvestmentInput) {
    if (editing) {
      updateInvestment.mutate({ id: editing.id, input }, { onSuccess: () => closeForm() })
    } else {
      createInvestment.mutate(input, { onSuccess: () => closeForm() })
    }
  }

  function handleDelete() {
    if (!pendingDelete) return
    deleteInvestment.mutate(pendingDelete.id, {
      onSuccess: () => {
        setPendingDelete(null)
        if (expandedId === pendingDelete.id) setExpandedId(null)
      },
    })
  }

  function handleDeleteTx() {
    if (!pendingDeleteTx) return
    removeTransaction.mutate(
      { investmentId: pendingDeleteTx.investmentId, transactionId: pendingDeleteTx.id },
      { onSuccess: () => setPendingDeleteTx(null) },
    )
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>{t.investments.title}</h1>
        <button type="button" className={styles.primary} onClick={() => setFormOpen(true)}>
          {t.investments.addInvestment}
        </button>
      </div>

      {portfolioGroups.length > 0 && (
        <div className={styles.portfolio}>
          <h2>{t.investments.portfolioTitle}</h2>
          <div className={styles.portfolioGroups}>
            {portfolioGroups.map((group) => (
              <div key={group.currency} className={styles.portfolioGroup}>
                <span className={styles.portfolioCurrency}>{group.currency}</span>
                <span>
                  {t.investments.invested}:{' '}
                  {formatMinorUnits(group.totalInvestedMinor, group.currency)}
                </span>
                <span>
                  {t.investments.currentValue}:{' '}
                  {formatMinorUnits(group.currentValueMinor, group.currency)}
                </span>
                <span
                  className={group.absoluteReturnMinor >= 0 ? styles.positive : styles.negative}
                >
                  {t.investments.return}:{' '}
                  {formatMinorUnits(group.absoluteReturnMinor, group.currency)} (
                  {group.percentageReturn.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {investmentsQuery.isLoading && <p>{t.investments.loading}</p>}
      {investmentsQuery.isError && <p className={styles.error}>{t.investments.loadError}</p>}
      {!investmentsQuery.isLoading && investments.length === 0 && (
        <p className={styles.empty}>{t.investments.empty}</p>
      )}

      <div className={styles.list}>
        {investments.map((investment) => {
          const expanded = expandedId === investment.id
          return (
            <div key={investment.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.name}>{investment.name}</span>
                  <span className={styles.assetType}>
                    {t.investments.assetTypes[investment.assetType]}
                    {investment.institution ? ` · ${investment.institution}` : ''}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(investment)
                      setFormOpen(true)
                    }}
                  >
                    {t.transactions.edit}
                  </button>
                  <button type="button" onClick={() => setPendingDelete(investment)}>
                    {t.transactions.delete}
                  </button>
                </div>
              </div>

              <div className={styles.stats}>
                <span>
                  {t.investments.invested}:{' '}
                  {formatMinorUnits(investment.totalInvestedMinor, investment.currency)}
                </span>
                <span>
                  {t.investments.currentValue}:{' '}
                  {formatMinorUnits(investment.currentValueMinor ?? 0, investment.currency)}
                </span>
                <span
                  className={
                    investment.absoluteReturnMinor >= 0 ? styles.positive : styles.negative
                  }
                >
                  {t.investments.return}:{' '}
                  {formatMinorUnits(investment.absoluteReturnMinor, investment.currency)} (
                  {investment.percentageReturn.toFixed(1)}%)
                </span>
              </div>

              <button
                type="button"
                className={styles.toggle}
                onClick={() => setExpandedId(expanded ? null : investment.id)}
              >
                {expanded ? t.investments.hideTransactions : t.investments.viewTransactions}
              </button>

              {expanded && (
                <div className={styles.transactions}>
                  {detailQuery.isLoading && <p>{t.investments.loading}</p>}
                  {detailQuery.data && detailQuery.data.transactions.length === 0 && (
                    <p className={styles.empty}>{t.investments.noTransactions}</p>
                  )}
                  {detailQuery.data && detailQuery.data.transactions.length > 0 && (
                    <table className={styles.txTable}>
                      <tbody>
                        {detailQuery.data.transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td>{tx.date.slice(0, 10)}</td>
                            <td>{t.investments.transactionTypes[tx.type]}</td>
                            <td>{formatMinorUnits(tx.amountMinor, investment.currency)}</td>
                            <td>{tx.quantity ?? ''}</td>
                            <td>
                              <button type="button" onClick={() => setPendingDeleteTx(tx)}>
                                {t.transactions.delete}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <button
                    type="button"
                    className={styles.addTx}
                    onClick={() => setAddingTxTo(investment.id)}
                  >
                    {t.investments.addTransaction}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {formOpen && (
        <Modal
          title={editing ? t.investments.editInvestment : t.investments.addInvestment}
          onClose={closeForm}
        >
          <InvestmentForm
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={createInvestment.isPending || updateInvestment.isPending}
          />
        </Modal>
      )}

      {addingTxTo && (
        <Modal title={t.investments.addTransaction} onClose={() => setAddingTxTo(null)}>
          <InvestmentTransactionForm
            onSubmit={(input) =>
              addTransaction.mutate(
                { investmentId: addingTxTo, input },
                { onSuccess: () => setAddingTxTo(null) },
              )
            }
            onCancel={() => setAddingTxTo(null)}
            submitting={addTransaction.isPending}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={t.investments.deleteTitle}
          message={t.investments.deleteMessage(pendingDelete.name)}
          confirmLabel={t.common.delete}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {pendingDeleteTx && (
        <ConfirmDialog
          title={t.investments.deleteTransactionTitle}
          message={t.investments.deleteTransactionMessage}
          confirmLabel={t.common.delete}
          onConfirm={handleDeleteTx}
          onCancel={() => setPendingDeleteTx(null)}
        />
      )}
    </div>
  )
}
