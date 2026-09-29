import Link from 'next/link'

export function CtaBanner({ title, text }: { title?: string | null; text?: string | null }) {
  return (
    <section className="cta-banner">
      <div className="container cta-inner">
        <div>
          <h2>{title || '有想做的網站了嗎？'}</h2>
          <p>{text || '告訴我你的想法，一個工作天內回覆，先聊聊不收費。'}</p>
        </div>
        <Link className="btn btn-light" href="/contact">
          聯絡我們
        </Link>
      </div>
    </section>
  )
}
