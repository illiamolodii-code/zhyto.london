import { cache } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/utils/supabase'
import { SITE_URL } from '@/lib/constants'
import type { Lang } from '@/components/language-context'

export type CategorySlug = 'varenyky' | 'syrnyky' | 'pelmeni'
export const CATEGORY_SLUGS: CategorySlug[] = ['varenyky', 'syrnyky', 'pelmeni']
export const ALL_LANGS: Lang[] = ['en', 'uk', 'pl']
export const LANG_PREFIXES: Record<Lang, string> = { en: '', uk: '/uk', pl: '/pl' }

export interface SeoLocale {
  title: string
  description: string
  keywords: string[]
}

export interface SeoEntry {
  home: Record<Lang, SeoLocale>
  categories: Partial<Record<CategorySlug, Record<Lang, SeoLocale>>>
}

export const DEFAULT_SEO: SeoEntry = {
  home: {
    en: {
      title: 'zhyto.london | Authentic Ukrainian Varenyky & Syrnyky',
      description:
        'Handcrafted Ukrainian varenyky and syrnyky delivered to your door in London. Order authentic homemade dumplings online — same-day delivery across Zones 1–3, next-day for all London.',
      keywords: [
        'varenyky', 'vareniki', 'ukrainian dumplings', 'syrnyky',
        'ukrainian food london', 'ukrainian restaurant london', 'home made dumplings',
        'pelmeni', 'varenyky delivery london', 'ukrainian cuisine', 'czech dumplings',
        'varenyky online', 'syrnyky london', 'deliver ukrainian food',
      ],
    },
    uk: {
      title: 'Купити вареники в Лондоні — доставка | zhyto.london',
      description:
        'Домашні українські вареники, сирники та пельмені з доставкою по Лондону. Замовляйте автентичну українську їжу онлайн — доставка в день замовлення по Zones 1–3, наступного дня по всьому Лондону.',
      keywords: [
        'купити вареники лондон', 'вареники лондон', 'пельмені лондон', 'сирники лондон',
        'українська їжа лондон', 'українська кухня лондон', 'доставка вареників лондон',
        'український ресторан лондон', 'вареники з картоплею лондон',
      ],
    },
    pl: {
      title: 'Ukraińskie pierogi (warenyki) dostawa Londyn | zhyto.london',
      description:
        'Domowe ukraińskie pierogi (warenyki), syrniki i pielmieni z dostawą w Londynie. Zamów autentyczną ukraińską kuchnię online — dostawa tego samego dnia w Zones 1–3, następnego dnia w całym Londynie.',
      keywords: [
        'pierogi londyn', 'warenyki londyn', 'ukrainskie pierogi dostawa londyn',
        'syrniki londyn', 'pielmieni londyn', 'ukrainska kuchnia londyn',
        'ukrainskie jedzenie londyn',
      ],
    },
  },
  categories: {
    varenyky: {
      en: {
        title: 'Varenyky (Ukrainian Dumplings) Delivery London',
        description:
          'Order authentic handmade Ukrainian varenyky in London. Varenyky with potato, cottage cheese, cherries and more — delivered to your door across London.',
        keywords: ['varenyky london', 'ukrainian dumplings london', 'varenyky delivery london', 'varenyky with potato', 'varenyky online'],
      },
      uk: {
        title: 'Купити вареники в Лондоні — доставка | zhyto.london',
        description:
          'Замовте домашні українські вареники в Лондоні. Вареники з картоплею, сиром, вишнею та іншими начинками — з доставкою по Лондону.',
        keywords: ['купити вареники лондон', 'вареники з картоплею лондон', 'вареники з сиром лондон', 'доставка вареників лондон'],
      },
      pl: {
        title: 'Ukraińskie pierogi (warenyki) dostawa Londyn',
        description:
          'Zamów domowe ukraińskie pierogi (warenyki) w Londynie. Wareniki z ziemniakami, twarogiem, wiśniami i innymi farszami — z dostawą po Londynie.',
        keywords: ['pierogi londyn', 'warenyki londyn', 'ukrainskie pierogi londyn', 'pierogi z ziemniakami londyn'],
      },
    },
    syrnyky: {
      en: {
        title: 'Syrnyky (Ukrainian Cheese Pancakes) Delivery London',
        description:
          'Order authentic handmade Ukrainian syrnyky — cottage cheese pancakes — delivered to your door in London. Same-day delivery across Zones 1–3.',
        keywords: ['syrnyky london', 'cheese pancakes london', 'ukrainian pancakes london', 'syrnyky delivery london', 'syrniki london'],
      },
      uk: {
        title: 'Купити сирники в Лондоні — доставка | zhyto.london',
        description:
          'Замовте домашні українські сирники в Лондоні — ніжні сирні панкейки з доставкою по Лондону. Замовлення в день замовлення по Zones 1–3.',
        keywords: ['сирники лондон', 'купити сирники лондон', 'сирники з сиром лондон', 'доставка сирників лондон'],
      },
      pl: {
        title: 'Syrniki (ukraińskie placuszki z twarogu) dostawa Londyn',
        description:
          'Zamów domowe ukraińskie syrniki — placuszki z twarogu — z dostawą w Londynie. Dostawa tego samego dnia w Zones 1–3.',
        keywords: ['syrniki londyn', 'syrniki z twarogu londyn', 'ukrainskie slodkosci londyn', 'syrniki dostawa londyn'],
      },
    },
    pelmeni: {
      en: {
        title: 'Pelmeni Delivery London | Ukrainian-Dumplings',
        description:
          'Order authentic Siberian-style pelmeni delivered to your door in London. Handmade dough pockets with juicy filling — cooked at home in minutes.',
        keywords: ['pelmeni london', 'pelmeni delivery london', 'ukrainian dumplings london', 'pelmeni online', 'pierogi london'],
      },
      uk: {
        title: 'Купити пельмені в Лондоні — доставка | zhyto.london',
        description:
          'Замовте домашні пельмені в Лондоні — соковиті пельмені ручної ліпки з доставкою по Лондону. Готуються за кілька хвилин вдома.',
        keywords: ['пельмені лондон', 'купити пельмені лондон', 'пельмені з мясом лондон', 'доставка пельменів лондон'],
      },
      pl: {
        title: 'Pielmieni (ukraińskie pierogi z mięsem) dostawa Londyn',
        description:
          'Zamów domowe pielmieni w Londynie — soczyste pierogi z mięsem ręcznie lepione, z dostawą po Londynie. Gotowe w kilka minut w domu.',
        keywords: ['pielmieni londyn', 'pierogi z miesa londyn', 'pielmieni dostawa londyn', 'ukrainskie pierogi londyn'],
      },
    },
  },
}

