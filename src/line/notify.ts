import type { Payload } from 'payload'

import { lineEnabled, push } from './client'

/** Push a text message to the admin's LINE if notifications of this kind are on. Never throws. */
export async function notifyAdmin(payload: Payload, kind: 'inquiry' | 'payment', text: string) {
  if (!lineEnabled) return
  try {
    const settings = await payload.findGlobal({ slug: 'line-settings', overrideAccess: true })
    const on = kind === 'inquiry' ? settings.notifyInquiry !== false : settings.notifyPayment !== false
    if (!settings.adminUserId || !on) return
    await push(settings.adminUserId, [{ type: 'text', text: text.slice(0, 4900) }])
  } catch (e) {
    payload.logger.warn(`LINE notify (${kind}) failed: ${e instanceof Error ? e.message : e}`)
  }
}
