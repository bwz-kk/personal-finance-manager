import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Language, Translations } from './translations'
import { LANGUAGES, translations } from './translations'

const STORAGE_KEY = 'pfm-language'

function detectInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'pt-BR') return stored
  } catch {
    // localStorage unavailable (private browsing, etc) — fall through to default
  }
  return 'en'
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(detectInitialLanguage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // ignore — per-viewer convenience only
    }
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}

export { LANGUAGES }
export type { Language }
