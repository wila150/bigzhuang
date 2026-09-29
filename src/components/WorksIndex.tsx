import Link from 'next/link'

import type { Category, Project } from '@/payload-types'

import { PageHero } from './Breadcrumbs'
import { CtaBanner } from './CtaBanner'
import { ProjectGrid } from './ProjectGrid'
import { WorksMarquee } from './WorksMarquee'

export function WorksIndex({
  categories,
  projects,
  current,
}: {
  categories: Category[]
  projects: Project[]
  current?: Category
}) {
  const crumbs = current
    ? [{ href: '/works', label: '作品案例' }, { label: current.title }]
    : [{ label: '作品案例' }]

  return (
    <>
      <PageHero crumbs={crumbs} lead="每個案例都是從零開始規劃，點進去看網站類型、使用技術與實際畫面。" title={current ? `${current.title}案例` : '作品案例'} />
      <section className="section works-page">
        <div className="container">
          <nav aria-label="作品分類" className="filter-bar">
            <Link aria-current={!current ? 'page' : undefined} className="filter-btn" href="/works">
              全部
            </Link>
            {categories.map((c) => (
              <Link
                aria-current={current?.id === c.id ? 'page' : undefined}
                className="filter-btn"
                href={`/works/category/${c.slug}`}
                key={c.id}
              >
                {c.title}
              </Link>
            ))}
          </nav>
        </div>
        <WorksMarquee projects={projects} />
        <div className="container">
          <h2 className="sr-only">案例列表</h2>
          <ProjectGrid projects={projects} />
        </div>
      </section>
      <CtaBanner />
    </>
  )
}
