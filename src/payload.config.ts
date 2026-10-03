import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { zhTw } from '@payloadcms/translations/languages/zhTw'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { googleOAuthAdmin, googleOAuthClients } from './auth/google'
import { Categories } from './collections/Categories'
import { Clients } from './collections/Clients'
import { Faqs } from './collections/Faqs'
import { Inquiries } from './collections/Inquiries'
import { LineReplies } from './collections/LineReplies'
import { LineSessions } from './collections/LineSessions'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Sites } from './collections/Sites'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { ContactPage } from './globals/ContactPage'
import { HomePage } from './globals/HomePage'
import { LineSettings } from './globals/LineSettings'
import { ProcessPage } from './globals/ProcessPage'
import { SiteSettings } from './globals/SiteSettings'
import { checkAllSites } from './monitor/check'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// In production, uploads go to Supabase Storage (S3-compatible) because Render's disk is wiped on deploy.
// Locally, leaving S3_BUCKET unset keeps files in ./media.
const useS3 = Boolean(process.env.S3_BUCKET)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterLogin: ['@/components/admin/GoogleLoginButton'],
      beforeDashboard: ['@/components/admin/SiteStatus'],
    },
    // Side-by-side preview while editing, switchable between phone and desktop.
    livePreview: {
      collections: ['services', 'projects'],
      globals: ['home-page', 'about-page', 'process-page', 'contact-page'],
      openByDefault: true,
      breakpoints: [
        { name: 'mobile', label: '手機', width: 390, height: 844 },
        { name: 'desktop', label: '電腦', width: 1440, height: 900 },
      ],
      url: ({ data, collectionConfig, globalConfig, locale }) => {
        const pagePath: Record<string, string> = {
          'home-page': '/',
          'about-page': '/about',
          'process-page': '/process',
          'contact-page': '/contact',
        }
        let path: string | undefined
        if (globalConfig) path = pagePath[globalConfig.slug]
        else if (collectionConfig?.slug === 'services' && data?.slug) path = `/services/${data.slug}`
        else if (collectionConfig?.slug === 'projects' && data?.slug) path = `/works/${data.slug}`
        if (!path) return null
        const localized = locale?.code === 'en' ? (path === '/' ? '/en' : `/en${path}`) : path
        return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/preview?path=${encodeURIComponent(localized)}`
      },
    },
    meta: {
      titleSuffix: '｜BigZhaung 後台',
      icons: [{ rel: 'icon', url: '/favicon.ico' }],
    },
  },
  // Site content in two languages: Chinese at the root URLs, English under /en (see src/proxy.ts).
  localization: {
    locales: [
      { label: '中文', code: 'zh' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'zh',
    // Untranslated English fields show the Chinese text instead of being blank.
    fallback: true,
  },
  // Admin UI in Traditional Chinese by default; English stays selectable under 帳號 → 語言.
  i18n: {
    supportedLanguages: { 'zh-TW': zhTw, en },
    fallbackLanguage: 'zh-TW',
  },
  collections: [Services, Projects, Categories, Faqs, Media, Inquiries, Clients, LineReplies, LineSessions, Sites, Users],
  globals: [HomePage, AboutPage, ProcessPage, ContactPage, SiteSettings, LineSettings],
  // Site monitor: every 10 minutes, ping the sites in 監控網站 (see src/monitor/check.ts).
  // Runs inside the always-on web server, so no external cron is needed.
  jobs: {
    // Customer-portal clients are logged in too — only staff may queue or run jobs over the REST API.
    access: {
      queue: ({ req }) => req.user?.collection === 'users',
      run: ({ req }) => req.user?.collection === 'users',
      cancel: ({ req }) => req.user?.collection === 'users',
    },
    tasks: [
      {
        slug: 'checkSites',
        label: '檢查監控網站',
        schedule: [{ cron: '0 */10 * * * *', queue: 'monitor' }],
        handler: async ({ req }) => {
          await checkAllSites(req.payload)
          return { output: {} }
        },
      },
    ],
    // Only the deployed server runs the monitor, so `npm run dev` doesn't ping sites or send LINE alerts.
    autoRun: process.env.NODE_ENV === 'production' ? [{ cron: '* * * * *', queue: 'monitor' }] : [],
    deleteJobOnComplete: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    googleOAuthAdmin,
    googleOAuthClients,
    s3Storage({
      enabled: useS3,
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'ap-northeast-1',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
})
