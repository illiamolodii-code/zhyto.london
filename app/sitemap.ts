import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'
import { supabase } from '@/lib/utils/supabase'
import { CATEGORY_SLUGS, LANG_PREFIXES, type CategorySlug, type Lang } from '@/lib/home-data'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const langs: Lang[] = ['en', 'uk', 'pl']

  let enabledLanguages: Lang[] = langs
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'enabled_languages')
      .maybeSingle()
    if (data?.value?.length) enabledLanguages = data.value.filter((l: string) => langs.includes(l as Lang))
  } catch {
    // fall back to all languages
  }

  const activeLangs: Lang[] = enabledLanguages.length ? enabledLanguages : langs

  const buildEntries = (category?: CategorySlug) => {
    const enPath = category ? `/${category}` : '/'
    const langsWithHrefs: Record<string, string> = {}
    for (const l of langs) {
      if (!activeLangs.includes(l)) continue
      const localePath = l === 'en' ? '' : LANG_PREFIXES[l]
      langsWithHrefs[l] = `${SITE_URL}${localePath}${category ? `/${category}` : ''}`
    }
    langsWithHrefs['x-default'] = `${SITE_URL}${enPath}`

    return (activeLangs as Lang[]).map(l => {
      const path = l === 'en' ? enPath : `${LANG_PREFIXES[l]}${category ? `/${category}` : ''}`
      return {
        url: `${SITE_URL}${path}`,
        lastModified,
        changeFrequency: 'daily' as const,
        priority: category ? 0.9 : 1.0,
        alternates: { languages: langsWithHrefs },
      }
    })
  }

  const categoryEntries = CATEGORY_SLUGS.flatMap(c => buildEntries(c))
  const homeEntries = buildEntries()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
  ]

  return [...homeEntries, ...categoryEntries, ...staticEntries]
}