export function langCode(lang: Lang): string {
  return lang === 'uk' ? 'uk' : lang === 'pl' ? 'pl' : 'en'
}

export function hrefFor(lang: Lang, category?: CategorySlug): string {
  const base = lang === 'en' ? '' : `/${lang}`
  return category ? `${base}/${category}` : base || '/'
}

export interface HomeData {
  preloadedProducts: any[] | null
  preloadedCategoryOrder: string[] | null
  preloadedCategoryNames: Record<string, string>
  preloadedCategoryDescriptions: Record<string, string>
  preloadedCategoryNamesPl: Record<string, string>
  preloadedCategoryDescPl: Record<string, string>
  preloadedCategoryDescUk: Record<string, string>
  enabledLanguages: Lang[]
  seo: SeoLocale
  seoEntry: SeoEntry
  jsonLd: object[]
}

function pickSeo(entry: SeoEntry, lang: Lang, category?: CategorySlug): SeoLocale {
  if (category) {
    const cat = entry.categories[category]
    if (cat && cat[lang]) return cat[lang]
    if (cat && cat.en) return cat.en
  }
  return entry.home[lang] || entry.home.en
}

export const getHomeData = cache(
  async (lang: Lang = 'en', category?: CategorySlug): Promise<HomeData> => {
    let preloadedProducts: any[] | null = null
    let preloadedCategoryOrder: string[] | null = null
    let enabledLanguages: Lang[] = ALL_LANGS
    const preloadedCategoryNames: Record<string, string> = {}
    const preloadedCategoryDescriptions: Record<string, string> = {}
    const preloadedCategoryNamesPl: Record<string, string> = {}
    const preloadedCategoryDescPl: Record<string, string> = {}
    const preloadedCategoryDescUk: Record<string, string> = {}

    try {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('sort_order', { ascending: true })
        .throwOnError()
      if (products) preloadedProducts = products as any[]
    } catch {
      // products unavailable
    }

    let seoEntry: SeoEntry = DEFAULT_SEO
    try {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', [
          'delivery', 'categories', 'categories_desc', 'categories_names',
          'categories_desc_uk', 'categories_names_pl', 'categories_desc_pl',
          'promo_codes', 'about_images', 'enabled_languages', 'seo',
        ])
        .throwOnError()
      if (data) {
        const settingsData: Record<string, any> = {}
        for (const row of data) settingsData[row.key] = row.value
        if (settingsData.categories) preloadedCategoryOrder = settingsData.categories as string[]
        if (settingsData.categories_names) Object.assign(preloadedCategoryNames, settingsData.categories_names)
        if (settingsData.categories_desc) Object.assign(preloadedCategoryDescriptions, settingsData.categories_desc)
        if (settingsData.categories_names_pl) Object.assign(preloadedCategoryNamesPl, settingsData.categories_names_pl)
        if (settingsData.categories_desc_pl) Object.assign(preloadedCategoryDescPl, settingsData.categories_desc_pl)
        if (settingsData.categories_desc_uk) Object.assign(preloadedCategoryDescUk, settingsData.categories_desc_uk)
        if (settingsData.enabled_languages?.length) enabledLanguages = settingsData.enabled_languages
        if (settingsData.seo && typeof settingsData.seo === 'object') {
          seoEntry = {
            home: { ...DEFAULT_SEO.home, ...(settingsData.seo.home || {}) },
            categories: { ...DEFAULT_SEO.categories, ...(settingsData.seo.categories || {}) },
          }
        }
      }
    } catch {
      // settings unavailable
    }

    if (lang !== 'en' && !enabledLanguages.includes(lang)) {
      notFound()
    }

    const seo = pickSeo(seoEntry, lang, category)
    const pageHref = hrefFor(lang, category)
    const homeHref = hrefFor(lang)
    const dataImages = (preloadedProducts || []).filter((p: any) => typeof p.image === 'string' && p.image.startsWith('data:'))

    const jsonLd: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'FoodEstablishment',
        '@id': `${SITE_URL}/#restaurant`,
        name: 'zhyto.london',
        url: SITE_URL,
        image: `${SITE_URL}/images/Gemini_Generated_Image_hmwm3ehmwm3ehmwm.png`,
        servesCuisine: ['Ukrainian', 'Dumplings'],
        priceRange: '£',
        areaServed: { '@type': 'City', name: 'London' },
        description: 'Handcrafted Ukrainian varenyky and syrnyky delivered to your door in London.',
        sameAs: ['https://www.instagram.com/zhyto.london/', 'https://t.me/dunaimore'],
      },
    ]

    if (category) {
      const catLabels: Record<string, string> = {
        varenyky: 'Varenyky',
        syrnyky: 'Syrnyky',
        pelmeni: 'Pelmeni',
      }
      jsonLd.push(
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'zhyto.london', item: `${SITE_URL}${homeHref}` },
            { '@type': 'ListItem', position: 2, name: catLabels[category], item: `${SITE_URL}${pageHref}` },
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${catLabels[category]} — zhyto.london`,
          itemListElement: (preloadedProducts || [])
            .filter((p: any) => p.category === category)
            .map((p: any, i: number) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Product',
                name: p.name,
                image: imageUrlFor(p.image),
                offers: {
                  '@type': 'Offer',
                  price: String(p.price),
                  priceCurrency: 'GBP',
                  availability: p.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
                },
              },
            })),
        }
      )
    } else {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'zhyto.london menu',
        itemListElement: (preloadedProducts || []).map((p: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            image: imageUrlFor(p.image),
            offers: {
              '@type': 'Offer',
              price: String(p.price),
              priceCurrency: 'GBP',
              availability: p.stock === 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            },
          },
        })),
      })
    }

    return {
      preloadedProducts,
      preloadedCategoryOrder,
      preloadedCategoryNames,
      preloadedCategoryDescriptions,
      preloadedCategoryNamesPl,
      preloadedCategoryDescPl,
      preloadedCategoryDescUk,
      enabledLanguages,
      seo,
      seoEntry,
      jsonLd,
    }
  }
)

function imageUrlFor(image: unknown): string {
  const fallback = `${SITE_URL}/images/hero-varenyky.jpg`
  if (typeof image !== 'string' || !image) return fallback
  if (image.startsWith('data:')) return fallback
  if (image.startsWith('http')) return image
  return `${SITE_URL}${image}`
}

export function canonicalFor(lang: Lang, category?: CategorySlug): string {
  return `${SITE_URL}${hrefFor(lang, category)}`
}