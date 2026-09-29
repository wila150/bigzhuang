import type { Payload } from 'payload'

import type { LineSetting } from '@/payload-types'

import { lineApi, type LineMessage } from './client'

/**
 * Guided inquiry over LINE: one question at a time, with tap-to-answer quick replies.
 * Finished answers become an 詢問單 (source: LINE), which notifies the admin like a web inquiry.
 */

type Step = { question: string; options?: string | null; saveTo?: 'message' | 'service' | 'budget' | null }

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

const steps = (s: LineSetting) => (s.inquirySteps?.length ? s.inquirySteps : defaultSteps)

/** A question card with tap-to-send option buttons inside it (a LINE Flex Message). */
export function questionMessage(step: Step, index: number, total: number): LineMessage {
  const options = (step.options || '')
    .split(/[,，]/)
    .map((o) => o.trim())
    .filter(Boolean)
    .slice(0, 8)
  const send = (label: string) => ({ type: 'message', label: label.slice(0, 40), text: label })
  return {
    type: 'flex',
    altText: `Q${index + 1} ${step.question}`.slice(0, 400),
    contents: {
      type: 'bubble',
      size: 'kilo',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          { type: 'text', text: `Q${index + 1}／${total}`, size: 'sm', weight: 'bold', color: '#D9582B' },
          { type: 'text', text: step.question, wrap: true, size: 'md', weight: 'bold', color: '#0B2742' },
          options.length
            ? { type: 'text', text: '點選下方按鈕，或直接輸入回答', size: 'xs', color: '#8A94A3', wrap: true }
            : { type: 'text', text: '直接在下方輸入回答', size: 'xs', color: '#8A94A3', wrap: true },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          ...options.map((o) => ({ type: 'button', style: 'secondary', height: 'sm', action: send(o) })),
          { type: 'button', style: 'link', height: 'sm', color: '#8A94A3', action: send('取消') },
        ],
      },
    },
  }
}

async function displayNameOf(userId: string) {
  try {
    const profile = (await lineApi(`/v2/bot/profile/${userId}`)) as { displayName?: string }
    return profile.displayName || 'LINE 使用者'
  } catch {
    return 'LINE 使用者'
  }
}

type Answer = { q: string; a: string }

/**
 * Returns reply messages if this event belongs to the inquiry flow, or null to let other handlers run.
 * `text` is the message text, or a placeholder like "（傳了圖片）" for non-text messages.
 */
export async function handleInquiryFlow(payload: Payload, userId: string, text: string, isText: boolean) {
  const settings = await payload.findGlobal({ slug: 'line-settings', overrideAccess: true })
  const list = steps(settings)
  const found = await payload.find({ collection: 'line-sessions', where: { userId: { equals: userId } }, limit: 1, overrideAccess: true })
  let session: (typeof found.docs)[number] | undefined = found.docs[0]
  if (session && Date.now() - new Date(session.updatedAt).getTime() > EXPIRE_MS) {
    await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })
    session = undefined
  }

  const starting = isText && START_WORDS.includes(text)

  if (starting) {
    const data = { userId, step: 0, answers: [], displayName: await displayNameOf(userId) }
    if (session) await payload.update({ collection: 'line-sessions', id: session.id, data, overrideAccess: true })
    else await payload.create({ collection: 'line-sessions', data, overrideAccess: true })
    return [{ type: 'text', text: settings.inquiryIntro || defaultIntro }, questionMessage(list[0], 0, list.length)]
  }

  if (!session) return null

  if (isText && CANCEL_WORDS.includes(text)) {
    await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })
    return [{ type: 'text', text: '已取消。之後想詢價，隨時點選單的「線上詢價」就可以重新開始。' }]
  }

  const answers = [...((session.answers as Answer[] | null) ?? []), { q: list[session.step]?.question ?? '', a: text }]
  const next = session.step + 1

  if (next < list.length) {
    await payload.update({ collection: 'line-sessions', id: session.id, data: { step: next, answers }, overrideAccess: true })
    return [questionMessage(list[next], next, list.length)]
  }

  // Done: turn the answers into an inquiry (the Inquiries hook notifies the admin on LINE).
  const pick = (key: 'service' | 'budget') => {
    const i = list.findIndex((s) => s.saveTo === key)
    return i >= 0 ? answers[i]?.a : undefined
  }
  const summary = answers.map((x, i) => `Q${i + 1} ${x.q.split('\n')[0]}\n→ ${x.a}`).join('\n\n')
  await payload.create({
    collection: 'inquiries',
    overrideAccess: true,
    data: {
      name: session.displayName || 'LINE 使用者',
      source: 'line',
      lineUserId: userId,
      service: pick('service'),
      budget: pick('budget'),
      message: summary,
      status: 'new',
    },
  })
  await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })

  const recap = answers.map((x, i) => `Q${i + 1} ${x.a}`).join('\n')
  return [{ type: 'text', text: `${settings.inquiryDone || defaultDone}\n\n你的回答：\n${recap}` }]
}
