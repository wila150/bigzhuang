import { getPayloadClient } from '@/lib/data'
import { lineBindCode } from '@/line/bind-code'
import { lineEnabled, reply, textWithButton, verifySignature, type LineMessage } from '@/line/client'
import { handleInquiryFlow } from '@/line/inquiry-flow'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const absolute = (url: string) => (url.startsWith('/') ? `${serverURL}${url}` : url)

type LineEvent = {
  type: string
  replyToken?: string
  source?: { userId?: string }
  message?: { type: string; text?: string }
  postback?: { data?: string }
}

// LINE Messaging API webhook: welcome message on follow, keyword auto-replies, and notification binding.
export async function POST(req: Request) {
  if (!lineEnabled) return new Response('LINE disabled', { status: 404 })

  const raw = await req.text()
  if (!verifySignature(raw, req.headers.get('x-line-signature'))) return new Response('Bad signature', { status: 401 })

  const { events = [] } = JSON.parse(raw) as { events?: LineEvent[] }
  const payload = await getPayloadClient()

  for (const event of events) {
    try {
      const messages = await handle(event, payload)
      if (messages?.length && event.replyToken) await reply(event.replyToken, messages)
    } catch (e) {
      payload.logger.warn(`LINE webhook event failed: ${e instanceof Error ? e.message : e}`)
    }
  }
  // Always 200 so LINE doesn't retry or flag the webhook.
  return new Response('OK')
}

async function handle(event: LineEvent, payload: Awaited<ReturnType<typeof getPayloadClient>>): Promise<LineMessage[] | null> {
  if (event.type === 'follow') {
    const settings = await payload.findGlobal({ slug: 'line-settings', overrideAccess: true })
    return settings.welcomeMessage ? [{ type: 'text', text: settings.welcomeMessage }] : null
  }

  if (event.type !== 'message' || !event.message) return null
  const isText = event.message.type === 'text'
  const text = isText ? (event.message.text || '').trim() : placeholder(event.message.type)
  const userId = event.source?.userId

  // The guided inquiry takes priority while it is running (and starts on 線上詢價 / 詢價).
  if (userId) {
    const flow = await handleInquiryFlow(payload, userId, text, isText)
    if (flow) return flow as LineMessage[]
  }
  if (!isText) return null

  if (text === `綁定通知 ${lineBindCode()}` && userId) {
    await payload.updateGlobal({ slug: 'line-settings', overrideAccess: true, data: { adminUserId: userId } })
    return [{ type: 'text', text: '綁定完成！之後有新詢問或客戶付款，都會通知這個 LINE。' }]
  }

  const { docs } = await payload.find({
    collection: 'line-replies',
    where: { enabled: { equals: true } },
    sort: 'order',
    limit: 100,
    overrideAccess: true,
  })
  const lower = text.toLowerCase()
  const match = docs.find((r) =>
    r.keywords
      .split(/[,，、]/)
      .map((k) => k.trim().toLowerCase())
      .some((k) => k && lower.includes(k)),
  )
  if (!match) return null // No auto-reply: leave it for a human in LINE chat.

  const button = match.buttonLabel && match.buttonUrl ? { label: match.buttonLabel, url: absolute(match.buttonUrl) } : undefined
  return textWithButton(match.reply, button)
}

function placeholder(type: string) {
  const names: Record<string, string> = { image: '圖片', video: '影片', sticker: '貼圖', file: '檔案', audio: '語音', location: '位置' }
  return `（傳了${names[type] ?? '訊息'}，請到 LINE 聊天室查看）`
}
