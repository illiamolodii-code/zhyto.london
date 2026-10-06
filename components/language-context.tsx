"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { translations, TranslationKeys } from '@/lib/translations'

export type Lang = 'en' | 'uk' | 'pl'

const ALL_LANGS: Lang[] = ['en', 'uk', 'pl']
const LS_KEY = 'zhyto-lang'

interface LangContextType {
  lang: Lang
  t: TranslationKeys
  toggleLang: () => void
  setLang: (l: Lang) => void
  enabledLanguages: Lang[]
}

function deepMerge<T extends Record<string, any>>(defaults: T, overrides: Partial<T>): T {
  const result = { ...defaults }
  for (const key of Object.keys(overrides)) {
    const val = overrides[key]
    if (val === null || val === undefined) continue
    if (Array.isArray(val) || Array.isArray(result[key])) {
      ;(result as any)[key] = val
    } else if (typeof val === 'object' && typeof result[key] === 'object') {
      ;(result as any)[key] = deepMerge(result[key] as any, val as any)
    } else if (typeof val === typeof result[key]) {
      ;(result as any)[key] = val
    }
  }
  return result
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  t: translations.en,
  toggleLang: () => {},
  setLang: () => {},
  enabledLanguages: ALL_LANGS,
})

const CATEGORY_SLUGS = ['varenyky', 'syrnyky', 'pelmeni']

function buildLocalePath(pathname: string, locale: Lang): string {
  const segments = pathname.split('/').filter(Boolean)
  const isLocalized = segments[0] === 'uk' || segments[0] === 'pl'
  let rest: string[] = segments
  if (isLocalized) rest = segments.slice(1)
  else if (segments.length > 0 && !CATEGORY_SLUGS.includes(segments[0])) rest = []
  const suffix = locale === 'en' ? '' : `/${locale}`
  return `${suffix}/${rest.join('/')}`.replace(/\/+$/, '') || '/'
}

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode
  initialLang?: Lang
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [lang, setLangState] = useState<Lang>(initialLang || 'en')
  const [enabledLanguages, setEnabledLanguages] = useState<Lang[]>(ALL_LANGS)
  const [customTexts, setCustomTexts] = useState<{ en: Record<string, any>; uk: Record<string, any>; pl: Record<string, any> } | null>(null)

  useEffect(() => {
    if (initialLang) {
      setLangState(initialLang)
      try { localStorage.setItem(LS_KEY, initialLang) } catch {}
    }
  }, [initialLang])

  useEffect(() => {
    fetch('/api/public/texts')
      .then(r => r.json())
      .then(data => {
        if (data?.en && data?.uk && data?.pl) setCustomTexts(data)
      })
      .catch(() => {})
    fetch('/api/public-settings')
      .then(r => r.json())
      .then(data => {
        if (data?.enabled_languages?.length) {
          setEnabledLanguages(data.enabled_languages)
        }
      })
      .catch(() => {})
  }, [])

  const merged = customTexts
    ? {
        en: deepMerge(translations.en, customTexts.en),
        uk: deepMerge(translations.uk, customTexts.uk),
        pl: deepMerge((translations as any).pl, customTexts.pl),
      }
    : translations

  const changeLang = (next: Lang) => {
    if (next === lang) return
    if (!enabledLanguages.includes(next)) return
    try { localStorage.setItem(LS_KEY, next) } catch {}
    router.push(buildLocalePath(pathname || '', next))
  }

  const toggleLang = () => {
    const idx = enabledLanguages.indexOf(lang)
    const next = enabledLanguages[(idx + 1) % enabledLanguages.length]
    changeLang(next)
  }

  return (
    <LangContext.Provider value={{ lang, t: merged[lang], toggleLang, setLang: changeLang, enabledLanguages }}>
      <div data-lang={lang} style={{ display: 'contents' }}>
        {children}
      </div>
    </LangContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LangContext)
}

export { ALL_LANGS }