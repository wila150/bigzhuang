// Chinese lives at the root URLs, English under /en. The Payload locale codes match.
export const locales = ['zh', 'en'] as const
export type Lang = (typeof locales)[number]
export const defaultLang: Lang = 'zh'

export const isLang = (value: string): value is Lang => (locales as readonly string[]).includes(value)

/** Prefix a site path for a language: ('en', '/works') -> '/en/works'; Chinese stays unprefixed. */
export function localePath(lang: Lang, path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  if (lang === defaultLang) return path
  return path === '/' ? `/${lang}` : `/${lang}${path}`
}

/** Remove a language prefix: '/en/works' -> '/works' (also the internal /zh prefix used by the proxy rewrite). */
export function stripLocale(pathname: string) {
  const m = pathname.match(/^\/(en|zh)(\/.*)?$/)
  return m ? m[2] || '/' : pathname
}

export const htmlLang: Record<Lang, string> = { zh: 'zh-Hant-TW', en: 'en' }
export const ogLocale: Record<Lang, string> = { zh: 'zh_TW', en: 'en_US' }
