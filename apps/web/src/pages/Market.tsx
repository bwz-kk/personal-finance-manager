import { useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { WatchlistItemForm } from '../components/WatchlistItemForm'
import { useLanguage } from '../i18n/LanguageContext'
import {
  useCreateWatchlistItem,
  useDeleteWatchlistItem,
  useRefreshAllWatchlist,
  useRefreshWatchlistItem,
  useWatchlist,
} from '../hooks/useMarket'
import type { WatchlistItem, WatchlistItemInput } from '../api/market'
import styles from './Market.module.css'

function priceUnit(item: WatchlistItem): string {
  if (item.assetClass === 'STOCK') return 'BRL'
  return item.baseCurrency ?? ''
}

export function MarketPage() {
  const { t } = useLanguage()
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<WatchlistItem | null>(null)

  const watchlistQuery = useWatchlist()
  const createItem = useCreateWatchlistItem()
  const deleteItem = useDeleteWatchlistItem()
  const refreshItem = useRefreshWatchlistItem()
  const refreshAll = useRefreshAllWatchlist()

  const items = watchlistQuery.data ?? []

  function handleSubmit(input: WatchlistItemInput) {
    createItem.mutate(input, { onSuccess: () => setFormOpen(false) })
  }

  function handleDelete() {
    if (!pendingDelete) return
    deleteItem.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
  }

  return (
    <div>
      <div className={styles.header}>
        <h1>{t.market.title}</h1>
        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={() => refreshAll.mutate()}
            disabled={refreshAll.isPending || items.length === 0}
          >
            {t.market.refreshAll}
          </button>
          <button type="button" className={styles.primary} onClick={() => setFormOpen(true)}>
            {t.market.addItem}
          </button>
        </div>
      </div>

      {watchlistQuery.isLoading && <p>{t.market.loading}</p>}
      {watchlistQuery.isError && <p className={styles.error}>{t.market.loadError}</p>}
      {!watchlistQuery.isLoading && items.length === 0 && (
        <p className={styles.empty}>{t.market.empty}</p>
      )}

      {items.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t.market.symbol}</th>
              <th>{t.market.label}</th>
              <th>{t.market.assetClass}</th>
              <th>{t.market.price}</th>
              <th>{t.market.lastUpdated}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.symbol}</td>
                <td>{item.label}</td>
                <td>{t.market.assetClasses[item.assetClass]}</td>
                <td>
                  {item.price ? (
                    <>
                      {item.price} {priceUnit(item)}
                      {item.isStale && <span className={styles.stale}> · {t.market.stale}</span>}
                    </>
                  ) : (
                    <span className={styles.noPrice}>{t.market.noPriceYet}</span>
                  )}
                </td>
                <td>{item.asOf ? new Date(item.asOf).toLocaleString() : '—'}</td>
                <td className={styles.rowActions}>
                  <button
                    type="button"
                    onClick={() => refreshItem.mutate(item.id)}
                    disabled={refreshItem.isPending}
                  >
                    {t.market.refresh}
                  </button>
                  <button type="button" onClick={() => setPendingDelete(item)}>
                    {t.transactions.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {formOpen && (
        <Modal title={t.market.addItem} onClose={() => setFormOpen(false)}>
          <WatchlistItemForm
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
            submitting={createItem.isPending}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={t.market.deleteTitle}
          message={t.market.deleteMessage(pendingDelete.label)}
          confirmLabel={t.common.delete}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
