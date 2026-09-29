import type { Metadata } from 'next'
import Image from 'next/image'

import { PageHero } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang, type LangParams } from '@/i18n/page'
import { getAbout, media, mediaUrl } from '@/lib/data'

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDictionary(lang).about
  return { title: t.title, description: t.description, alternates: alternates(lang, '/about') }
}

export default async function AboutPage({ params }: LangParams) {
  const lang = await pageLang(params)
  const t = getDictionary(lang).about
  const about = await getAbout(lang)
  const photo = mediaUrl(about.photo, 'card')

  return (
    <>
      <PageHero crumbs={[{ label: t.title }]} lang={lang} lead={t.lead} title={t.title} />
      <section className="section">
        <div className="container about-grid">
          <div className="about-photo">
            {photo ? (
              <Image alt={media(about.photo)?.alt ?? t.photoAlt} fill sizes="(max-width: 800px) 100vw, 40vw" src={photo} />
            ) : (
              <Image alt="" height={1278} src="/logo-mark.png" width={1287} />
            )}
          </div>
          <div className="prose">
            {about.intro ? (
              <>
                <h2>{t.hello}</h2>
                <p className="pre">{about.intro}</p>
              </>
            ) : null}
            {about.why ? (
              <>
                <h2>{t.why}</h2>
                <p className="pre">{about.why}</p>
              </>
            ) : null}
            {about.skills?.length ? (
              <>
                <h2>{t.skills}</h2>
                <ul className="chip-list">
                  {about.skills.map((s) => (
                    <li key={s.id ?? s.name}>{s.name}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </section>
      {about.story ? (
        <section className="section section-alt">
          <div className="container story">
            <p className="story-hexagram" aria-hidden>
              ䷡
            </p>
            <div className="prose">
              <h2>{t.story}</h2>
              <p className="pre">{about.story}</p>
            </div>
          </div>
        </section>
      ) : null}
      <CtaBanner lang={lang} />
    </>
  )
}
