import { useLanguage } from '../i18n/LanguageContext'

export function PlannerPage() {
  const { t } = useLanguage()
  return (
    <div>
      <h1>{t.nav.planner}</h1>
      <p>{t.common.comingSoon}</p>
    </div>
  )
}
