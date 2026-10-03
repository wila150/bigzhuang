import { respond, welcome, type Platform } from '@/chat/engine'
import { getPayloadClient } from '@/lib/data'
import { metaDisplayName, metaEnabled, metaTyping, metaVerifyToken, sendMeta, toMeta, verifyMetaSignature } from '@/meta/client'

// Webhook verification handshake from the Meta developer dashboard.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams
  if (metaEnabled && q.get('hub.mode') === 'subscribe' && q.get('hub.verify_token') === metaVerifyToken) {
    return new Response(q.get('hub.challenge') ?? '', { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

type MessagingEvent = {
  sender?: { id?: string }
  recipient?: { id?: string }
  message?: { text?: string; is_echo?: boolean; quick_reply?: { payload?: string }; attachments?: { type?: string }[] }
  postback?: { payload?: string; title?: string }
}

const GET_STARTED = 'GET_STARTED'

// Facebook Messenger (object "page") and Instagram (object "instagram") direct messages.
export async function POST(req: Request) {
  if (!metaEnabled) return new Response('Meta disabled', { status: 404 })
  const raw = await req.text()
  if (!verifyMetaSignature(raw, req.headers.get('x-hub-signature-256'))) return new Response('Bad signature', { status: 401 })

  const body = JSON.parse(raw) as { object?: string; entry?: { messaging?: MessagingEvent[] }[] }
  const platform: Platform | null = body.object === 'page' ? 'facebook' : body.object === 'instagram' ? 'instagram' : null
  if (!platform) return new Response('OK')

  const payload = await getPayloadClient()
  for (const entry of body.entry ?? []) {
    for (const ev of entry.messaging ?? []) {
      try {
        const userId = ev.sender?.id
        if (!userId || ev.message?.is_echo) continue // is_echo: our own outgoing messages

        let replies
        if (ev.postback?.payload === GET_STARTED) {
          replies = await welcome(payload)
        } else {
          // Quick-reply taps and ice-breaker postbacks carry the option text as their payload.
          const tapped = ev.message?.quick_reply?.payload || ev.postback?.payload
          const text = (tapped || ev.message?.text || '').trim()
          const isText = Boolean(text)
          const shown = isText ? text : placeholder(ev.message?.attachments?.[0]?.type, platform)
          replies = await respond(payload, {
            platform,
            userId,
            text: shown,
            isText,
            displayName: () => metaDisplayName(userId, platform),
            typing: () => metaTyping(userId),
          })
        }
        if (replies?.length) await sendMeta(userId, toMeta(replies, platform))
      } catch (e) {
        payload.logger.warn(`Meta webhook (${platform}) event failed: ${e instanceof Error ? e.message : e}`)
      }
    }
  }
  // Always 200 so Meta doesn't retry or disable the webhook.
  return new Response('OK')
}

function placeholder(type: string | undefined, platform: Platform) {
  const names: Record<string, string> = { image: '圖片', video: '影片', audio: '語音', file: '檔案', ig_reel: 'Reels', share: '分享' }
  const where = platform === 'instagram' ? 'IG 收件匣' : '粉絲專頁收件匣'
  return `（傳了${names[type ?? ''] ?? '訊息'}，請到${where}查看）`
}
