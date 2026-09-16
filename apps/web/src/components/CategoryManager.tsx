import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Category } from '../api/categories'
import { useCreateCategory, useDeleteCategory } from '../hooks/useCategories'
import { useLanguage } from '../i18n/LanguageContext'
import { ConfirmDialog } from './ConfirmDialog'
import styles from './CategoryManager.module.css'

interface CategoryManagerProps {
  categories: Category[]
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    setError(null)
    createCategory.mutate(
      { name: name.trim(), type },
      {
        onSuccess: () => setName(''),
        onError: (err) => setError(err instanceof Error ? err.message : 'Failed to add category'),
      },
    )
  }

  function handleDelete() {
    if (!pendingDelete) return
    setError(null)
    deleteCategory.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
      onError: (err) => {
        setError(err instanceof Error ? err.message : 'Failed to delete category')
        setPendingDelete(null)
      },
    })
  }

  const income = categories.filter((c) => c.type === 'INCOME')
  const expense = categories.filter((c) => c.type === 'EXPENSE')

  return (
    <div className={styles.panel}>
      <h2>{t.categories.title}</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.columns}>
        <CategoryColumn
          title={t.categories.income}
          categories={income}
          onDelete={setPendingDelete}
        />
        <CategoryColumn
          title={t.categories.expense}
          categories={expense}
          onDelete={setPendingDelete}
        />
      </div>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <select value={type} onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE')}>
          <option value="EXPENSE">{t.categories.expense}</option>
          <option value="INCOME">{t.categories.income}</option>
        </select>
        <input
          type="text"
          placeholder={t.categories.newCategoryName}
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={createCategory.isPending}>
          {t.common.add}
        </button>
      </form>

      {pendingDelete && (
        <ConfirmDialog
          title={t.categories.deleteTitle}
          message={t.categories.deleteMessage(pendingDelete.name)}
          confirmLabel={t.common.delete}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}

function CategoryColumn({
  title,
  categories,
  onDelete,
}: {
  title: string
  categories: Category[]
  onDelete: (category: Category) => void
}) {
  const { t } = useLanguage()
  return (
    <div>
      <h3>{title}</h3>
      <ul className={styles.list}>
        {categories.map((c) => (
          <li key={c.id}>
            <span>{c.name}</span>
            {!c.isSystem && (
              <button
                type="button"
                onClick={() => onDelete(c)}
                aria-label={`${t.common.delete} ${c.name}`}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
