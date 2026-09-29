/**
 * Fills an empty database with the starting content from the site plan.
 * Run with `npm run seed`. Existing services mean it already ran, so it stops
 * unless you pass --force (which wipes content collections first).
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const force = process.argv.includes('--force')

const payload = await getPayload({ config })

const existing = await payload.count({ collection: 'services' })
if (existing.totalDocs > 0 && !force) {
  payload.logger.info('Content already exists — skipping seed (use --force to reset).')
  process.exit(0)
}

if (force) {
  for (const collection of ['projects', 'services', 'categories', 'faqs'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
}

// ---- Categories ----
const cat = async (title: string, slug: string, order: number) =>
  payload.create({ collection: 'categories', data: { title, slug, order } })

const catBrand = await cat('形象網站', 'brand-website', 1)
const catStudio = await cat('工作室網站', 'studio-website', 2)
const catSystem = await cat('客製化系統', 'custom-system', 3)
const catShop = await cat('購物網站', 'ecommerce', 4)

// ---- Services ----
const tags = (...t: string[]) => t.map((tag) => ({ tag }))

await payload.create({
  collection: 'services',
  data: {
    title: '形象網站設計',
    slug: 'brand-website',
    order: 1,
    summary: '替工作室、品牌與小店家量身設計官網，讓客人在 Google 找得到你，也看得懂你在做什麼。',
    includes: ['RWD 響應式設計', '作品集與服務介紹', '後台自己改內容', 'SEO 基礎設定', 'SSL 安全憑證', '網域與主機協助'].map((item) => ({ item })),
    tagline: '讓客人一眼記住你的品牌',
    problem: '只靠 IG、FB 經營，客人用 Google 搜尋時找不到你，貼文一多，作品和服務也很難一次看清楚。',
    solution: '一個屬於你的官網，把品牌故事、作品與聯絡方式整理在同一個地方，搜尋得到、看得懂、找得到你。',
    features: [
      { title: 'RWD 響應式', description: '手機、平板、電腦都好讀好按。' },
      { title: '後台自己改', description: '文字、圖片、作品隨時更新，不用等工程師。' },
      { title: 'SSL 安全憑證', description: '網址有鎖頭，瀏覽器不再跳警告。' },
      { title: 'SEO 基礎設定', description: '標題、描述、網站地圖都設定好，Google 讀得懂。' },
    ],
    points: [
      { title: '量身設計', description: '依你的品牌色、風格與客群設計版面，不套用千篇一律的模板。', tags: tags('品牌配色', '客製版型', '字體規劃') },
      { title: '作品與服務一目了然', description: '作品集、服務項目與價格方案分類清楚，客人不用翻貼文找資料。', tags: tags('作品集', '服務介紹', '常見問題') },
      { title: '讓客人馬上聯絡', description: 'LINE 按鈕、詢問表單、預約連結放在最好按的地方。', tags: tags('LINE 浮動按鈕', '詢問表單', 'Google 地圖') },
    ],
    addons: [
      { title: '線上預約', description: '客人自己選時段，自動通知你。' },
      { title: '購物車', description: '直接在官網賣商品，支援線上付款。' },
      { title: '會員專區', description: '會員登入、訂單查詢與專屬內容。' },
    ],
    relatedCategories: [catBrand.id, catStudio.id],
  },
})

await payload.create({
  collection: 'services',
  data: {
    title: '客製化系統',
    slug: 'custom-system',
    order: 2,
    summary: '把你每天用表單、Excel、LINE 手動處理的流程，做成一套專屬的線上系統。',
    includes: ['需求訪談與流程規劃', '管理後台', '權限管理', '報表匯出', '手機也能管理', '上線後維護'].map((item) => ({ item })),
    tagline: '照你的流程做，不用將就現成工具',
    problem: '報名、訂單、預約都靠表單、Excel 和 LINE 手動處理，資料散在各處，一忙就容易漏單。',
    solution: '依你的實際流程打造系統，資料集中在一個後台，自動通知、自動統計，省下重複工作的時間。',
    features: [
      { title: '管理後台', description: '所有資料集中管理，搜尋、篩選、匯出一次完成。' },
      { title: '權限管理', description: '老闆、員工、合作夥伴看到的內容各自不同。' },
      { title: 'SSL 安全憑證', description: '資料全程加密傳輸。' },
      { title: '手機也能管', description: '外出時用手機就能處理訂單與回覆。' },
    ],
    points: [
      { title: '預約與報名', description: '客人線上選時段、填資料，名額與提醒自動處理。', tags: tags('時段管理', '名額控制', '自動通知') },
      { title: '購物車與會員', description: '商品、庫存、會員與訂單整合在同一套系統。', tags: tags('商品管理', '會員登入', '訂單查詢') },
      { title: '直播抓單與線上繳費', description: '直播留言自動整理成訂單，搭配線上付款與對帳。', tags: tags('留言抓單', '線上付款', '自動對帳') },
    ],
    addons: [
      { title: '形象網站', description: '系統之外，再加一個對外介紹品牌的官網。' },
      { title: '資料報表', description: '營收、訂單、客群自動整理成圖表。' },
      { title: '舊系統改版', description: '把用了很久的舊系統翻新，資料完整搬過來。' },
    ],
    relatedCategories: [catSystem.id, catShop.id],
  },
})


// ---- Projects (screenshots, years and tech still to be filled in from the admin) ----
await payload.create({
  collection: 'projects',
  data: {
    title: '藍點影像工作室',
    slug: 'bluedot-studio',
    order: 1,
    category: catStudio.id,
    siteType: '工作室形象網站',
    industry: '攝影工作室',
    summary: '攝影工作室的形象網站與作品集，依拍攝類型分類展示作品。',
    features: [{ name: '作品集分類' }, { name: '後台上傳作品' }, { name: 'RWD' }],
  },
})
await payload.create({
  collection: 'projects',
  data: {
    title: '光塵影像',
    slug: 'lightdust-studio',
    order: 2,
    category: catBrand.id,
    siteType: '品牌形象網站',
    industry: '商業攝影・影片製作・平面設計',
    summary: '商業攝影、影片製作與平面設計工作室的品牌官網。',
    features: [{ name: '服務介紹' }, { name: '作品集' }, { name: '聯絡表單' }],
  },
})
await payload.create({
  collection: 'projects',
  data: {
    title: '皇佳',
    slug: 'huangjia',
    order: 3,
    category: catSystem.id,
    siteType: '客製化系統',
    summary: '依客戶作業流程打造的客製化系統。',
    features: [{ name: '管理後台' }, { name: '權限管理' }],
  },
})

// ---- FAQs ----
const faqs: [string, string][] = [
  ['做一個網站大概要多久？', '形象網站通常 3～6 週，客製化系統依功能多寡約 1～3 個月。實際時間在提案報價時會列出每個階段的時程。'],
  ['我需要準備哪些資料？', 'Logo、品牌介紹文字、服務項目、作品照片，以及你喜歡的參考網站。沒有文案也沒關係，可以一起討論整理。'],
  ['網域和主機是誰的？', '網域以你的名義註冊，所有權屬於你；主機由我們代管，你不用煩惱任何技術設定。\n若之後不再委託我們維護，我們會提供網域轉移授權碼，並協助把網站完整轉移到你指定的主機，網站內容與網域都能帶走。'],
  ['上線後可以改版或加功能嗎？', '可以。文字與圖片你可以自己從後台修改；要加新功能或改版，再依需求另外報價。'],
]
for (const [i, [question, answer]] of faqs.entries()) {
  await payload.create({ collection: 'faqs', data: { question, answer, order: i + 1 } })
}

// ---- Globals ----
await payload.updateGlobal({
  slug: 'home-page',
  data: {
    heroTitle: '讓你的品牌，在網路上壯起來。',
    heroText: '形象網站設計與客製化系統開發。從需求訪談、設計、開發到上線教學，一個人負責到底。',
    sellingPoints: [
      { title: 'RWD 響應式', description: '手機電腦都好看' },
      { title: '一人負責到底', description: '溝通不用轉手' },
      { title: '後台自己改內容', description: '更新不用等人' },
      { title: 'SEO 基礎設定', description: 'Google 找得到你' },
    ],
    ctaTitle: '有想做的網站了嗎？',
    ctaText: '告訴我你的想法，一個工作天內回覆，先聊聊不收費。',
  },
})

await payload.updateGlobal({
  slug: 'about-page',
  data: {
    intro: '（待補）在這裡寫一段自我介紹：你是誰、做網站多久、平常接哪些案子。',
    why: '（待補）為什麼開始做網站？想幫什麼樣的客人解決什麼問題？',
    skills: ['Next.js', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Payload CMS'].map((name) => ({ name })),
    story:
      '「大壯」取自《易經》第三十四卦「雷天大壯」：雷在天上，聲勢盛大。希望每個經手的網站，都能讓品牌在網路上站得穩、長得壯。',
  },
})

await payload.updateGlobal({
  slug: 'process-page',
  data: {
    intro: '從第一次聊天到網站上線後的交接，一共 6 個步驟，每個階段要做什麼、要多久都先講清楚。',
    steps: [
      { title: '需求訪談', description: '了解你的品牌、客群、想要的功能與預算。', duration: '1～3 天' },
      { title: '提案報價', description: '整理網站架構、功能清單、時程與報價，確認後簽約。', duration: '3～5 天' },
      { title: '設計確認', description: '先做首頁與主要內頁的設計稿，來回修改到你滿意。', duration: '1～2 週' },
      { title: '開發製作', description: '切版、串後台、放入內容，過程中隨時可以看測試網址。', duration: '2～6 週' },
      { title: '正式上線', description: '設定網域、SSL、SEO 與網站地圖，全面測試後上線。', duration: '1～3 天' },
      { title: '教育訓練與交接', description: '教你用後台更新內容，交接所有帳號密碼與文件。', duration: '1 天' },
    ],
  },
})

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    serviceArea: '全台線上服務',
    footerBlurb: '形象網站設計與客製化系統開發，一人負責到底。',
    footerKeywords: [
      ['形象網站設計', '/services/brand-website'],
      ['RWD 網頁設計', '/services/brand-website'],
      ['工作室網站', '/works/category/studio-website'],
      ['購物網站建置', '/services/custom-system'],
      ['線上預約系統', '/services/custom-system'],
      ['客製化系統開發', '/services/custom-system'],
    ].map(([label, href]) => ({ label, href })),
    seoTitle: 'BigZhaung 大壯做網站｜形象網站設計・客製化系統',
    seoDescription: '形象網站設計與客製化系統開發。從需求訪談、設計、開發到上線教學，一個人負責到底。',
  },
})

payload.logger.info('Seed complete.')
process.exit(0)
