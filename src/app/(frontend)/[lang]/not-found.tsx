import { headers } from 'next/headers'
import Link from 'next/link'

import { localePath, type Lang } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// not-found gets no route params, so the language comes from the x-lang header set in src/proxy.ts.
export default async function NotFound() {
  const lang: Lang = (await headers()).get('x-lang') === 'en' ? 'en' : 'zh'
  const t = getDictionary(lang).notFound
  return (
    <section className="section not-found">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>{t.title}</h1>
        <p>{t.text}</p>
        <Link className="btn btn-primary" href={localePath(lang, '/')}>
          {t.back}
        </Link>
      </div>
    </section>
  )
}
