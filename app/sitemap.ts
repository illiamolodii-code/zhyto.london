import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const routes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  ] as const

  return routes.map(route => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        'x-default': `${SITE_URL}${route.path}`,
        'en': `${SITE_URL}${route.path}`,
      },
    },
  }))
}