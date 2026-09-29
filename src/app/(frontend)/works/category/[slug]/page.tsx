import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WorksIndex } from '@/components/WorksIndex'
import { categoryOf, getActiveCategories, getProjects } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const current = (await getActiveCategories()).find((c) => c.slug === slug)
  return current ? { title: `${current.title}案例` } : {}
}

export default async function WorksCategoryPage({ params }: Props) {
  const { slug } = await params
  const [categories, projects] = await Promise.all([getActiveCategories(), getProjects()])
  const current = categories.find((c) => c.slug === slug)
  if (!current) notFound()
  return (
    <WorksIndex
      categories={categories}
      current={current}
      projects={projects.filter((p) => categoryOf(p)?.id === current.id)}
    />
  )
}
