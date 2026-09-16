import { useLanguage } from '../i18n/LanguageContext'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useLanguage()
  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title">{title}</h2>
        <p>{message}</p>
        <div className={styles.actions}>
          <button type="button" onClick={onCancel}>
            {t.common.cancel}
          </button>
          <button type="button" className={styles.danger} onClick={onConfirm}>
            {confirmLabel ?? t.common.delete}
          </button>
        </div>
      </div>
    </div>
  )
}
