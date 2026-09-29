import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon } from '@/components/Icon'
import { getServices, media, mediaUrl } from '@/lib/data'

export const metadata: Metadata = { title: '服務項目', description: '形象網站設計與客製化系統開發，只列實際做得到的服務。' }

export default async function ServicesPage() {
  const services = await getServices()
  return (
    <>
      <PageHero crumbs={[{ label: '服務項目' }]} lead="兩條服務線，每一項都由我親自規劃、設計與開發。" title="服務項目" />
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
                    <Link className="btn btn-primary" href={`/services/${s.slug}`}>
                      了解{s.title}
                    </Link>
                    <Link className="text-link" href="/contact">
                      歡迎洽詢 <Icon name="arrow" size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
      <CtaBanner />
    </>
  )
}
