import { supabase } from '@/lib/utils/supabase'
import { SITE_URL } from '@/lib/constants'
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

  try {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', [
        'delivery', 'categories', 'categories_desc', 'categories_names',
        'categories_desc_uk', 'categories_names_pl', 'categories_desc_pl',
        'promo_codes', 'about_images', 'enabled_languages',
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
    }
  } catch {
    // settings unavailable
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "FoodEstablishment",
              "@id": `${SITE_URL}/#restaurant`,
              name: "zhyto.london",
              url: SITE_URL,
              image: `${SITE_URL}/images/Gemini_Generated_Image_hmwm3ehmwm3ehmwm.png`,
              servesCuisine: ["Ukrainian", "Dumplings"],
              priceRange: "£",
              areaServed: { "@type": "City", name: "London" },
              description: "Handcrafted Ukrainian varenyky and syrnyky delivered to your door in London.",
              sameAs: [
                "https://www.instagram.com/zhyto.london/",
                "https://t.me/dunaimore",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "zhyto.london menu",
              itemListElement: (preloadedProducts || []).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Product",
                  name: p.name,
                  image:
                    (p.image && (p.image.startsWith('http') ? p.image : `${SITE_URL}${p.image}`)) ||
                    `${SITE_URL}/images/hero-varenyky.jpg`,
                  offers: {
                    "@type": "Offer",
                    price: String(p.price),
                    priceCurrency: "GBP",
                    availability: p.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                  },
                },
              })),
            },
          ]),
        }}
      />
      <HomeClient
        preloadedProducts={preloadedProducts}
        preloadedCategoryOrder={preloadedCategoryOrder}
        preloadedCategoryNames={preloadedCategoryNames}
        preloadedCategoryDescriptions={preloadedCategoryDescriptions}
        preloadedCategoryNamesPl={preloadedCategoryNamesPl}
        preloadedCategoryDescPl={preloadedCategoryDescPl}
        preloadedCategoryDescUk={preloadedCategoryDescUk}
      />
    </>
  )
}
