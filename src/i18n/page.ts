import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLang, localePath, type Lang } from './config'

export type LangParams = { params: Promise<{ lang: string }> }

/** Reads and validates the [lang] route segment. */
export async function pageLang(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params
  if (!isLang(lang)) notFound()
  return lang
}

/** canonical + hreflang links for a page that exists in both languages. */
export function alternates(lang: Lang, path: string): Metadata['alternates'] {
  return {
    canonical: localePath(lang, path),
    languages: { 'zh-Hant-TW': localePath('zh', path), en: localePath('en', path), 'x-default': localePath('zh', path) },
  }
}
