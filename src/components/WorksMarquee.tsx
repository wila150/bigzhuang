import Image from 'next/image'
import Link from 'next/link'

import type { Project } from '@/payload-types'
import { localePath, type Lang } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { media, mediaUrl } from '@/lib/data'

type Tile = { key: string; href: string; title: string; kind: 'big' | 'small' | 'tall'; src: string | null; alt: string; tone: number }

// Each project contributes its cover (big), gallery shots (small) and phone shot (tall).
function tilesFor(projects: Project[], lang: Lang): Tile[] {
  return projects.flatMap((p, index) => {
    const tone = index % 3
    const href = localePath(lang, `/works/${p.slug}`)
    const tiles: Tile[] = [
      { key: `${p.id}-cover`, href, title: p.title, kind: 'big', src: mediaUrl(p.cover, 'large'), alt: media(p.cover)?.alt ?? p.title, tone },
    ]
    p.gallery?.slice(0, 2).forEach((g, i) => {
      tiles.push({ key: `${p.id}-g${i}`, href, title: p.title, kind: 'small', src: mediaUrl(g.image, 'card'), alt: media(g.image)?.alt ?? p.title, tone })
    })
    if (media(p.mobileShot)) {
      tiles.push({ key: `${p.id}-m`, href, title: p.title, kind: 'tall', src: mediaUrl(p.mobileShot, 'card'), alt: media(p.mobileShot)?.alt ?? p.title, tone })
    }
    return tiles
  })
}

function TileView({ tile, hidden }: { tile: Tile; hidden?: boolean }) {
  return (
    <Link
      aria-hidden={hidden || undefined}
      className={`mq-tile mq-${tile.kind} mq-tone-${tile.tone}${tile.src ? '' : ' mq-empty'}`}
      href={tile.href}
      tabIndex={hidden ? -1 : undefined}
    >
      {tile.src ? (
        <Image alt={hidden ? '' : tile.alt} fill sizes={tile.kind === 'big' ? '520px' : '260px'} src={tile.src} />
      ) : null}
      <span className="mq-title">{tile.title}</span>
    </Link>
  )
}

export function WorksMarquee({ projects, lang }: { projects: Project[]; lang: Lang }) {
  if (!projects.length) return <p className="empty-note">{getDictionary(lang).common.worksEmpty}</p>

  let tiles = tilesFor(projects, lang)
  // A short track would leave a gap on wide screens, so repeat it until it is long enough.
  while (tiles.length < 10) tiles = [...tiles, ...tilesFor(projects, lang).map((t) => ({ ...t, key: `${t.key}-${tiles.length}` }))]
  const seconds = Math.max(30, tiles.length * 5)

  return (
    <div className="marquee" style={{ ['--mq-duration' as string]: `${seconds}s` }}>
      <div className="mq-track">
        <div className="mq-group">
          {tiles.map((t) => (
            <TileView key={t.key} tile={t} />
          ))}
        </div>
        <div aria-hidden className="mq-group">
          {tiles.map((t) => (
            <TileView hidden key={`${t.key}-dup`} tile={t} />
          ))}
        </div>
      </div>
    </div>
  )
}
