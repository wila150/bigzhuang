import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Category, Media, Project, Service } from '@/payload-types'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSettings = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'site-settings' }),
)

export const getHome = cache(async () => (await getPayloadClient()).findGlobal({ slug: 'home-page' }))
export const getAbout = cache(async () => (await getPayloadClient()).findGlobal({ slug: 'about-page' }))
export const getProcess = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'process-page' }),
)

export const getServices = cache(async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'services',
    where: { published: { equals: true } },
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return res.docs
})

export const getService = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'services',
    where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
})

export const getProjects = cache(async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'projects',
    where: { published: { equals: true } },
    sort: 'order',
    limit: 200,
    depth: 2,
  })
  return res.docs
})

export const getProject = cache(async (slug: string) => {
  const projects = await getProjects()
  return projects.find((p) => p.slug === slug) ?? null
})

/** Categories that have at least one published project — empty ones stay hidden. */
export const getActiveCategories = cache(async () => {
  const payload = await getPayloadClient()
  const [cats, projects] = await Promise.all([
    payload.find({ collection: 'categories', sort: 'order', limit: 100 }),
    getProjects(),
  ])
  const used = new Set(projects.map((p) => categoryOf(p)?.id))
  return cats.docs.filter((c) => used.has(c.id))
})

export const getFaqs = cache(async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'faqs', sort: 'order', limit: 100 })
  return res.docs
})

export function categoryOf(project: Project): Category | null {
  return typeof project.category === 'object' ? project.category : null
}

export function media(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' && value.url ? value : null
}

export function mediaUrl(value: number | Media | null | undefined, size?: 'thumb' | 'card' | 'large') {
  const m = media(value)
  if (!m) return null
  const url = (size && m.sizes?.[size]?.url) || m.url
  // Payload prefixes serverURL; keep same-origin paths relative so next/image treats them as local.
  return url ? url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '') : null
}

export function projectsForService(service: Service, projects: Project[]) {
  const ids = new Set(
    (service.relatedCategories ?? []).map((c) => (typeof c === 'object' ? c.id : c)),
  )
  return projects.filter((p) => ids.has(categoryOf(p)?.id ?? -1))
}
