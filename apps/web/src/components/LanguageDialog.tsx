import { useState } from 'react'
import { LANGUAGES, useLanguage } from '../i18n/LanguageContext'
import type { Language } from '../i18n/LanguageContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const FLAGS: Record<Language, string> = { en: '🇺🇸', 'pt-BR': '🇧🇷' }
const NAMES: Record<Language, string> = { en: 'English', 'pt-BR': 'Português (BR)' }

export function LanguageDialog() {
  const { language, setLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
      >
        <span>{FLAGS[language]}</span>
        <span>{NAMES[language]}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.common.language}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setLanguage(lang)
                setOpen(false)
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
              style={lang === language ? { background: 'var(--accent)', color: '#fff' } : undefined}
            >
              <span>{FLAGS[lang]}</span>
              <span>{NAMES[lang]}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
