import type { Metadata, Viewport } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { FloatingButtons } from '@/components/FloatingButtons'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { htmlLang, isLang, localePath, ogLocale, type Lang } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getActiveCategories, getServices, getSettings, isPreview } from '@/lib/data'

import '../styles.css'

const sans = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-sans', display: 'swap' })
const serif = Noto_Serif_TC({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-serif', display: 'swap' })

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

type Props = { params: Promise<{ lang: string }> }

async function langOf(params: Props['params']): Promise<Lang> {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return lang
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langOf(params)
  const [s, t] = [await getSettings(lang), getDictionary(lang)]
  const title = s.seoTitle || t.seoTitle
  const description = s.seoDescription || t.seoDescription
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: t.titleTemplate },
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
    verification: { google: 'BCBPfciSAEc1UnnSg9GtCWWlCgWMh0KenIjmB2dA52o' },
    openGraph: {
      type: 'website',
      locale: ogLocale[lang],
      siteName: t.brand,
      title,
      description,
      images: [{ url: '/social-preview-1200x630.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', images: ['/social-preview-1200x630.png'] },
  }
}

export const viewport: Viewport = { themeColor: '#0B2742' }

export default async function RootLayout({ children, params }: { children: React.ReactNode } & Props) {
  const lang = await langOf(params)
  const t = getDictionary(lang)
  const p = (path: string) => localePath(lang, path)
  const [settings, services, categories, preview] = await Promise.all([
    getSettings(lang),
    getServices(lang),
    getActiveCategories(lang),
    isPreview(),
  ])

  const nav = [
    { href: p('/about'), label: t.nav.about },
    {
      href: p('/services'),
      label: t.nav.services,
      children: services.map((s) => ({ href: p(`/services/${s.slug}`), label: s.title })),
    },
    {
      href: p('/works'),
      label: t.nav.works,
      children: [
        { href: p('/works'), label: t.nav.allWorks },
        ...categories.map((c) => ({ href: p(`/works/category/${c.slug}`), label: c.title })),
      ],
    },
    { href: p('/process'), label: t.nav.process },
    { href: p('/faq'), label: t.nav.faq },
  ]

  return (
    <html className={`${sans.variable} ${serif.variable}`} lang={htmlLang[lang]}>
      <body>
        <a className="skip-link" href="#main">
          {t.skipToContent}
        </a>
        <Header items={nav} lang={lang} t={t.nav} />
        <main id="main">{children}</main>
        <Footer lang={lang} settings={settings} t={t} />
        <FloatingButtons lineUrl={settings.lineUrl} t={t.float} />
        {preview ? <LivePreviewListener /> : null}
      </body>
    </html>
  )
}
