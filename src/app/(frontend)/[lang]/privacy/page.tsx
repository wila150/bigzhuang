import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang, type LangParams } from '@/i18n/page'

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await pageLang(params)
  return { title: getDictionary(lang).privacy.title, robots: { index: false }, alternates: alternates(lang, '/privacy') }
}

export default async function PrivacyPage({ params }: LangParams) {
  const lang = await pageLang(params)
  const t = getDictionary(lang).privacy
  return (
    <>
      <PageHero crumbs={[{ label: t.title }]} lang={lang} title={t.title} />
      <section className="section">
        <div className="container prose narrow">
          {t.sections.map((sec, i) => (
            <div key={i}>
              {'h' in sec && sec.h ? <h2>{sec.h}</h2> : null}
              <p>{sec.p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
