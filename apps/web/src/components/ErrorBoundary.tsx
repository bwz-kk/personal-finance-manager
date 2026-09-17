import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import type { Translations } from '../i18n/translations'
import styles from './ErrorBoundary.module.css'

interface Props {
  t: Translations['errorBoundary']
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundaryImpl extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      const { t } = this.props
      return (
        <div className={styles.boundary} role="alert">
          <h2>{t.title}</h2>
          <p>{t.message}</p>
          <button type="button" onClick={() => window.location.reload()}>
            {t.reload}
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const location = useLocation()
  return (
    <ErrorBoundaryImpl key={location.pathname} t={t.errorBoundary}>
      {children}
    </ErrorBoundaryImpl>
  )
}
