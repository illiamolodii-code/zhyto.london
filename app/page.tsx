import { productsService } from '@/lib/services/products.service'
import { getSupabaseAdmin } from '@/lib/utils/supabase'
import HomeClient from './HomeClient'

export default async function Home() {
  let preloadedProducts: any[] | null = null
  let preloadedCategoryOrder: string[] | null = null
  const preloadedCategoryNames: Record<string, string> = {}
  const preloadedCategoryDescriptions: Record<string, string> = {}
  const preloadedCategoryNamesPl: Record<string, string> = {}
  const preloadedCategoryDescPl: Record<string, string> = {}
  const preloadedCategoryDescUk: Record<string, string> = {}

  try {
    const [products, settingsData] = await Promise.all([
      productsService.getAllProducts().catch(() => null),
      getSupabaseAdmin()
        .from('settings')
        .select('key, value')
        .in('key', [
          'delivery', 'categories', 'categories_desc', 'categories_names',
          'categories_desc_uk', 'categories_names_pl', 'categories_desc_pl',
          'promo_codes', 'about_images', 'enabled_languages',
        ])
        .then(({ data }) => {
          const result: Record<string, any> = {}
          for (const row of data || []) result[row.key] = row.value
          return result
        })
        .catch(() => ({})),
    ])

    if (products) preloadedProducts = products as any[]
    if (settingsData.categories) preloadedCategoryOrder = settingsData.categories as string[]
    if (settingsData.categories_names) Object.assign(preloadedCategoryNames, settingsData.categories_names)
    if (settingsData.categories_desc) Object.assign(preloadedCategoryDescriptions, settingsData.categories_desc)
    if (settingsData.categories_names_pl) Object.assign(preloadedCategoryNamesPl, settingsData.categories_names_pl)
    if (settingsData.categories_desc_pl) Object.assign(preloadedCategoryDescPl, settingsData.categories_desc_pl)
    if (settingsData.categories_desc_uk) Object.assign(preloadedCategoryDescUk, settingsData.categories_desc_uk)
  } catch {
    // Data unavailable at build time — client will fetch on its own
  }

  return (
    <HomeClient
      preloadedProducts={preloadedProducts}
      preloadedCategoryOrder={preloadedCategoryOrder}
      preloadedCategoryNames={preloadedCategoryNames}
      preloadedCategoryDescriptions={preloadedCategoryDescriptions}
      preloadedCategoryNamesPl={preloadedCategoryNamesPl}
      preloadedCategoryDescPl={preloadedCategoryDescPl}
      preloadedCategoryDescUk={preloadedCategoryDescUk}
    />
  )
}
