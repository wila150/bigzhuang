import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon, type IconName } from '@/components/Icon'
import { ProjectGrid } from '@/components/ProjectGrid'
import { getProjects, getService, getServices, mediaUrl, projectsForService } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

const featureIcons: IconName[] = ['device', 'edit', 'lock', 'search']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug)
  if (!service) return {}
  const cover = mediaUrl(service.cover, 'large')
  return {
    title: service.title,
    description: service.summary,
    openGraph: cover ? { images: [cover] } : undefined,
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const [service, services, projects] = await Promise.all([getService(slug), getServices(), getProjects()])
  if (!service) notFound()

  const related = projectsForService(service, projects)
  const idx = services.findIndex((s) => s.id === service.id)
  const next = services.length > 1 ? services[(idx + 1) % services.length] : null

  const toc = [
    service.features?.length && { id: 'features', label: '網站特色' },
    service.points?.length && { id: 'points', label: '三大重點' },
    service.addons?.length && { id: 'addons', label: '你可能還需要' },
    related.length && { id: 'cases', label: '相關案例' },
  ].filter(Boolean) as { id: string; label: string }[]

  return (
    <>
      <section className="page-hero service-hero">
        <div className="container">
          <Breadcrumbs items={[{ href: '/services', label: '服務項目' }, { label: service.title }]} />
          <p className="eyebrow">{service.title}</p>
          <h1>{service.tagline || service.title}</h1>
          <p className="page-lead">{service.summary}</p>
          <Link className="btn btn-accent" href="/contact">
            歡迎洽詢
          </Link>
        </div>
      </section>

      {service.problem || service.solution ? (
        <section className="section">
          <div className="container problem">
            {service.problem ? (
              <div className="problem-card">
                <span className="problem-label">你是不是也這樣？</span>
                <p>{service.problem}</p>
              </div>
            ) : null}
            {service.solution ? (
              <div className="problem-card is-solution">
                <span className="problem-label">大壯的做法</span>
                <p>{service.solution}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {toc.length > 1 ? (
        <nav aria-label="本頁目錄" className="toc">
          <div className="container toc-inner">
            <span className="toc-title">本頁目錄</span>
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
              <h2>網站特色</h2>
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
              <h2>三大重點</h2>
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
              <h2>你可能還需要</h2>
            </div>
            <div className="addon-grid">
              {service.addons.map((a, i) => (
                <Link className="addon" href="/contact" key={a.id ?? i}>
                  <h3>{a.title}</h3>
                  {a.description ? <p>{a.description}</p> : null}
                  <span className="text-link">
                    詢問這項 <Icon name="arrow" size={16} />
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
              <h2>相關案例</h2>
            </div>
            <ProjectGrid projects={related.slice(0, 6)} />
          </div>
        </section>
      ) : null}

      {next && next.id !== service.id ? (
        <section className="next-service">
          <div className="container">
            <Link className="next-service-link" href={`/services/${next.slug}`}>
              <span>下一個服務</span>
              <strong>
                {next.title} <Icon name="arrow" size={22} />
              </strong>
            </Link>
          </div>
        </section>
      ) : null}

      <CtaBanner />
    </>
  )
}
