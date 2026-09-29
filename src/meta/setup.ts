/**
 * Connects the fan page (and its Instagram account, if linked) to /meta/webhook and sets up the Messenger chat screen.
 * Run after deploying with META_* set: npm run meta:setup
 */
import { graph } from './client'

const site = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.META_APP_ID
const appSecret = process.env.META_APP_SECRET
const verifyToken = process.env.META_VERIFY_TOKEN
if (!site?.startsWith('https://') || !appId || !appSecret || !verifyToken || !process.env.META_PAGE_ACCESS_TOKEN) {
  throw new Error('Set NEXT_PUBLIC_SERVER_URL (https), META_APP_ID, META_APP_SECRET, META_VERIFY_TOKEN and META_PAGE_ACCESS_TOKEN')
}
const appToken = `${appId}|${appSecret}`
const callback = `${site}/meta/webhook`
const fields = 'messages,messaging_postbacks'

// 1. App-level webhook for fan page messages (Meta immediately calls GET /meta/webhook to verify it).
await graph(`/${appId}/subscriptions`, {
  method: 'POST',
  body: JSON.stringify({ object: 'page', callback_url: callback, verify_token: verifyToken, fields }),
}, appToken)
console.log('webhook (page) →', callback)

// 2. Subscribe this fan page to the app.
const page = (await graph('/me?fields=id,name,instagram_business_account')) as { id: string; name: string; instagram_business_account?: { id: string } }
await graph(`/${page.id}/subscribed_apps?subscribed_fields=${fields}`, { method: 'POST' })
console.log('fan page subscribed:', page.name, page.id)

// 3. Messenger chat screen: greeting, Get Started button, and FAQ buttons (ice breakers).
const iceBreakers = [
  { question: '我想線上詢價', payload: '線上詢價' },
  { question: '做網站大概多少錢？', payload: '報價' },
  { question: '可以看看作品嗎？', payload: '作品' },
  { question: '合作流程是什麼？', payload: '流程' },
]
await graph('/me/messenger_profile', {
  method: 'POST',
  body: JSON.stringify({
    get_started: { payload: 'GET_STARTED' },
    greeting: [{ locale: 'default', text: '嗨 {{user_first_name}}！我是大壯，專做形象網站與客製化系統。想詢價、看作品，點下方按鈕或直接留言就可以。' }],
    ice_breakers: [{ locale: 'default', call_to_actions: iceBreakers }],
  }),
})
console.log('messenger profile: greeting, get started, ice breakers')

// 4. Instagram direct messages, when an IG professional account is linked to this fan page.
if (page.instagram_business_account) {
  await graph(`/${appId}/subscriptions`, {
    method: 'POST',
    body: JSON.stringify({ object: 'instagram', callback_url: callback, verify_token: verifyToken, fields }),
  }, appToken)
  await graph('/me/messenger_profile?platform=instagram', {
    method: 'POST',
    body: JSON.stringify({ ice_breakers: [{ locale: 'default', call_to_actions: iceBreakers }] }),
  })
  console.log('instagram connected:', page.instagram_business_account.id)
} else {
  console.log('instagram: no IG account linked to this fan page yet (link it, then rerun this script)')
}
