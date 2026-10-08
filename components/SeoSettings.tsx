"use client"

import { useEffect, useState } from 'react'
import { Loader, Save, Search } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Lang } from '@/components/language-context'

type SeoLocale = { title: string; description: string; keywords: string[] }
type SeoValue = {
  home: Record<Lang, SeoLocale>
  categories: Record<string, Record<Lang, SeoLocale>>
}

const LANGS: Lang[] = ['en', 'uk', 'pl']
const LANG_NAMES: Record<Lang, string> = { en: 'English', uk: 'Ukrainian', pl: 'Polish' }
const PAGE_KEYS = ['home', 'varenyky', 'syrnyky', 'pelmeni']
const PAGE_LABELS: Record<string, string> = {
  home: 'Homepage',
  varenyky: 'Varenyky',
  syrnyky: 'Syrnyky',
  pelmeni: 'Pelmeni',
}

const emptyLocale = (): SeoLocale => ({ title: '', description: '', keywords: [] })

function makeEmpty(): SeoValue {
  const home = {} as Record<Lang, SeoLocale>
  for (const l of LANGS) home[l] = emptyLocale()
  return { home, categories: {} }
}

async function fetchCurrentSeo(): Promise<{ value: SeoValue | null; pruned: boolean }> {
  const { data } = await supabase.from('settings').select('value').eq('key', 'seo').single()
  const raw = data?.value as Partial<SeoValue> | null | undefined
  if (!raw || typeof raw !== 'object') return { value: null, pruned: false }

  const value = makeEmpty()
  let pruned = false

  const fill = (target: Record<Lang, SeoLocale>, src?: Partial<Record<Lang, SeoLocale>>) => {
    for (const l of LANGS) {
      const s = src?.[l]
      if (!s || typeof s !== 'object') continue
      target[l].title = typeof s.title === 'string' ? s.title : ''
      target[l].description = typeof s.description === 'string' ? s.description : ''
      target[l].keywords = Array.isArray(s.keywords) ? s.keywords.filter((k): k is string => typeof k === 'string') : []
    }
  }

  fill(value.home, raw.home)
  for (const key of PAGE_KEYS) {
    if (key === 'home') continue
    const src = raw.categories?.[key]
    if (src && typeof src === 'object') {
      value.categories[key] = { en: emptyLocale(), uk: emptyLocale(), pl: emptyLocale() }
      fill(value.categories[key], src)
    } else {
      pruned = true
    }
  }

  return { value, pruned }
}

export default function SeoSettings({ upsertSetting }: { upsertSetting: (key: string, value: any) => Promise<void> }) {
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [seo, setSeo] = useState<SeoValue>(makeEmpty())
  const [activePage, setActivePage] = useState<string>('home')
  const [activeLang, setActiveLang] = useState<Lang>('en')

  useEffect(() => {
    let cancelled = false
    if (!supabase) { setLoaded(true); return }
    fetchCurrentSeo().then(({ value, pruned }) => {
      if (cancelled) return
      if (value) setSeo(value)
      setLoaded(true)
    })
    return () => { cancelled = true }
  }, [])

  const upsert = async () => {
    setSaving(true)
    try {
      await upsertSetting('seo', seo)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast.success('SEO settings saved')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save')
    }
    setSaving(false)
  }

  const localeFor = (page: string, lang: Lang): SeoLocale =>
    page === 'home'
      ? seo.home[lang]
      : (seo.categories[page]?.[lang] ?? (seo.categories[page] = { en: emptyLocale(), uk: emptyLocale(), pl: emptyLocale() })[lang])

  const patchLocale = (page: string, lang: Lang, patch: Partial<SeoLocale>) => {
    const next = { ...seo }
    if (page === 'home') {
      next.home = { ...next.home, [lang]: { ...next.home[lang], ...patch } }
    } else {
      const existing = next.categories[page] ?? { en: emptyLocale(), uk: emptyLocale(), pl: emptyLocale() }
      next.categories = { ...next.categories, [page]: { ...existing, [lang]: { ...existing[lang], ...patch } } }
    }
    setSeo(next)
  }

  const current = activePage === 'home'
    ? seo.home[activeLang]
    : (seo.categories[activePage]?.[activeLang] ?? emptyLocale())

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-primary" />
        <h2 className="font-serif text-xl text-foreground">SEO Settings</h2>
        <span className="text-xs text-muted-foreground">Meta titles, descriptions and keywords per page &amp; language</span>
      </div>

      {!loaded ? (
        <div className="flex items-center justify-center py-10">
          <Loader className="w-5 h-5 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {PAGE_KEYS.map(key => (
              <button
                key={key}
                onClick={() => setActivePage(key)}
                className={`px-4 py-2 rounded-lg text-sm tracking-[0.1em] border transition-colors cursor-pointer ${
                  activePage === key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border/50 text-muted-foreground hover:border-primary/40'
                }`}
              >
                {PAGE_LABELS[key]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {LANGS.map(l => (
              <button
                key={l}
                onClick={() => setActiveLang(l)}
                className={`px-4 py-1.5 rounded-lg text-xs tracking-[0.1em] border transition-colors cursor-pointer ${
                  activeLang === l
                    ? 'bg-primary/15 text-primary border-primary'
                    : 'border-border/50 text-muted-foreground hover:border-primary/40'
                }`}
              >
                {l.toUpperCase()} — {LANG_NAMES[l]}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm tracking-[0.1em] text-muted-foreground block mb-2">
                Title ({current.title.length} chars)
              </label>
              <input
                value={current.title}
                onChange={e => patchLocale(activePage, activeLang, { title: e.target.value })}
                placeholder="e.g. Купити вареники в Лондоні — доставка | zhyto.london"
                className="w-full bg-transparent border border-border/50 rounded-lg px-4 py-3 text-base text-foreground focus:border-primary outline-none"
              />
              <p className="text-sm text-muted-foreground/60 mt-1">Recommended: up to 60 chars; keywords first, brand last</p>
            </div>
            <div>
              <label className="text-sm tracking-[0.1em] text-muted-foreground block mb-2">
                Description ({current.description.length} chars)
              </label>
              <textarea
                value={current.description}
                onChange={e => patchLocale(activePage, activeLang, { description: e.target.value })}
                rows={3}
                placeholder="e.g. Handcrafted Ukrainian varenyky and syrnyky delivered to your door in London."
                className="w-full bg-transparent border border-border/50 rounded-lg px-4 py-3 text-base text-foreground focus:border-primary outline-none resize-none"
              />
              <p className="text-sm text-muted-foreground/60 mt-1">Recommended: 120–160 chars</p>
            </div>
            <div>
              <label className="text-sm tracking-[0.1em] text-muted-foreground block mb-2">Keywords</label>
              <input
                value={current.keywords.join(', ')}
                onChange={e => {
                  const keywords = e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                  patchLocale(activePage, activeLang, { keywords })
                }}
                placeholder="varenyky london, ukrainian dumplings london"
                className="w-full bg-transparent border border-border/50 rounded-lg px-4 py-3 text-base text-foreground focus:border-primary outline-none"
              />
              <p className="text-sm text-muted-foreground/60 mt-1">Comma-separated. Google ignores keywords, but they stay useful for internal reference.</p>
            </div>
          </div>

          <button
            onClick={upsert}
            disabled={saving}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm tracking-[0.15em] hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? 'SAVING...' : saved ? 'SAVED ✓' : 'SAVE SEO'}
          </button>
        </>
      )}
    </div>
  )
}