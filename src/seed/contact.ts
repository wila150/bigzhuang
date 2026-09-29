/**
 * Puts the current contact page text, form fields and bottom banner into the admin so they can be edited.
 * Only fills what is empty; safe to rerun. Run with: npm run seed:contact
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { contactDefaults, ctaDefaults, defaultFields } from '../lib/contact-defaults'

const payload = await getPayload({ config })

const page = await payload.findGlobal({ slug: 'contact-page' })
const data: Record<string, unknown> = {}
for (const [k, v] of Object.entries(contactDefaults)) {
  const cur = (page as unknown as Record<string, unknown>)[k]
  if (cur === null || cur === undefined || cur === '') data[k] = v
}
if (!page.fields?.length) data.fields = defaultFields
await payload.updateGlobal({ slug: 'contact-page', draft: false, data: { ...data, _status: 'published' } })

const s = await payload.findGlobal({ slug: 'site-settings' })
await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    ctaTitle: s.ctaTitle || ctaDefaults.ctaTitle,
    ctaText: s.ctaText || ctaDefaults.ctaText,
    ctaButton: s.ctaButton || ctaDefaults.ctaButton,
  },
})

payload.logger.info('Contact page content ready')
process.exit(0)
