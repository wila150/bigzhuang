import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon } from '@/components/Icon'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang, type LangParams } from '@/i18n/page'
import { getFaqs } from '@/lib/data'

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDictionary(lang).faq
  return { title: t.title, description: t.description, alternates: alternates(lang, '/faq') }
}

export default async function FaqPage({ params }: LangParams) {
  const lang = await pageLang(params)
  const t = getDictionary(lang).faq
  const faqs = await getFaqs(lang)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
  return (
    <>
      <PageHero crumbs={[{ label: t.title }]} lang={lang} lead={t.lead} title={t.title} />
      <section className="section">
        <div className="container faq-list">
          {faqs.map((f, i) => (
            <details className="faq" key={f.id} open={i === 0}>
              <summary>
                <span className="faq-q">Q</span>
                {f.question}
                <Icon className="faq-caret" name="chevron" size={20} />
              </summary>
              <p className="pre">{f.answer}</p>
            </details>
          ))}
        </div>
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" />
      </section>
      <CtaBanner lang={lang} />
    </>
  )
}
