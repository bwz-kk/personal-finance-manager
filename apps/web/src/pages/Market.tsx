import { useLanguage } from '../i18n/LanguageContext'

export function MarketPage() {
  const { t } = useLanguage()
  return (
    <div>
      <h1>{t.nav.market}</h1>
      <p>{t.common.comingSoon}</p>
    </div>
  )
}
