import { useLanguage } from '../i18n/LanguageContext'

export function GoalsPage() {
  const { t } = useLanguage()
  return (
    <div>
      <h1>{t.nav.goals}</h1>
      <p>{t.common.comingSoon}</p>
    </div>
  )
}
