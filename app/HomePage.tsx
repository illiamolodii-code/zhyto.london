import type { Metadata } from 'next'
import { getHomeData, canonicalFor, hrefFor, type CategorySlug, type Lang } from '@/lib/home-data'
import { SITE_URL } from '@/lib/constants'
import { ogImage } from '@/lib/constants'
import HomeClient from './HomeClient'

export async function buildPageMetadata(lang: Lang, category?: CategorySlug): Promise<Metadata> {
  const data = await getHomeData(lang, category)
  const { seo } = data
  const langs: Lang[] = ['en', 'uk', 'pl'].filter(l => data.enabledLanguages.includes(l))
  const languages: Record<string, string> = {}
  for (const l of langs) languages[langCodeToHreflang(l)] = `${SITE_URL}${hrefFor(l, category)}`
  languages['x-default'] = `${SITE_URL}${hrefFor('en', category)}`

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalFor(lang, category),
      languages,
    },
    openGraph: {
      type: 'website',
      url: canonicalFor(lang, category),
      siteName: 'zhyto.london',
      title: seo.title,
      description: seo.description,
      locale: lang === 'uk' ? 'uk_UA' : lang === 'pl' ? 'pl_PL' : 'en_GB',
      images: [{ url: ogImage, width: 1024, height: 1024, alt: 'zhyto.london — Authentic Ukrainian Varenyky & Syrnyky' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  }
}

function langCodeToHreflang(l: Lang): string {
  return l === 'uk' ? 'uk' : l === 'pl' ? 'pl' : 'en'
}

export default async function HomePage({
  lang,
  category,
  initialCategory,
}: {
  lang: Lang
  category?: CategorySlug
  initialCategory?: string | null
}) {
  const data = await getHomeData(lang, category)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data.jsonLd) }}
      />
      <HomeClient
        lang={lang}
        initialCategory={initialCategory ?? null}
        preloadedProducts={data.preloadedProducts}
        preloadedCategoryOrder={data.preloadedCategoryOrder}
        preloadedCategoryNames={data.preloadedCategoryNames}
        preloadedCategoryDescriptions={data.preloadedCategoryDescriptions}
        preloadedCategoryNamesPl={data.preloadedCategoryNamesPl}
        preloadedCategoryDescPl={data.preloadedCategoryDescPl}
        preloadedCategoryDescUk={data.preloadedCategoryDescUk}
      />
    </>
  )
}