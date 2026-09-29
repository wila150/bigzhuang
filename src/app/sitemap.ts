import type { MetadataRoute } from 'next'

import { getActiveCategories, getProjects, getServices } from '@/lib/data'

const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, categories] = await Promise.all([getServices(), getProjects(), getActiveCategories()])
  const paths = [
    '',
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
  return paths.map((p) => ({ url: `${base}${p}` }))
}
