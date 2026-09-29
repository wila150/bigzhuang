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
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { AboutPage } from './globals/AboutPage'
import { HomePage } from './globals/HomePage'
import { LineSettings } from './globals/LineSettings'
import { ProcessPage } from './globals/ProcessPage'
import { SiteSettings } from './globals/SiteSettings'

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
    },
    meta: {
      titleSuffix: '｜BigZhaung 後台',
      icons: [{ rel: 'icon', url: '/favicon.ico' }],
    },
  },
  // Admin UI in Traditional Chinese by default; English stays selectable under 帳號 → 語言.
  i18n: {
    supportedLanguages: { 'zh-TW': zhTw, en },
    fallbackLanguage: 'zh-TW',
  },
  collections: [Services, Projects, Categories, Faqs, Media, Inquiries, Clients, LineReplies, Users],
  globals: [HomePage, AboutPage, ProcessPage, SiteSettings, LineSettings],
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
