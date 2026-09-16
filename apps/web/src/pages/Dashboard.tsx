import { useLanguage } from '../i18n/LanguageContext'

export function DashboardPage() {
  const { t } = useLanguage()
  return (
    <div>
      <h1>{t.nav.dashboard}</h1>
      <p>{t.common.comingSoon}</p>
    </div>
  )
}
