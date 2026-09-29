/**
 * Uploads case screenshots and fills in live case details.
 * Usage: SHOTS_DIR=/path/to/shots npm run import:shots
 * Expects <slug>-cover.png, <slug>-inner1.png, <slug>-inner2.png, <slug>-mobile.png per case.
 */
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import type { Project } from '../payload-types'

const dir = process.env.SHOTS_DIR
if (!dir) throw new Error('Set SHOTS_DIR to the folder holding the screenshots')

const payload = await getPayload({ config })

type Details = Partial<Pick<Project, 'title' | 'url' | 'year' | 'siteType' | 'industry' | 'summary'>> & {
  tech: string[]
  features: string[]
  categorySlug?: string
}

const cases: Record<string, Details> = {
  'bluedot-studio': {
    url: 'https://bluedot-slaj.onrender.com',
    year: 2026,
    tech: ['Node.js', 'Express', 'Firebase', 'Sharp'],
    features: ['作品集分類', '後台上傳作品', 'RWD', 'LINE／IG 浮動按鈕'],
  },
  'lightdust-studio': {
    url: 'https://lightduststudio-q8qk.onrender.com',
    year: 2026,
    tech: ['Node.js', 'Express', 'Turso (libSQL)', 'Cloudinary'],
    features: ['首頁輪播', '作品集', '線上預約', 'LINE 浮動按鈕'],
  },
  huangjia: {
    title: '皇佳數位沖印',
    url: 'https://huangchiaphotostudio.com',
    year: 2026,
    siteType: '購物網站',
    industry: '數位沖印・客製化印刷',
    summary: '客製化印刷與商品製作的線上下單網站，依規格即時計價，會員可追蹤製作進度。',
    categorySlug: 'ecommerce',
    tech: ['Next.js', 'PostgreSQL', 'Prisma', 'NextAuth', '綠界金流'],
    features: ['即時計價', '購物車', '會員登入', '線上付款', '版型下載'],
  },
}

async function upload(file: string, alt: string) {
  const filePath = path.join(dir!, file)
  if (!fs.existsSync(filePath)) return null
  const doc = await payload.create({ collection: 'media', data: { alt }, filePath })
  return doc.id
}

for (const [slug, d] of Object.entries(cases)) {
  const { docs } = await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1 })
  const project = docs[0]
  if (!project) {
    payload.logger.warn(`No project with slug ${slug}, skipping`)
    continue
  }
  const title = d.title ?? project.title
  const cover = await upload(`${slug}-cover.png`, `${title} 首頁截圖`)
  const gallery = []
  for (const n of [1, 2]) {
    const id = await upload(`${slug}-inner${n}.png`, `${title} 內頁截圖 ${n}`)
    if (id) gallery.push({ image: id })
  }
  const mobileShot = await upload(`${slug}-mobile.png`, `${title} 手機版截圖`)

  let category = project.category
  if (d.categorySlug) {
    const cat = await payload.find({ collection: 'categories', where: { slug: { equals: d.categorySlug } }, limit: 1 })
    if (cat.docs[0]) category = cat.docs[0].id
  }

  const { tech, features, categorySlug: _c, ...fields } = d
  await payload.update({
    collection: 'projects',
    id: project.id,
    data: {
      ...fields,
      category,
      tech: tech.map((name) => ({ name })),
      features: features.map((name) => ({ name })),
      ...(cover ? { cover } : {}),
      ...(gallery.length ? { gallery } : {}),
      ...(mobileShot ? { mobileShot } : {}),
    },
  })
  payload.logger.info(`Updated ${title}`)
}

process.exit(0)
