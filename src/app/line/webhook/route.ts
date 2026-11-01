import { getPayloadClient } from '@/lib/data'
import { clientBindCode, lineBindCode } from '@/line/bind-code'
import { respond, welcome } from '@/chat/engine'
import { lineApi, lineEnabled, reply, showLoading, verifySignature, type LineMessage } from '@/line/client'
import { toLine } from '@/line/render'


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
    const w = await welcome(payload)
    return w ? toLine(w) : null
  }

  if (event.type !== 'message' || !event.message) return null
  const isText = event.message.type === 'text'
  const text = isText ? (event.message.text || '').trim() : placeholder(event.message.type)
  const userId = event.source?.userId
  if (!userId) return null

  // LINE-only: bind this LINE account to receive admin notifications.
  if (isText && text === `綁定通知 ${lineBindCode()}`) {
    await payload.updateGlobal({ slug: 'line-settings', overrideAccess: true, data: { adminUserId: userId } })
    return [{ type: 'text', text: '綁定完成！之後有新詢問或客戶付款，都會通知這個 LINE。' }]
  }

  // A client links their LINE to bill reminders with the command shown in 客戶專區.
  const bill = isText ? text.match(/^綁定帳單\s*([0-9A-Fa-f]{6})$/) : null
  if (bill) {
    const code = bill[1].toUpperCase()
    const { docs } = await payload.find({ collection: 'clients', limit: 500, depth: 0, overrideAccess: true, pagination: false })
    const client = docs.find((c) => clientBindCode(c.id) === code)
    if (!client) return [{ type: 'text', text: '綁定碼不正確，請到客戶專區複製完整的綁定指令再傳一次。' }]
    await payload.update({ collection: 'clients', id: client.id, data: { lineUserId: userId }, overrideAccess: true })
    return [{ type: 'text', text: `綁定完成！${client.name} 的月費帳單到期前 7 天，會用這個 LINE 提醒您。` }]
  }

  const replies = await respond(payload, {
    platform: 'line',
    userId,
    text,
    isText,
    displayName: () => lineDisplayName(userId),
    typing: () => showLoading(userId),
  })
  return replies ? toLine(replies) : null // null: leave it for a human in LINE chat.
}

async function lineDisplayName(userId: string) {
  try {
    const profile = (await lineApi(`/v2/bot/profile/${userId}`)) as { displayName?: string }
    return profile.displayName || 'LINE 使用者'
  } catch {
    return 'LINE 使用者'
  }
}

function placeholder(type: string) {
  const names: Record<string, string> = { image: '圖片', video: '影片', sticker: '貼圖', file: '檔案', audio: '語音', location: '位置' }
  return `（傳了${names[type] ?? '訊息'}，請到 LINE 聊天室查看）`
}
