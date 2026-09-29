import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WorksIndex } from '@/components/WorksIndex'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang } from '@/i18n/page'
import { categoryOf, getActiveCategories, getProjects } from '@/lib/data'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const { slug } = await params
  const current = (await getActiveCategories(lang)).find((c) => c.slug === slug)
  if (!current) return {}
  return { title: getDictionary(lang).works.categoryTitle(current.title), alternates: alternates(lang, `/works/category/${slug}`) }
}

export default async function WorksCategoryPage({ params }: Props) {
  const lang = await pageLang(params)
  const { slug } = await params
  const [categories, projects] = await Promise.all([getActiveCategories(lang), getProjects(lang)])
  const current = categories.find((c) => c.slug === slug)
  if (!current) notFound()
  return (
    <WorksIndex
      categories={categories}
      current={current}
      lang={lang}
      projects={projects.filter((p) => categoryOf(p)?.id === current.id)}
    />
  )
}
