/**
 * Exports all translatable content (published + latest draft) to JSON before switching fields to localized.
 * Usage: BACKUP_FILE=path npm run payload run src/seed/i18n-dump.ts
 */
import config from '@payload-config'
import fs from 'fs'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const out: Record<string, unknown> = { takenAt: new Date().toISOString() }

for (const collection of ['services', 'projects'] as const) {
  const published = await payload.find({ collection, limit: 500, depth: 0, draft: false, overrideAccess: true })
  const drafts = await payload.find({ collection, limit: 500, depth: 0, draft: true, overrideAccess: true })
  // Docs created before drafts were enabled have no versions, so draft queries miss them: fall back to published.
  const latest = [...drafts.docs, ...published.docs.filter((p) => !drafts.docs.some((d) => d.id === p.id))]
  out[collection] = { published: published.docs, latest }
}
for (const collection of ['categories', 'faqs', 'media'] as const) {
  out[collection] = (await payload.find({ collection, limit: 1000, depth: 0, overrideAccess: true })).docs
}
for (const slug of ['home-page', 'about-page', 'process-page', 'contact-page'] as const) {
  out[slug] = {
    published: await payload.findGlobal({ slug, depth: 0, draft: false, overrideAccess: true }),
    latest: await payload.findGlobal({ slug, depth: 0, draft: true, overrideAccess: true }),
  }
}
out['site-settings'] = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })

fs.writeFileSync(process.env.BACKUP_FILE!, JSON.stringify(out, null, 2))
console.log('backup written', process.env.BACKUP_FILE)
process.exit(0)
