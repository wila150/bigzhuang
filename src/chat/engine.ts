import type { Payload } from 'payload'

import { siteHealthUrl } from '@/monitor/check'
import type { LineSetting } from '@/payload-types'

/**
 * Platform-neutral chat logic shared by LINE, Facebook Messenger and Instagram:
 * the guided inquiry and repair report (one question at a time) and keyword auto-replies from 後台 → LINE 自動回覆.
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
// Anything containing one of these starts a repair report — but only outside a running flow,
// so an answer like「後台進不去」doesn't restart it. 「報修」 always (re)starts.
export const REPAIR_START_WORDS = ['報修', '網站報修']
const REPAIR_HINTS = ['網站壞', '壞掉', '壞了', '打不開', '掛了', '掛掉', '當掉', '進不去', '連不上', '嚴重錯誤', '500 錯誤', '500錯誤']
const CANCEL_WORDS = ['取消', '結束', '不用了']
const EXPIRE_MS = 6 * 60 * 60 * 1000 // an unfinished inquiry is forgotten after 6 hours

type Flow = 'inquiry' | 'repair'

export const defaultSteps: Step[] = [
  { question: '想做的網站類型是什麼呢？', options: '形象網站,購物網站,預約／報名系統,其他系統,還不確定', saveTo: 'service' },
  { question: '需要哪些頁面或功能呢？\n例如：作品集、線上預約、會員登入、線上付款', options: '還不確定', saveTo: 'message' },
  { question: '有沒有喜歡的參考網站？\n可以直接貼網址或傳截圖', options: '沒有', saveTo: 'message' },
  { question: '預算大概多少呢？', options: '3 萬以下,3～6 萬,6～10 萬,10 萬以上,還不確定', saveTo: 'budget' },
  { question: '希望什麼時候上線呢？', options: '1 個月內,1～3 個月,3 個月以上,還不確定', saveTo: 'message' },
]
export const defaultRepairSteps: Step[] = [
  { question: '是哪個網站呢？請貼上網址 🔗\n\n有問題畫面的截圖也可以直接傳，錯誤訊息照原文拍下來最好。傳完截圖後，再用文字回答這題。' },
  {
    question: '現在看到什麼狀況？照你看到的說就好，不用會講技術名詞。\n例如：「此網站發生嚴重錯誤」、500 錯誤、整頁空白',
    options: '整個打不開,出現錯誤訊息,後台進不去,部分功能壞掉',
  },
  { question: '壞掉之前有做過什麼嗎？\n例如：更新外掛、換主題、主機升級 PHP', options: '沒有動過,不確定' },
  { question: '網站後台、主機後台的帳號在誰手上？你自己登得進去嗎？', options: '我自己登得進去,在之前的工程師手上,不確定' },
  {
    question:
      '如果是 WordPress 而且後台還進得去：\n到「工具」→「網站健康狀態」→「資訊」，按「複製網站資訊到剪貼簿」，再貼到這裡。\n\n進不去或不是 WordPress，按「跳過」就好。',
    options: '跳過',
  },
]
export const defaultRepairIntro = '收到，先別緊張 🙏\n回答幾個問題，我就能更快幫你找到問題。\n\n（隨時輸入「取消」可以停止）'
export const defaultRepairDone = '收到，謝謝你整理這些！\n我會先看問題，再跟你說明原因和處理方式，你同意了才會動手。'

export const defaultIntro = '謝謝你想找大壯做網站！回答幾個簡單的問題，我會在一個工作天內給你初步報價。\n\n（隨時輸入「取消」可以停止）'
export const defaultDone = '收到，謝謝你！我會在一個工作天內在這裡回覆你初步報價。\n\n有其他想補充的，直接在這裡留言就可以。'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const absolute = (url: string) => (url.startsWith('/') ? `${serverURL}${url}` : url)

const stepsOf = (s: LineSetting, flow: Flow): Step[] =>
  flow === 'repair'
    ? s.repairSteps?.length
      ? s.repairSteps.map((x) => ({ ...x, saveTo: 'message' as const }))
      : defaultRepairSteps
    : s.inquirySteps?.length
      ? s.inquirySteps
      : defaultSteps
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
  /** Show the platform's "typing…" indicator before a slow step (site check, later AI). Must never throw. */
  typing?: () => Promise<void>
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
  const key = sessionKey(msg.platform, msg.userId)
  const found = await payload.find({ collection: 'line-sessions', where: { userId: { equals: key } }, limit: 1, overrideAccess: true })
  let session: (typeof found.docs)[number] | undefined = found.docs[0]
  if (session && Date.now() - new Date(session.updatedAt).getTime() > EXPIRE_MS) {
    await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })
    session = undefined
  }

  const start: Flow | null = !msg.isText
    ? null
    : START_WORDS.includes(msg.text)
      ? 'inquiry'
      : REPAIR_START_WORDS.includes(msg.text) || (!session && REPAIR_HINTS.some((w) => msg.text.includes(w)))
        ? 'repair'
        : null
  if (start) {
    const data = { userId: key, flow: start, step: 0, answers: [], displayName: await msg.displayName() }
    if (session) await payload.update({ collection: 'line-sessions', id: session.id, data, overrideAccess: true })
    else await payload.create({ collection: 'line-sessions', data, overrideAccess: true })
    const intro = start === 'repair' ? settings.repairIntro || defaultRepairIntro : settings.inquiryIntro || defaultIntro
    return [{ kind: 'text', text: intro }, question(stepsOf(settings, start), 0)]
  }

  if (!session) return null
  const flow: Flow = session.flow === 'repair' ? 'repair' : 'inquiry'
  const list = stepsOf(settings, flow)

  if (msg.isText && CANCEL_WORDS.includes(msg.text)) {
    await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })
    const again = flow === 'repair' ? '之後需要報修，隨時傳「報修」就可以重新開始。' : '之後想詢價，隨時傳「詢價」就可以重新開始。'
    return [{ kind: 'text', text: `已取消。${again}` }]
  }

  // Screenshots don't answer a repair question (people often send several in a row, one message each):
  // acknowledge the first, count the rest, and wait for a text answer. The images stay in the chat for the admin.
  if (!msg.isText && flow === 'repair') {
    const images = (session.images ?? 0) + 1
    await payload.update({ collection: 'line-sessions', id: session.id, data: { images }, overrideAccess: true })
    return images === 1 ? [{ kind: 'text', text: '收到截圖 👍\n傳完後，用文字回答上面的問題就好。' }] : null
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
  const website = flow === 'repair' ? findUrl(answers[0]?.a ?? '') : undefined
  if (website) await msg.typing?.()
  const siteCheck = website ? await describeSite(payload, website) : undefined
  await payload.create({
    collection: 'inquiries',
    overrideAccess: true,
    data: {
      kind: flow,
      name: session.displayName || fallbackName,
      source: msg.platform === 'line' ? 'line' : msg.platform,
      lineUserId: msg.userId,
      website,
      service: flow === 'repair' ? '網站報修' : pick('service'),
      budget: flow === 'repair' ? undefined : pick('budget'),
      message: [
        siteCheck && `【系統檢查】${siteCheck.admin}`,
        session.images && `【截圖】客人傳了 ${session.images} 張，到聊天室查看`,
        ...answers.map((x, i) => `Q${i + 1} ${x.q.split('\n')[0]}\n→ ${x.a}`),
      ]
        .filter(Boolean)
        .join('\n\n'),
      status: 'new',
    },
  })
  await payload.delete({ collection: 'line-sessions', id: session.id, overrideAccess: true })

  const recap = answers.map((x, i) => `Q${i + 1} ${x.a}`).join('\n')
  if (flow === 'repair') {
    const done = settings.repairDone || defaultRepairDone
    return [{ kind: 'text', text: [done, siteCheck?.customer, `你的回答：\n${recap}`].filter(Boolean).join('\n\n') }]
  }
  return [{ kind: 'text', text: `${settings.inquiryDone || defaultDone}\n\n你的回答：\n${recap}` }]
}

