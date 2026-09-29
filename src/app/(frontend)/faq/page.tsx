import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon } from '@/components/Icon'
import { getFaqs } from '@/lib/data'

export const metadata: Metadata = { title: '常見問題', description: '製作時間、需要準備的資料、網域主機歸屬、改版與加功能等常見問題。' }

export default async function FaqPage() {
  const faqs = await getFaqs()
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
      <PageHero crumbs={[{ label: '常見問題' }]} lead="找不到你的問題？直接用 LINE 或表單問我。" title="常見問題" />
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
      <CtaBanner />
    </>
  )
}
