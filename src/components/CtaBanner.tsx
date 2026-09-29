import Link from 'next/link'

import { ctaDefaults } from '@/lib/contact-defaults'
import { getSettings } from '@/lib/data'

// Orange banner at the bottom of each page. Text comes from 網站設定 → 底部聯絡橫幅; the home page can pass its own.
export async function CtaBanner({ title, text }: { title?: string | null; text?: string | null }) {
  const s = await getSettings()
  return (
    <section className="cta-banner">
      <div className="container cta-inner">
        <div>
          <h2>{title || s.ctaTitle || ctaDefaults.ctaTitle}</h2>
          <p>{text || s.ctaText || ctaDefaults.ctaText}</p>
        </div>
        <Link className="btn btn-light" href="/contact">
          {s.ctaButton || ctaDefaults.ctaButton}
        </Link>
      </div>
    </section>
  )
}
