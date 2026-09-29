import type { MetadataRoute } from 'next'

import { localePath, locales } from '@/i18n/config'
import { getActiveCategories, getProjects, getServices } from '@/lib/data'

const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const dynamic = 'force-dynamic'

// Every page in both languages, each entry pointing at its other-language version.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, categories] = await Promise.all([getServices('zh'), getProjects('zh'), getActiveCategories('zh')])
  const paths = [
    '/',
    '/about',
    '/services',
    '/works',
    '/process',
    '/faq',
    '/contact',
    ...services.map((s) => `/services/${s.slug}`),
    ...categories.map((c) => `/works/category/${c.slug}`),
    ...projects.map((p) => `/works/${p.slug}`),
  ]
  const url = (lang: (typeof locales)[number], path: string) => `${base}${localePath(lang, path)}`
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: url(lang, path),
      alternates: { languages: { 'zh-Hant-TW': url('zh', path), en: url('en', path) } },
    })),
  )
}
