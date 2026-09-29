import Image from 'next/image'
import Link from 'next/link'

import type { Project } from '@/payload-types'
import { categoryOf, media, mediaUrl } from '@/lib/data'

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="empty-note">這個分類的案例整理中。</p>
  return (
    <ul className="project-grid">
      {projects.map((p) => {
        const cover = mediaUrl(p.cover, 'card')
        return (
          <li key={p.id}>
            <Link className="project-card" href={`/works/${p.slug}`}>
              <div className={`project-card-media${cover ? '' : ' mq-empty'}`}>
                {cover ? <Image alt={media(p.cover)?.alt ?? p.title} fill sizes="(max-width: 700px) 100vw, 33vw" src={cover} /> : null}
              </div>
              <div className="project-card-body">
                <span className="project-card-cat">{categoryOf(p)?.title}</span>
                <h3>{p.title}</h3>
                {p.industry ? <p>{p.industry}</p> : null}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
