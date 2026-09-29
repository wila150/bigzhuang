import type { Metadata, Viewport } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import React from 'react'

import { FloatingButtons } from '@/components/FloatingButtons'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { getActiveCategories, getServices, getSettings, isPreview } from '@/lib/data'

import './styles.css'

const sans = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-sans', display: 'swap' })
const serif = Noto_Serif_TC({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-serif', display: 'swap' })

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const title = s.seoTitle || 'BigZhaung 大壯做網站｜形象網站設計・客製化系統'
  const description = s.seoDescription || '一人接案，從設計、開發到上線一手包辦。'
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: '%s｜BigZhaung 大壯做網站' },
    description,
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      siteName: 'BigZhaung 大壯做網站',
      title,
      description,
      images: [{ url: '/social-preview-1200x630.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: ['/social-preview-1200x630.png'] },
  }
}

export const viewport: Viewport = { themeColor: '#0B2742' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, categories, preview] = await Promise.all([
    getSettings(),
    getServices(),
    getActiveCategories(),
    isPreview(),
  ])

  const nav = [
    { href: '/about', label: '關於大壯' },
    {
      href: '/services',
      label: '服務項目',
      children: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
    },
    {
      href: '/works',
      label: '作品案例',
      children: [
        { href: '/works', label: '全部作品' },
        ...categories.map((c) => ({ href: `/works/category/${c.slug}`, label: c.title })),
      ],
    },
    { href: '/process', label: '合作流程' },
    { href: '/faq', label: '常見問題' },
  ]

  return (
    <html className={`${sans.variable} ${serif.variable}`} lang="zh-Hant-TW">
      <body>
        <a className="skip-link" href="#main">
          跳到主要內容
        </a>
        <Header items={nav} />
        <main id="main">{children}</main>
        <Footer settings={settings} />
        <FloatingButtons lineUrl={settings.lineUrl} />
        {preview ? <LivePreviewListener /> : null}
      </body>
    </html>
  )
}
