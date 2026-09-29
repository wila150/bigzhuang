import { headers } from 'next/headers'

import type { Client } from '@/payload-types'

import { getPayloadClient } from './data'

/** The signed-in portal client, or null (admins and visitors get null). */
export async function getCurrentClient(): Promise<Client | null> {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || user.collection !== 'clients') return null
  return payload.findByID({ collection: 'clients', id: user.id, depth: 0, overrideAccess: true })
}
