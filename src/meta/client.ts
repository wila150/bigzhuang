import crypto from 'crypto'

import type { Platform, Reply } from '@/chat/engine'

/**
 * Facebook Messenger + Instagram direct messages through the Messenger Platform.
 * Needs the app secret (webhook signatures), a fan page access token (sending), and a verify token (webhook setup).
 * Instagram messages arrive once the IG professional account is linked to the same fan page.
 */
const GRAPH = 'https://graph.facebook.com/v23.0'
const appSecret = process.env.META_APP_SECRET || ''
const pageToken = process.env.META_PAGE_ACCESS_TOKEN || ''
export const metaVerifyToken = process.env.META_VERIFY_TOKEN || ''

export const metaEnabled = Boolean(appSecret && pageToken && metaVerifyToken)

export function verifyMetaSignature(rawBody: string, header: string | null) {
  if (!header?.startsWith('sha256=') || !appSecret) return false
  const expected = crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')
  const given = header.slice(7)
  return given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

export async function graph(path: string, init: RequestInit = {}, token = pageToken) {
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`${GRAPH}${path}${sep}access_token=${encodeURIComponent(token)}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Meta ${path.split('?')[0]} failed: ${res.status} ${JSON.stringify(body).slice(0, 300)}`)
  return body
}

type MetaMessage = Record<string, unknown>

/** Messenger/Instagram versions of the shared chat replies. */
export function toMeta(replies: Reply[], platform: Platform): MetaMessage[] {
  return replies.map((r) => {
    if (r.kind === 'question') {
      const hint = r.options.length ? '（點選下方選項，或直接輸入回答）' : '（直接輸入回答）'
      return {
        text: `Q${r.index + 1}／${r.total}　${r.question}\n${hint}`.slice(0, 1000),
        quick_replies: [...r.options, '取消'].slice(0, 13).map((o) => ({ content_type: 'text', title: o.slice(0, 20), payload: o })),
      }
    }
    if (r.kind === 'link') {
      // Instagram has no button template, so the link goes in the text.
      if (platform === 'instagram' || r.text.length > 640) return { text: `${r.text}\n\n👉 ${r.label}：${r.url}`.slice(0, 1000) }
      return {
        attachment: {
          type: 'template',
          payload: { template_type: 'button', text: r.text, buttons: [{ type: 'web_url', url: r.url, title: r.label.slice(0, 20) }] },
        },
      }
    }
    return { text: r.text.slice(0, 2000) }
  })
}

export async function sendMeta(recipientId: string, messages: MetaMessage[]) {
  for (const message of messages) {
    await graph('/me/messages', {
      method: 'POST',
      body: JSON.stringify({ recipient: { id: recipientId }, messaging_type: 'RESPONSE', message }),
    })
  }
}

/** The "typing…" bubble in Messenger / Instagram; it clears when our next message arrives. Never throws. */
export async function metaTyping(recipientId: string) {
  try {
    await graph('/me/messages', { method: 'POST', body: JSON.stringify({ recipient: { id: recipientId }, sender_action: 'typing_on' }) })
  } catch {
    // Cosmetic only.
  }
}

export async function metaDisplayName(userId: string, platform: Platform) {
  const fallback = platform === 'instagram' ? 'Instagram 使用者' : 'Facebook 使用者'
  try {
    if (platform === 'instagram') {
      const p = (await graph(`/${userId}?fields=name,username`)) as { name?: string; username?: string }
      return p.name || (p.username ? `@${p.username}` : fallback)
    }
    const p = (await graph(`/${userId}?fields=first_name,last_name`)) as { first_name?: string; last_name?: string }
    return [p.last_name, p.first_name].filter(Boolean).join('') || fallback
  } catch {
    return fallback
  }
}
