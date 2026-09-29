import Link from 'next/link'

import { localePath, type Lang } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSettings } from '@/lib/data'

// Orange banner at the bottom of each page. Text comes from 網站設定 → 底部聯絡橫幅; the home page can pass its own.
export async function CtaBanner({ lang, title, text }: { lang: Lang; title?: string | null; text?: string | null }) {
  const [s, t] = [await getSettings(lang), getDictionary(lang).cta]
  return (
    <section className="cta-banner">
      <div className="container cta-inner">
        <div>
          <h2>{title || s.ctaTitle || t.title}</h2>
          <p>{text || s.ctaText || t.text}</p>
        </div>
        <Link className="btn btn-light" href={localePath(lang, '/contact')}>
          {s.ctaButton || t.button}
        </Link>
      </div>
    </section>
  )
}
