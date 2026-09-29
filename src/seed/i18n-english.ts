/**
 * Fills the English locale from the Chinese content using the translation table in i18n-english-strings.ts.
 * Only strings with a translation are written; anything else falls back to Chinese on the site.
 * Run with: npm run seed:english
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { english } from './i18n-english-strings'

const payload = await getPayload({ config })

// Keys of localized text fields (see localized: true in the collections/globals). tech[] and skills[] names stay shared.
const LOCALIZED = new Set(
  'title summary item tagline problem solution description tag siteType industry name question answer alt heroTitle heroText ctaTitle ctaText intro why story duration heroLead channelsTitle lineNote emailNote instagramNote formTitle label placeholder hint options emptyOption contactHint requireContactMessage submitLabel successTitle successText errorText serviceArea footerBlurb ctaButton seoTitle seoDescription paymentNote'.split(' '),
)
const SHARED_ARRAYS = new Set(['tech', 'skills'])
const DROP = new Set(['id', 'createdAt', 'updatedAt', 'globalType', '_status'])
let translated = 0
const untranslated = new Set<string>()

/** Copy of a zh doc with every localized string swapped for its English version (array row ids kept). */
function toEnglish(value: unknown, key = '', parent = '', top = true): unknown {
  if (Array.isArray(value)) return value.map((v) => toEnglish(v, key, key, false))
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      if (top && DROP.has(k)) continue
      out[k] = toEnglish(v, k, parent, false)
    }
    return out
  }
  if (typeof value === 'string' && LOCALIZED.has(key) && !SHARED_ARRAYS.has(parent)) {
    if (value in english) {
      translated++
      return english[value]
    }
    if (/[一-鿿]/.test(value)) untranslated.add(value)
  }
  return value
}

for (const collection of ['services', 'projects'] as const) {
  const published = await payload.find({ collection, limit: 500, depth: 0, draft: false, locale: 'zh', overrideAccess: true })
  const drafts = await payload.find({ collection, limit: 500, depth: 0, draft: true, locale: 'zh', overrideAccess: true })
  const all = [...drafts.docs, ...published.docs.filter((p) => !drafts.docs.some((d) => d.id === p.id))]
  for (const doc of all) {
    const isDraft = doc._status === 'draft'
    await payload.update({
      collection,
      id: doc.id,
      locale: 'en',
      draft: isDraft,
      overrideAccess: true,
      data: { ...(toEnglish(doc) as object), _status: isDraft ? 'draft' : 'published' },
    })
  }
  console.log(collection, all.length)
}

for (const collection of ['categories', 'faqs'] as const) {
  const { docs } = await payload.find({ collection, limit: 1000, depth: 0, locale: 'zh', overrideAccess: true })
  for (const doc of docs) await payload.update({ collection, id: doc.id, locale: 'en', overrideAccess: true, data: toEnglish(doc) as object })
  console.log(collection, docs.length)
}

const media = await payload.find({ collection: 'media', limit: 1000, depth: 0, locale: 'zh', overrideAccess: true })
for (const m of media.docs) {
  if (m.alt && m.alt in english) {
    translated++
    await payload.update({ collection: 'media', id: m.id, locale: 'en', overrideAccess: true, data: { alt: english[m.alt] } })
  }
}
console.log('media', media.docs.length)

for (const slug of ['home-page', 'about-page', 'process-page', 'contact-page'] as const) {
  const doc = await payload.findGlobal({ slug, depth: 0, draft: false, locale: 'zh', overrideAccess: true })
  await payload.updateGlobal({ slug, locale: 'en', draft: false, overrideAccess: true, data: { ...(toEnglish(doc) as object), _status: 'published' } })
  console.log(slug)
}
const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, locale: 'zh', overrideAccess: true })
await payload.updateGlobal({ slug: 'site-settings', locale: 'en', overrideAccess: true, data: toEnglish(settings) as object })

console.log(`ENGLISH translated ${translated} values, ${untranslated.size} left in Chinese (shown with fallback)`)
untranslated.forEach((s) => console.log('   untranslated:', s))
process.exit(0)
