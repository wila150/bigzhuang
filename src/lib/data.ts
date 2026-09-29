import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type { Category, Media, Project, Service } from '@/payload-types'

export const getPayloadClient = cache(async () => getPayload({ config }))

/** True inside the admin's Live Preview (draft mode is only ever enabled for admins, see /preview). */
export const isPreview = cache(async () => (await draftMode()).isEnabled)

/** Visitors see only published, 上架 docs; the preview shows the latest drafts. */
async function visible(extra: Where[] = []): Promise<{ draft: boolean; where: Where }> {
  const draft = await isPreview()
  const rules: Where[] = [{ published: { equals: true } }, ...extra]
  if (!draft) rules.push({ _status: { equals: 'published' } })
  return { draft, where: { and: rules } }
}

export const getSettings = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'site-settings' }),
)

export const getHome = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'home-page', draft: await isPreview() }),
)
export const getAbout = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'about-page', draft: await isPreview() }),
)
export const getProcess = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'process-page', draft: await isPreview() }),
)

export const getServices = cache(async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'services',
    ...(await visible()),
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
    ...(await visible([{ slug: { equals: slug } }])),
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
})

export const getProjects = cache(async () => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'projects',
    ...(await visible()),
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
