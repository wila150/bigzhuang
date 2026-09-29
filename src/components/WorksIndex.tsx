import Link from 'next/link'

import { localePath, type Lang } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import type { Category, Project } from '@/payload-types'

import { PageHero } from './Breadcrumbs'
import { CtaBanner } from './CtaBanner'
import { ProjectGrid } from './ProjectGrid'
import { WorksMarquee } from './WorksMarquee'

export function WorksIndex({
  categories,
  projects,
  current,
  lang,
}: {
  categories: Category[]
  projects: Project[]
  current?: Category
  lang: Lang
}) {
  const t = getDictionary(lang).works
  const crumbs = current ? [{ href: '/works', label: t.title }, { label: current.title }] : [{ label: t.title }]

  return (
    <>
      <PageHero crumbs={crumbs} lang={lang} lead={t.lead} title={current ? t.categoryTitle(current.title) : t.title} />
      <section className="section works-page">
        <div className="container">
          <nav aria-label={t.filterAria} className="filter-bar">
            <Link aria-current={!current ? 'page' : undefined} className="filter-btn" href={localePath(lang, '/works')}>
              {t.all}
            </Link>
            {categories.map((c) => (
              <Link
                aria-current={current?.id === c.id ? 'page' : undefined}
                className="filter-btn"
                href={localePath(lang, `/works/category/${c.slug}`)}
                key={c.id}
              >
                {c.title}
              </Link>
            ))}
          </nav>
        </div>
        <WorksMarquee lang={lang} projects={projects} />
        <div className="container">
          <h2 className="sr-only">{t.listHeading}</h2>
          <ProjectGrid lang={lang} projects={projects} />
        </div>
      </section>
      <CtaBanner lang={lang} />
    </>
  )
}
