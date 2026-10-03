import type { Payload } from 'payload'

import { notifyAdmin } from '../line/notify'
import type { Site } from '../payload-types'

// A sleeping Render free instance takes up to ~50s to boot, so the first request after a nap must be allowed to be slow.
const TIMEOUT_MS = 60_000
// One failure can be a cold start or a network blip; only alert once it fails twice in a row (~20 minutes).
const FAILS_BEFORE_DOWN = 2

type Result = { ok: true; ms: number } | { ok: false; ms: number; error: string }

export function siteHealthUrl(site: Pick<Site, 'url' | 'healthPath'>) {
  return new URL(site.healthPath || '/', site.url).toString()
}

async function ping(url: string): Promise<Result> {
  const started = Date.now()
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      redirect: 'follow',
      headers: { 'User-Agent': 'BigZhaung-Monitor/1.0' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    // Drain the body so the connection is released.
    await res.arrayBuffer().catch(() => {})
    const ms = Date.now() - started
    return res.ok ? { ok: true, ms } : { ok: false, ms, error: `HTTP ${res.status}` }
  } catch (e) {
    const ms = Date.now() - started
    const timedOut = e instanceof Error && e.name === 'TimeoutError'
    return { ok: false, ms, error: timedOut ? `逾時（超過 ${TIMEOUT_MS / 1000} 秒沒回應）` : e instanceof Error ? e.message : String(e) }
  }
}

async function checkSite(payload: Payload, site: Site) {
  const url = siteHealthUrl(site)
  const result = await ping(url)
  const now = new Date().toISOString()
  const failCount = result.ok ? 0 : (site.failCount ?? 0) + 1
  const prev = site.status ?? 'unknown'
  const next = result.ok ? 'up' : failCount >= FAILS_BEFORE_DOWN ? 'down' : prev

  await payload.update({
    collection: 'sites',
    id: site.id,
    overrideAccess: true,
    context: { monitorCheck: true },
    data: {
      status: next,
      failCount,
      lastCheckedAt: now,
      responseMs: result.ms,
      lastError: result.ok ? null : result.error,
      ...(next !== prev && { statusSince: now }),
    },
  })

  if (next === 'down' && prev !== 'down') {
    await notifyAdmin(payload, 'monitor', `🔴 網站斷線：${site.name}\n${url}\n原因：${result.ok ? '' : result.error}`)
  } else if (next === 'up' && prev === 'down') {
    await notifyAdmin(payload, 'monitor', `🟢 網站恢復：${site.name}\n${url}\n回應時間：${result.ms} ms`)
  }
}

/** Ping every enabled site in parallel, record the result, and LINE the admin when one goes down or comes back. */
export async function checkAllSites(payload: Payload) {
  const { docs } = await payload.find({
    collection: 'sites',
    where: { enabled: { equals: true } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })
  const results = await Promise.allSettled(docs.map((site) => checkSite(payload, site)))
  results.forEach((r, i) => {
    if (r.status === 'rejected') payload.logger.warn(`Site check (${docs[i].name}) failed: ${r.reason}`)
  })
  return docs.length
}
