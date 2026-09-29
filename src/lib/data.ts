import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type { Lang } from '@/i18n/config'
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

/**
 * Finds docs as visitors or the preview should see them. In preview, docs that have never been saved as a
 * draft (created before drafts were enabled) are missing from draft queries, so the published copy fills in.
 */
async function findVisible<T extends 'services' | 'projects'>(
  collection: T,
  lang: Lang,
  opts: { extra?: Where[]; limit: number; depth: number },
) {
  const payload = await getPayloadClient()
  const { draft, where } = await visible(opts.extra)
  const base = { collection, where, sort: 'order', limit: opts.limit, depth: opts.depth, locale: lang } as const
  const res = await payload.find({ ...base, draft })
  if (!draft) return res.docs
  const published = await payload.find({ ...base, draft: false })
  const merged = [...res.docs, ...published.docs.filter((p) => !res.docs.some((d) => d.id === p.id))]
  return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

const global = <S extends 'home-page' | 'about-page' | 'process-page' | 'contact-page'>(slug: S) =>
  cache(async (lang: Lang) => (await getPayloadClient()).findGlobal({ slug, draft: await isPreview(), locale: lang }))

export const getSettings = cache(async (lang: Lang) =>
  (await getPayloadClient()).findGlobal({ slug: 'site-settings', locale: lang }),
)
export const getHome = global('home-page')
export const getAbout = global('about-page')
export const getProcess = global('process-page')
export const getContactPage = global('contact-page')

export const getServices = cache(async (lang: Lang) => findVisible('services', lang, { limit: 50, depth: 1 }))

export const getService = cache(async (lang: Lang, slug: string) => {
  const docs = await findVisible('services', lang, { extra: [{ slug: { equals: slug } }], limit: 1, depth: 1 })
  return docs[0] ?? null
})

export const getProjects = cache(async (lang: Lang) => findVisible('projects', lang, { limit: 200, depth: 2 }))

export const getProject = cache(async (lang: Lang, slug: string) => {
  const projects = await getProjects(lang)
  return projects.find((p) => p.slug === slug) ?? null
})

/** Categories that have at least one published project — empty ones stay hidden. */
export const getActiveCategories = cache(async (lang: Lang) => {
  const payload = await getPayloadClient()
  const [cats, projects] = await Promise.all([
    payload.find({ collection: 'categories', sort: 'order', limit: 100, locale: lang }),
    getProjects(lang),
  ])
  const used = new Set(projects.map((p) => categoryOf(p)?.id))
  return cats.docs.filter((c) => used.has(c.id))
})

export const getFaqs = cache(async (lang: Lang) => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'faqs', sort: 'order', limit: 100, locale: lang })
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
