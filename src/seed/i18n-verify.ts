/** Compares Chinese content in the database with a pre-localization backup. Usage: BACKUP_FILE=... payload run */
import config from '@payload-config'
import fs from 'fs'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const backup = JSON.parse(fs.readFileSync(process.env.BACKUP_FILE!, 'utf8'))
let checked = 0
const problems: string[] = []

// Compare every string leaf of `before` with the same path in `after`, ignoring ids/timestamps.
function compare(label: string, before: unknown, after: unknown, path = '') {
  if (typeof before === 'string') {
    if (['id', 'updatedAt', 'createdAt', 'url', 'thumbnailURL'].some((k) => path.endsWith(k))) return
    checked++
    if (before !== after) problems.push(`${label}${path}: ${JSON.stringify(before).slice(0, 40)} → ${JSON.stringify(after).slice(0, 40)}`)
  } else if (Array.isArray(before)) {
    before.forEach((v, i) => compare(label, v, Array.isArray(after) ? after[i] : undefined, `${path}[${i}]`))
  } else if (before && typeof before === 'object') {
    for (const [k, v] of Object.entries(before)) {
      if (k === 'sizes') continue
      compare(label, v, after && typeof after === 'object' ? (after as Record<string, unknown>)[k] : undefined, `${path}.${k}`)
    }
  }
}

for (const c of ['services', 'projects'] as const) {
  for (const which of ['published', 'latest'] as const) {
    const draft = which === 'latest'
    const pub = await payload.find({ collection: c, limit: 500, depth: 0, draft: false, locale: 'zh', overrideAccess: true })
    const dr = draft ? await payload.find({ collection: c, limit: 500, depth: 0, draft: true, locale: 'zh', overrideAccess: true }) : pub
    const now = [...dr.docs, ...pub.docs.filter((p) => !dr.docs.some((d) => d.id === p.id))]
    for (const b of backup[c][which]) compare(`${c}/${which}/${b.slug}`, b, now.find((d) => d.id === b.id))
  }
}
for (const c of ['categories', 'faqs', 'media'] as const) {
  const now = (await payload.find({ collection: c, limit: 1000, depth: 0, locale: 'zh', overrideAccess: true })).docs
  for (const b of backup[c]) compare(`${c}/${b.id}`, b, now.find((d) => d.id === b.id))
}
for (const g of ['home-page', 'about-page', 'process-page', 'contact-page'] as const) {
  compare(`${g}/published`, backup[g].published, await payload.findGlobal({ slug: g, depth: 0, draft: false, locale: 'zh', overrideAccess: true }))
  compare(`${g}/latest`, backup[g].latest, await payload.findGlobal({ slug: g, depth: 0, draft: true, locale: 'zh', overrideAccess: true }))
}
compare('site-settings', backup['site-settings'], await payload.findGlobal({ slug: 'site-settings', depth: 0, locale: 'zh', overrideAccess: true }))

console.log(`VERIFY checked ${checked} text values, ${problems.length} differences`)
problems.slice(0, 15).forEach((p) => console.log('  ', p))
process.exit(0)
