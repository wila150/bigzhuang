import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon } from '@/components/Icon'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang, type LangParams } from '@/i18n/page'
import { getServices, media, mediaUrl } from '@/lib/data'

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDictionary(lang).services
  return { title: t.title, description: t.description, alternates: alternates(lang, '/services') }
}

export default async function ServicesPage({ params }: LangParams) {
  const lang = await pageLang(params)
  const t = getDictionary(lang).services
  const services = await getServices(lang)
  return (
    <>
      <PageHero crumbs={[{ label: t.title }]} lang={lang} lead={t.lead} title={t.title} />
      <section className="section">
        <div className="container service-list">
          {services.map((s, i) => {
            const cover = mediaUrl(s.cover, 'card')
            return (
              <article className={`service-row${i % 2 ? ' is-flipped' : ''}`} key={s.id}>
                <div className="service-row-media">
                  {cover ? (
                    <Image alt={media(s.cover)?.alt ?? ''} fill sizes="(max-width: 800px) 100vw, 45vw" src={cover} />
                  ) : (
                    <span className="service-row-num">0{i + 1}</span>
                  )}
                </div>
                <div className="service-row-body">
                  <h2>{s.title}</h2>
                  <p>{s.summary}</p>
                  {s.includes?.length ? (
                    <ul className="check-list">
                      {s.includes.map((inc) => (
                        <li key={inc.id ?? inc.item}>
                          <Icon name="check" size={18} />
                          {inc.item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="row-actions">
                    <Link className="btn btn-primary" href={localePath(lang, `/services/${s.slug}`)}>
                      {t.learn(s.title)}
                    </Link>
                    <Link className="text-link" href={localePath(lang, '/contact')}>
                      {t.inquire} <Icon name="arrow" size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      <CtaBanner lang={lang} />
    </>
  )
}
