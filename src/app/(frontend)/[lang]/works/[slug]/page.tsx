import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon } from '@/components/Icon'
import { localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang } from '@/i18n/page'
import { categoryOf, getActiveCategories, getProject, getProjects, media, mediaUrl } from '@/lib/data'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const { slug } = await params
  const project = await getProject(lang, slug)
  if (!project) return {}
  const cover = mediaUrl(project.cover, 'large')
  return {
    title: project.title,
    description: project.summary || `${project.title} | ${categoryOf(project)?.title ?? getDictionary(lang).works.title}`,
    openGraph: cover ? { images: [cover] } : undefined,
    alternates: alternates(lang, `/works/${slug}`),
  }
}

export default async function WorkPage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDictionary(lang).works
  const p = (path: string) => localePath(lang, path)
  const { slug } = await params
  const [project, projects, categories] = await Promise.all([getProject(lang, slug), getProjects(lang), getActiveCategories(lang)])
  if (!project) notFound()

  const category = categoryOf(project)
  const idx = projects.findIndex((p) => p.id === project.id)
  const prev = idx > 0 ? projects[idx - 1] : null
  const next = idx < projects.length - 1 ? projects[idx + 1] : null

  const shots = [
    project.cover ? { key: 'cover', m: project.cover, wide: true } : null,
    ...(project.gallery ?? []).map((g, i) => ({ key: `g${i}`, m: g.image, wide: true })),
    project.mobileShot ? { key: 'mobile', m: project.mobileShot, wide: false } : null,
  ].filter((s): s is NonNullable<typeof s> => Boolean(s && media(s.m)))

  const info: [string, React.ReactNode][] = [
    [t.siteType, project.siteType],
    [t.category, category?.title],
    [t.industry, project.industry],
    [
      t.url,
      project.url ? (
        <a href={project.url} rel="noopener noreferrer" target="_blank">
          {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      ) : null,
    ],
    [t.year, project.year],
    [t.tech, project.tech?.map((x) => x.name).join(t.techJoin)],
  ]

  return (
    <>
      <section className="page-hero page-hero-slim">
        <div className="container">
          <Breadcrumbs
            items={[
              { href: '/works', label: t.title },
              ...(category ? [{ href: `/works/category/${category.slug}`, label: category.title }] : []),
              { label: project.title },
            ]}
            lang={lang}
          />
        </div>
      </section>
      <section className="section case">
        <div className="container case-layout">
          <aside className="case-aside">
            <h2 className="case-aside-title">{t.sidebar}</h2>
            <ul>
              <li>
                <Link href={p('/works')}>{t.allWorks}</Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link aria-current={c.id === category?.id ? 'true' : undefined} href={p(`/works/category/${c.slug}`)}>
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <article className="case-main">
            <h1>{project.title}</h1>
            {project.summary ? <p className="page-lead">{project.summary}</p> : null}

            <dl className="case-info">
              {info
                .filter(([, v]) => v !== null && v !== undefined && v !== '')
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>

            {project.features?.length ? (
              <ul className="chip-list case-tags">
                {project.features.map((f) => (
                  <li key={f.id ?? f.name}>{f.name}</li>
                ))}
              </ul>
            ) : null}

            {shots.length ? (
              <div className="case-gallery">
                {shots.map((s) => {
                  const m = media(s.m)!
                  return (
                    <figure className={s.wide ? 'shot-wide' : 'shot-phone'} key={s.key}>
                      <Image
                        alt={m.alt}
                        height={m.height ?? (s.wide ? 900 : 844)}
                        sizes={s.wide ? '(max-width: 900px) 100vw, 860px' : '320px'}
                        src={mediaUrl(m, 'large')!}
                        width={m.width ?? (s.wide ? 1440 : 390)}
                      />
                    </figure>
                  )
                })}
              </div>
            ) : (
              <div className="case-placeholder">{t.shotsPending}</div>
            )}

            <nav aria-label={t.pagerAria} className="case-pager">
              {prev ? (
                <Link href={p(`/works/${prev.slug}`)} rel="prev">
                  <span>{t.prev}</span>
                  <strong>{prev.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link className="is-next" href={p(`/works/${next.slug}`)} rel="next">
                  <span>{t.next}</span>
                  <strong>
                    {next.title} <Icon name="arrow" size={16} />
                  </strong>
                </Link>
              ) : null}
            </nav>
          </article>
        </div>
      </section>
      <CtaBanner lang={lang} />
    </>
  )
}
