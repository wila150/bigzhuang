/**
 * Adds the sites to watch in 監控網站. Skips any URL that is already there; safe to rerun.
 * Run with: npm run seed:sites
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const sites = [
  { name: '連馬記帳後台', url: 'https://lianmatracker.web.app', notes: 'Firebase Hosting（不會休眠，純監控）' },
  { name: '大蒜批發叫貨單', url: 'https://garlic-wholesale.web.app', notes: 'Firebase Hosting（不會休眠，純監控）' },
  { name: '藍點影像工作室', url: 'https://bluedot-slaj.onrender.com', notes: 'Render 免費方案（每 10 分鐘檢查也順便防休眠）' },
  { name: 'LightDust Studio', url: 'https://lightduststudio-q8qk.onrender.com', notes: 'Render 免費方案（每 10 分鐘檢查也順便防休眠）' },
]

const payload = await getPayload({ config })

for (const site of sites) {
  const { totalDocs } = await payload.count({ collection: 'sites', where: { url: { equals: site.url } }, overrideAccess: true })
  if (totalDocs) {
    console.log(`已存在：${site.name}`)
    continue
  }
  await payload.create({ collection: 'sites', data: { ...site, healthPath: '/', enabled: true }, overrideAccess: true })
  console.log(`已新增：${site.name}`)
}

process.exit(0)
