import type { Metadata } from 'next'
import Image from 'next/image'

import { PageHero } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { getAbout, media, mediaUrl } from '@/lib/data'

export const metadata: Metadata = { title: '關於大壯', description: '認識 BigZhaung 背後的人：為什麼做網站、會哪些技術，以及「大壯」這個名字的由來。' }

export default async function AboutPage() {
  const about = await getAbout()
  const photo = mediaUrl(about.photo, 'card')

  return (
    <>
      <PageHero crumbs={[{ label: '關於大壯' }]} lead="一個人接案，從第一次聊天到上線後的維護，都是同一個人負責。" title="關於大壯" />
      <section className="section">
        <div className="container about-grid">
          <div className="about-photo">
            {photo ? (
              <Image alt={media(about.photo)?.alt ?? '大壯'} fill sizes="(max-width: 800px) 100vw, 40vw" src={photo} />
            ) : (
              <Image alt="" height={1278} src="/logo-mark.png" width={1287} />
            )}
          </div>
          <div className="prose">
            {about.intro ? (
              <>
                <h2>你好，我是大壯</h2>
                <p className="pre">{about.intro}</p>
              </>
            ) : null}
            {about.why ? (
              <>
                <h2>為什麼做網站</h2>
                <p className="pre">{about.why}</p>
              </>
            ) : null}
            {about.skills?.length ? (
              <>
                <h2>會的技術</h2>
                <ul className="chip-list">
                  {about.skills.map((s) => (
                    <li key={s.id ?? s.name}>{s.name}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </section>
      {about.story ? (
        <section className="section section-alt">
          <div className="container story">
            <p className="story-hexagram" aria-hidden>
              ䷡
            </p>
            <div className="prose">
              <h2>品牌故事：雷天大壯</h2>
              <p className="pre">{about.story}</p>
            </div>
          </div>
        </section>
      ) : null}
      <CtaBanner />
    </>
  )
}
