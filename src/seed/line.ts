/**
 * Starting LINE content: welcome message, keyword replies, and the site's LINE button.
 * Only fills what is empty, so it is safe to rerun. Run with: npm run seed:line
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { defaultDone, defaultIntro, defaultSteps } from '../chat/engine'

const payload = await getPayload({ config })
const basicId = '@704ptxob'

const settings = await payload.findGlobal({ slug: 'site-settings' })
if (!settings.lineId || !settings.lineUrl) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { lineId: settings.lineId || basicId, lineUrl: settings.lineUrl || `https://line.me/R/ti/p/${basicId}` },
  })
}

const line = await payload.findGlobal({ slug: 'line-settings' })
if (!line.welcomeMessage) {
  await payload.updateGlobal({
    slug: 'line-settings',
    data: {
      welcomeMessage:
        '你好，我是大壯！謝謝加入 BigZhaung 大壯做網站。\n\n想做形象網站或客製化系統，直接在這裡說說你的想法就可以，我會在一個工作天內回覆。\n\n下方選單可以看作品案例、合作流程，客戶也能查帳單與線上繳費。',
    },
  })
}

const lineNow = await payload.findGlobal({ slug: 'line-settings' })
if (!lineNow.inquirySteps?.length) {
  await payload.updateGlobal({
    slug: 'line-settings',
    data: { inquirySteps: defaultSteps, inquiryIntro: lineNow.inquiryIntro || defaultIntro, inquiryDone: lineNow.inquiryDone || defaultDone },
  })
}

const { totalDocs } = await payload.count({ collection: 'line-replies' })
if (totalDocs === 0) {
  const replies = [
    {
      title: '報價',
      keywords: '報價,價格,多少錢,費用,預算',
      reply: '每個網站的需求不同，價格會依頁面數量和功能而定。填寫線上詢價表，或直接在這裡告訴我：想做什麼網站、需要哪些功能、預計上線時間，我會在一個工作天內給你初步報價。',
      buttonLabel: '線上詢價',
      buttonUrl: '/contact',
    },
    { title: '作品', keywords: '作品,案例,做過', reply: '這裡可以看我做過的網站，包含使用的技術和實際畫面。', buttonLabel: '看作品案例', buttonUrl: '/works' },
    { title: '流程', keywords: '流程,多久,時間,時程', reply: '形象網站通常 3～6 週上線，客製化系統約 1～3 個月。完整的 6 個步驟在這裡。', buttonLabel: '合作流程', buttonUrl: '/process' },
    { title: '繳費', keywords: '繳費,帳單,月費,付款,刷卡', reply: '合作中的客戶可以登入客戶專區，查看每月帳單並線上刷卡。', buttonLabel: '客戶專區', buttonUrl: '/account' },
  ]
  for (const [i, r] of replies.entries()) await payload.create({ collection: 'line-replies', data: { ...r, order: i + 1 } })
}

payload.logger.info('LINE content ready')
process.exit(0)
