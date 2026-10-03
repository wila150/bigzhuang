import crypto from 'crypto'

/**
 * LINE Messaging API. Only the channel ID + secret are needed: short-lived
 * "stateless" access tokens are issued on demand, so there is no long-lived token to rotate.
 */
const channelId = process.env.LINE_CHANNEL_ID || ''
const channelSecret = process.env.LINE_CHANNEL_SECRET || ''

export const lineEnabled = Boolean(channelId && channelSecret)

let cached: { token: string; expiresAt: number } | null = null

export async function lineToken() {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token
  const res = await fetch('https://api.line.me/oauth2/v3/token', {
    method: 'POST',
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: channelId, client_secret: channelSecret }),
  })
  if (!res.ok) throw new Error(`LINE token failed: ${res.status} ${await res.text()}`)
  const data = (await res.json()) as { access_token: string; expires_in: number }
  cached = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
  return cached.token
}

export async function lineApi(path: string, init: RequestInit = {}, host = 'https://api.line.me') {
  const res = await fetch(`${host}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await lineToken()}`, 'Content-Type': 'application/json', ...init.headers },
  })
  if (!res.ok) throw new Error(`LINE ${path} failed: ${res.status} ${await res.text()}`)
  const text = await res.text()
  return text ? JSON.parse(text) : {}
}

export type LineMessage = Record<string, unknown>

export const reply = (replyToken: string, messages: LineMessage[]) =>
  lineApi('/v2/bot/message/reply', { method: 'POST', body: JSON.stringify({ replyToken, messages: messages.slice(0, 5) }) })

export const push = (to: string, messages: LineMessage[]) =>
  lineApi('/v2/bot/message/push', { method: 'POST', body: JSON.stringify({ to, messages: messages.slice(0, 5) }) })

/** The "…" loading animation in a one-on-one chat; it disappears when our next message arrives. Never throws. */
export async function showLoading(chatId: string, seconds = 20) {
  try {
    await lineApi('/v2/bot/chat/loading/start', { method: 'POST', body: JSON.stringify({ chatId, loadingSeconds: seconds }) })
  } catch {
    // Cosmetic only.
  }
}

export function verifySignature(rawBody: string, signature: string | null) {
  if (!signature || !channelSecret) return false
  const expected = crypto.createHmac('sha256', channelSecret).update(rawBody).digest('base64')
  return expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

/** A text reply, optionally followed by one link button (button cards allow only 160 chars, so long text goes first). */
export function textWithButton(text: string, button?: { label: string; url: string }): LineMessage[] {
  if (!button) return [{ type: 'text', text }]
  const card = (body: string): LineMessage => ({
    type: 'template',
    altText: body.slice(0, 400),
    template: { type: 'buttons', text: body, actions: [{ type: 'uri', label: button.label.slice(0, 20), uri: button.url }] },
  })
  return text.length <= 160 ? [card(text)] : [{ type: 'text', text }, card(button.label)]
}
