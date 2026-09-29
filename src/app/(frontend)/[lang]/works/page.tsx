import type { Metadata } from 'next'

import { WorksIndex } from '@/components/WorksIndex'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang, type LangParams } from '@/i18n/page'
import { getActiveCategories, getProjects } from '@/lib/data'

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDictionary(lang).works
  return { title: t.title, description: t.description, alternates: alternates(lang, '/works') }
}

export default async function WorksPage({ params }: LangParams) {
  const lang = await pageLang(params)
  const [categories, projects] = await Promise.all([getActiveCategories(lang), getProjects(lang)])
  return <WorksIndex categories={categories} lang={lang} projects={projects} />
}