/** The first web address in a message, as an origin like https://example.com. */
function findUrl(text: string): string | undefined {
  const m = text.match(/https?:\/\/[^\s，。、]+/i) ?? text.match(/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s，。、]*)?/i)
  if (!m) return undefined
  try {
    return new URL(m[0].startsWith('http') ? m[0] : `https://${m[0]}`).origin
  } catch {
    return undefined
  }
}

const timeFmt = new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })

/**
 * What we can tell about the site right now: the monitor's status if we watch it, otherwise one quick request.
 * Kept short because the chat platform's reply window is limited.
 */
async function describeSite(payload: Payload, origin: string): Promise<{ customer?: string; admin: string } | undefined> {
  try {
    const host = new URL(origin).hostname.replace(/^www\./, '')
    const { docs } = await payload.find({ collection: 'sites', where: { enabled: { equals: true } }, limit: 100, depth: 0, overrideAccess: true })
    const site = docs.find((s) => new URL(s.url).hostname.replace(/^www\./, '') === host)
    if (site?.status === 'down') {
      const since = site.statusSince ? timeFmt.format(new Date(site.statusSince)) : ''
      return {
        customer: `我們的監控${since ? `在 ${since} ` : ''}已經偵測到這個網站連不上，正在處理中。`,
        admin: `監控中：斷線${since ? `（${since} 起）` : ''}，${site.lastError ?? ''}`,
      }
    }
    if (site?.status === 'up') {
      const at = site.lastCheckedAt ? `，${timeFmt.format(new Date(site.lastCheckedAt))} 檢查` : ''
      return { admin: `監控中：首頁正常（${site.responseMs} ms${at}）` }
    }

    const started = Date.now()
    try {
      const res = await fetch(site ? siteHealthUrl(site) : origin, {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'BigZhaung-Monitor/1.0' },
      })
      await res.arrayBuffer().catch(() => {})
      return { admin: res.ok ? `剛測試：首頁可以開啟（${Date.now() - started} ms）` : `剛測試：首頁回應 HTTP ${res.status}` }
    } catch (e) {
      const timedOut = e instanceof Error && e.name === 'TimeoutError'
      return { admin: timedOut ? '剛測試：8 秒內沒有回應' : `剛測試：連不上（${e instanceof Error ? e.message : e}）` }
    }
  } catch (e) {
    payload.logger.warn(`Repair site check failed: ${e instanceof Error ? e.message : e}`)
    return undefined
  }
}
