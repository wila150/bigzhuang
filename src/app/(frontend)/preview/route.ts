import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/data'

// Entry point for the admin's Live Preview iframe: turns on draft mode for admins, then opens the page.
export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get('path') || '/'
  // Only same-site paths, never an open redirect.
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/'

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (user?.collection !== 'users') return new Response('Preview is for admins only', { status: 403 })

  ;(await draftMode()).enable()
  redirect(safePath)
}
