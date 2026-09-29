import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon, type IconName } from '@/components/Icon'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang, type LangParams } from '@/i18n/page'
import { getProcess } from '@/lib/data'

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDictionary(lang).process
  return { title: t.title, description: t.description, alternates: alternates(lang, '/process') }
}

const stepIcons: IconName[] = ['chat', 'doc', 'palette', 'code', 'rocket', 'handshake']

export default async function ProcessPage({ params }: LangParams) {
  const lang = await pageLang(params)
  const t = getDictionary(lang).process
  const process = await getProcess(lang)
  return (
    <>
      <PageHero crumbs={[{ label: t.title }]} lang={lang} lead={process.intro} title={t.title} />
      <section className="section">
        <div className="container">
          <ol className="timeline">
            {(process.steps ?? []).map((s, i) => (
              <li className="timeline-item" key={s.id ?? i}>
                <span className="timeline-icon">
                  <Icon name={stepIcons[i % stepIcons.length]} size={26} />
                </span>
                <div className="timeline-body">
                  <span className="step-num">STEP {String(i + 1).padStart(2, '0')}</span>
                  <h2>{s.title}</h2>
                  {s.description ? <p>{s.description}</p> : null}
                  {s.duration ? <p className="timeline-duration">{t.about(s.duration)}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBanner lang={lang} />
    </>
  )
}
