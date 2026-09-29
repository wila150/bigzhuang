import Image from 'next/image'
import Link from 'next/link'

import { CtaBanner } from '@/components/CtaBanner'
import { Icon, type IconName } from '@/components/Icon'
import { WorksMarquee } from '@/components/WorksMarquee'
import type { Metadata } from 'next'

import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang, type LangParams } from '@/i18n/page'
import { getHome, getProcess, getProjects, getServices, media, mediaUrl } from '@/lib/data'

const pointIcons: IconName[] = ['device', 'person', 'edit', 'search']
const stepIcons: IconName[] = ['chat', 'doc', 'palette', 'code', 'rocket', 'handshake']

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return { alternates: alternates(await pageLang(params), '/') }
}

export default async function HomePage({ params }: LangParams) {
  const lang = await pageLang(params)
  const t = getDictionary(lang)
  const p = (path: string) => localePath(lang, path)
  const [home, services, projects, process] = await Promise.all([getHome(lang), getServices(lang), getProjects(lang), getProcess(lang)])
  const heroImg = mediaUrl(home.heroImage, 'large')

  return (
    // On phones the works section is moved up under the hero via CSS order (see .home in styles.css).
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">{t.brand}</p>
            <h1 className="hero-title">{home.heroTitle}</h1>
            {home.heroText ? <p className="hero-text">{home.heroText}</p> : null}
            <div className="hero-actions">
              <Link className="btn btn-accent" href={p('/contact')}>
                {t.nav.contact}
              </Link>
              <Link className="btn btn-ghost" href={p('/works')}>
                {t.common.viewWorks} <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            {heroImg ? (
              <Image alt={media(home.heroImage)?.alt ?? ''} fill priority sizes="(max-width: 900px) 100vw, 50vw" src={heroImg} />
            ) : (
              <div className="hero-mark">
                <Image alt="" height={1278} priority src="/logo-mark.png" width={1287} />
              </div>
            )}
          </div>
        </div>
      </section>

      {home.sellingPoints?.length ? (
        <section aria-label={t.common.sellingPointsAria} className="points">
          <div className="container points-grid">
            {home.sellingPoints.map((p, i) => (
              <div className="point" key={p.id ?? i}>
                <span className="point-icon">
                  <Icon name={pointIcons[i % pointIcons.length]} size={26} />
                </span>
                <div>
                  <h2 className="point-title">{p.title}</h2>
                  {p.description ? <p>{p.description}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">SERVICES</p>
            <h2>{t.home.services}</h2>
          </div>
          <div className="service-cards">
            {services.map((s) => {
              const cover = mediaUrl(s.cover, 'card')
              return (
                <Link className="service-card" href={p(`/services/${s.slug}`)} key={s.id}>
                  <div className="service-card-media">
                    {cover ? <Image alt={media(s.cover)?.alt ?? ''} fill sizes="(max-width: 700px) 100vw, 50vw" src={cover} /> : null}
                  </div>
                  <div className="service-card-body">
                    <h3>{s.title}</h3>
                    <p>{s.summary}</p>
                    {s.includes?.length ? (
                      <ul className="chip-list">
                        {s.includes.slice(0, 4).map((inc) => (
                          <li key={inc.id ?? inc.item}>{inc.item}</li>
                        ))}
                      </ul>
                    ) : null}
                    <span className="text-link">
                      {t.common.learnMore} <Icon name="arrow" size={16} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt works-section">
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <p className="eyebrow">WORKS</p>
              <h2>{t.home.works}</h2>
            </div>
            <Link className="text-link" href={p('/works')}>
              {t.home.allWorks} <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
        <WorksMarquee lang={lang} projects={projects} />
      </section>

      {process.steps?.length ? (
        <section className="section">
          <div className="container">
            <div className="section-head section-head-row">
              <div>
                <p className="eyebrow">PROCESS</p>
                <h2>{t.home.process}</h2>
              </div>
              <Link className="text-link" href={p('/process')}>
                {t.home.fullProcess} <Icon name="arrow" size={16} />
              </Link>
            </div>
            <ol className="steps-row">
              {process.steps.map((step, i) => (
                <li key={step.id ?? i}>
                  <span className="step-icon">
                    <Icon name={stepIcons[i % stepIcons.length]} size={28} />
                  </span>
                  <span className="step-num">STEP {String(i + 1).padStart(2, '0')}</span>
                  <span className="step-name">{step.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <CtaBanner lang={lang} text={home.ctaText} title={home.ctaTitle} />
    </div>
  )
}
