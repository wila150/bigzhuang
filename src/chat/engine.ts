import type { Payload } from 'payload'

import type { LineSetting } from '@/payload-types'

/**
 * Platform-neutral chat logic shared by LINE, Facebook Messenger and Instagram:
 * the guided inquiry (one question at a time) and keyword auto-replies from 後台 → LINE 自動回覆.
 * It returns abstract replies; each platform renders them in its own message format.
 */

export type Platform = 'line' | 'facebook' | 'instagram'

export type Reply =
  | { kind: 'text'; text: string }
  | { kind: 'question'; index: number; total: number; question: string; options: string[] }
  | { kind: 'link'; text: string; label: string; url: string }

type Step = { question: string; options?: string | null; saveTo?: 'message' | 'service' | 'budget' | null }
type Answer = { q: string; a: string }

export const START_WORDS = ['線上詢價', '詢價', '我要詢價', '我想詢價', '想做網站']
const CANCEL_WORDS = ['取消', '結束', '不用了']
const EXPIRE_MS = 6 * 60 * 60 * 1000 // an unfinished inquiry is forgotten after 6 hours

export const defaultSteps: Step[] = [
  { question: '想做的網站類型是什麼呢？', options: '形象網站,購物網站,預約／報名系統,其他系統,還不確定', saveTo: 'service' },
  { question: '需要哪些頁面或功能呢？\n例如：作品集、線上預約、會員登入、線上付款', options: '還不確定', saveTo: 'message' },
  { question: '有沒有喜歡的參考網站？\n可以直接貼網址或傳截圖', options: '沒有', saveTo: 'message' },
  { question: '預算大概多少呢？', options: '3 萬以下,3～6 萬,6～10 萬,10 萬以上,還不確定', saveTo: 'budget' },
  { question: '希望什麼時候上線呢？', options: '1 個月內,1～3 個月,3 個月以上,還不確定', saveTo: 'message' },
]
export const defaultIntro = '謝謝你想找大壯做網站！回答幾個簡單的問題，我會在一個工作天內給你初步報價。\n\n（隨時輸入「取消」可以停止）'
export const defaultDone = '收到，謝謝你！我會在一個工作天內在這裡回覆你初步報價。\n\n有其他想補充的，直接在這裡留言就可以。'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const absolute = (url: string) => (url.startsWith('/') ? `${serverURL}${url}` : url)

const stepsOf = (s: LineSetting) => (s.inquirySteps?.length ? s.inquirySteps : defaultSteps)
const optionsOf = (step: Step) =>
  (step.options || '')
    .split(/[,，]/)
    .map((o) => o.trim())
    .filter(Boolean)
    .slice(0, 12)

const question = (list: Step[], i: number): Reply => ({
  kind: 'question',
  index: i,
  total: list.length,
  question: list[i].question,
  options: optionsOf(list[i]),
})

// LINE sessions predate the other platforms, so their keys stay unprefixed.
const sessionKey = (platform: Platform, userId: string) => (platform === 'line' ? userId : `${platform}:${userId}`)

export type Incoming = {
  platform: Platform
  userId: string
  /** Message text, or a placeholder like "（傳了圖片）" for attachments. */
  text: string
  isText: boolean
  displayName: () => Promise<string>
}

export async function welcome(payload: Payload): Promise<Reply[] | null> {
  const settings = await payload.findGlobal({ slug: 'line-settings', overrideAccess: true })
  return settings.welcomeMessage ? [{ kind: 'text', text: settings.welcomeMessage }] : null
}

/** Replies for one incoming message, or null when a human should answer it. */
export async function respond(payload: Payload, msg: Incoming): Promise<Reply[] | null> {
  const flow = await inquiryFlow(payload, msg)
  if (flow) return flow
  if (!msg.isText) return null
  return keywordReply(payload, msg.text)
}

async function keywordReply(payload: Payload, text: string): Promise<Reply[] | null> {
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
  if (!match) return null
  if (match.buttonLabel && match.buttonUrl) {
    return [{ kind: 'link', text: match.reply, label: match.buttonLabel, url: absolute(match.buttonUrl) }]
  }
  return [{ kind: 'text', text: match.reply }]
}

async function inquiryFlow(payload: Payload, msg: Incoming): Promise<Reply[] | null> {
  const settings = await payload.findGlobal({ slug: 'line-settings', overrideAccess: true })
  const list = stepsOf(settings)
  const key = sessionKey(msg.platform, msg.userId)
  const found = await payload.find({ collection: 'line-sessions', where: { userId: { equals: key } }, limit: 1, overrideAccess: true })
  let session: (typeof found.docs)[number] | undefined = found.docs[0]
  if (session && Date.now() - new Date(session.updatedAt).getTime() > EXPIRE_MS) {
    await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })
    session = undefined
  }

  if (msg.isText && START_WORDS.includes(msg.text)) {
    const data = { userId: key, step: 0, answers: [], displayName: await msg.displayName() }
    if (session) await payload.update({ collection: 'line-sessions', id: session.id, data, overrideAccess: true })
    else await payload.create({ collection: 'line-sessions', data, overrideAccess: true })
    return [{ kind: 'text', text: settings.inquiryIntro || defaultIntro }, question(list, 0)]
  }

  if (!session) return null

  if (msg.isText && CANCEL_WORDS.includes(msg.text)) {
    await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })
    return [{ kind: 'text', text: '已取消。之後想詢價，隨時傳「詢價」就可以重新開始。' }]
  }

  const answers = [...((session.answers as Answer[] | null) ?? []), { q: list[session.step]?.question ?? '', a: msg.text }]
  const next = session.step + 1

  if (next < list.length) {
    await payload.update({ collection: 'line-sessions', id: session.id, data: { step: next, answers }, overrideAccess: true })
    return [question(list, next)]
  }

  // Done: turn the answers into an inquiry (the Inquiries hook notifies the admin on LINE).
  const pick = (k: 'service' | 'budget') => {
    const i = list.findIndex((s) => s.saveTo === k)
    return i >= 0 ? answers[i]?.a : undefined
  }
  const fallbackName = { line: 'LINE 使用者', facebook: 'Facebook 使用者', instagram: 'Instagram 使用者' }[msg.platform]
  await payload.create({
    collection: 'inquiries',
    overrideAccess: true,
    data: {
      name: session.displayName || fallbackName,
      source: msg.platform === 'line' ? 'line' : msg.platform,
      lineUserId: msg.userId,
      service: pick('service'),
      budget: pick('budget'),
      message: answers.map((x, i) => `Q${i + 1} ${x.q.split('\n')[0]}\n→ ${x.a}`).join('\n\n'),
      status: 'new',
    },
  })
  await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })

  const recap = answers.map((x, i) => `Q${i + 1} ${x.a}`).join('\n')
  return [{ kind: 'text', text: `${settings.inquiryDone || defaultDone}\n\n你的回答：\n${recap}` }]
}
