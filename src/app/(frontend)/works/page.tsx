import type { Metadata } from 'next'

import { WorksIndex } from '@/components/WorksIndex'
import { getActiveCategories, getProjects } from '@/lib/data'

export const metadata: Metadata = { title: '作品案例', description: 'BigZhaung 做過的形象網站與客製化系統案例。' }

export default async function WorksPage() {
  const [categories, projects] = await Promise.all([getActiveCategories(), getProjects()])
  return <WorksIndex categories={categories} projects={projects} />
}
