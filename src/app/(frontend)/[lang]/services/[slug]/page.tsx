import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon, type IconName } from '@/components/Icon'
import { ProjectGrid } from '@/components/ProjectGrid'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang } from '@/i18n/page'
import { getProjects, getService, getServices, media, mediaUrl, projectsForService } from '@/lib/data'

type Props = { params: Promise<{ lang: string; slug: string }> }

const featureIcons: IconName[] = ['device', 'edit', 'lock', 'search']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const { slug } = await params
  const service = await getService(lang, slug)
  if (!service) return {}
  const cover = mediaUrl(service.cover, 'large')
  return {
    title: service.title,
    description: service.summary,
    openGraph: cover ? { images: [cover] } : undefined,
    alternates: alternates(lang, `/services/${slug}`),
  }
}

export default async function ServicePage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDictionary(lang).services
  const p = (path: string) => localePath(lang, path)
  const { slug } = await params
  const [service, services, projects] = await Promise.all([getService(lang, slug), getServices(lang), getProjects(lang)])
  if (!service) notFound()

  const related = projectsForService(service, projects)
  const cover = mediaUrl(service.cover, 'large')
  const idx = services.findIndex((s) => s.id === service.id)
  const next = services.length > 1 ? services[(idx + 1) % services.length] : null

  const toc = [
    service.features?.length && { id: 'features', label: t.features },
    service.points?.length && { id: 'points', label: t.points },
    service.addons?.length && { id: 'addons', label: t.addons },
    related.length && { id: 'cases', label: t.cases },
  ].filter(Boolean) as { id: string; label: string }[]

  return (
    <>
      <section className="page-hero service-hero">
        <div className="container">
          <Breadcrumbs items={[{ href: '/services', label: t.title }, { label: service.title }]} lang={lang} />
          <div className={cover ? 'service-hero-grid' : undefined}>
            <div>
              <p className="eyebrow">{service.title}</p>
              <h1>{service.tagline || service.title}</h1>
              <p className="page-lead">{service.summary}</p>
              <Link className="btn btn-accent" href={p('/contact')}>
                {t.inquire}
              </Link>
            </div>
            {cover ? (
              <div className="service-hero-visual">
                <Image
                  alt={media(service.cover)?.alt ?? service.title}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 55vw"
                  src={cover}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {service.problem || service.solution ? (
        <section className="section">
          <div className="container problem">
            {service.problem ? (
              <div className="problem-card">
                <span className="problem-label">{t.problemLabel}</span>
                <p>{service.problem}</p>
              </div>
            ) : null}
            {service.solution ? (
              <div className="problem-card is-solution">
                <span className="problem-label">{t.solutionLabel}</span>
                <p>{service.solution}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {toc.length > 1 ? (
        <nav aria-label={t.toc} className="toc">
          <div className="container toc-inner">
            <span className="toc-title">{t.toc}</span>
            {toc.map((t) => (
              <a href={`#${t.id}`} key={t.id}>
                {t.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      {service.features?.length ? (
        <section className="section section-alt" id="features">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">FEATURES</p>
              <h2>{t.features}</h2>
            </div>
            <div className="feature-grid">
              {service.features.map((f, i) => (
                <div className="feature" key={f.id ?? i}>
                  <span className="point-icon">
                    <Icon name={featureIcons[i % featureIcons.length]} size={26} />
                  </span>
                  <h3>{f.title}</h3>
                  {f.description ? <p>{f.description}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.points?.length ? (
        <section className="section" id="points">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">KEY POINTS</p>
              <h2>{t.points}</h2>
            </div>
            <div className="key-points">
              {service.points.map((p, i) => (
                <article className="key-point" key={p.id ?? i}>
                  <span className="key-point-num">POINT {i + 1}</span>
                  <h3>{p.title}</h3>
                  {p.description ? <p>{p.description}</p> : null}
                  {p.tags?.length ? (
                    <ul className="chip-list">
                      {p.tags.map((t) => (
                        <li key={t.id ?? t.tag}>{t.tag}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {service.addons?.length ? (
        <section className="section section-alt" id="addons">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">ADD-ONS</p>
              <h2>{t.addons}</h2>
            </div>
            <div className="addon-grid">
              {service.addons.map((a, i) => (
                <Link className="addon" href={p('/contact')} key={a.id ?? i}>
                  <h3>{a.title}</h3>
                  {a.description ? <p>{a.description}</p> : null}
                  <span className="text-link">
                    {t.askThis} <Icon name="arrow" size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="section" id="cases">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">CASES</p>
              <h2>{t.cases}</h2>
            </div>
            <ProjectGrid lang={lang} projects={related.slice(0, 6)} />
          </div>
        </section>
      ) : null}

      {next && next.id !== service.id ? (
        <section className="next-service">
          <div className="container">
            <Link className="next-service-link" href={p(`/services/${next.slug}`)}>
              <span>{t.next}</span>
              <strong>
                {next.title} <Icon name="arrow" size={22} />
              </strong>
            </Link>
          </div>
        </section>
      ) : null}

      <CtaBanner lang={lang} />
    </>
  )
}
