import { useLanguage } from '../i18n/LanguageContext'

export function InvestmentsPage() {
  const { t } = useLanguage()
  return (
    <div>
      <h1>{t.nav.investments}</h1>
      <p>{t.common.comingSoon}</p>
    </div>
  )
}
