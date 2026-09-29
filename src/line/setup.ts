/**
 * Creates the rich menu, makes it the default for everyone, and points the webhook at this site.
 * Run with: npm run line:setup   (uses NEXT_PUBLIC_SERVER_URL for every link — rerun after changing domains)
 */
import fs from 'fs'
import path from 'path'

import { lineApi, lineToken } from './client'

const site = process.env.NEXT_PUBLIC_SERVER_URL
if (!site?.startsWith('https://')) throw new Error('Set NEXT_PUBLIC_SERVER_URL to the live https:// site first')

const NAME = 'BigZhaung main menu'
const W = 2500
const H = 1686
const col = [0, 833, 1667, W]
const row = [0, 843, H]
const link = (p: string) => `${site}${p}?utm_source=line&utm_medium=richmenu`

// A cell either opens a page (path) or sends a message that triggers a LINE auto-reply (text).
const cells: ({ label: string; path: string } | { label: string; text: string })[] = [
  { label: '服務項目', path: '/services' },
  { label: '作品案例', path: '/works' },
  { label: '合作流程', path: '/process' },
  { label: '線上詢價', text: '線上詢價' }, // answered by the 線上詢價 auto-reply
  { label: '客戶專區', path: '/account' },
  { label: '常見問題', path: '/faq' },
]

const areas = cells.map((c, i) => {
  const x = i % 3
  const y = Math.floor(i / 3)
  return {
    bounds: { x: col[x], y: row[y], width: col[x + 1] - col[x], height: row[y + 1] - row[y] },
    action: 'text' in c ? { type: 'message', label: c.label, text: c.text } : { type: 'uri', label: c.label, uri: link(c.path) },
  }
})

const { richmenus } = (await lineApi('/v2/bot/richmenu/list')) as { richmenus: { richMenuId: string; name: string }[] }
for (const m of richmenus.filter((m) => m.name === NAME)) {
  await lineApi(`/v2/bot/richmenu/${m.richMenuId}`, { method: 'DELETE' })
  console.log('removed old menu', m.richMenuId)
}

const { richMenuId } = (await lineApi('/v2/bot/richmenu', {
  method: 'POST',
  body: JSON.stringify({ size: { width: W, height: H }, selected: true, name: NAME, chatBarText: '選單', areas }),
})) as { richMenuId: string }

const image = fs.readFileSync(path.resolve('public/line/richmenu.jpg'))
const upload = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${await lineToken()}`, 'Content-Type': 'image/jpeg' },
  body: image,
})
if (!upload.ok) throw new Error(`Rich menu image upload failed: ${upload.status} ${await upload.text()}`)

await lineApi(`/v2/bot/user/all/richmenu/${richMenuId}`, { method: 'POST' })
console.log('rich menu live:', richMenuId)

await lineApi('/v2/bot/channel/webhook/endpoint', {
  method: 'PUT',
  body: JSON.stringify({ endpoint: `${site}/line/webhook` }),
})
console.log('webhook endpoint set:', `${site}/line/webhook`)
