import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="container">
        <p className="eyebrow">404</p>
        <h1>找不到這個頁面</h1>
        <p>網址可能打錯了，或這個頁面已經移除。</p>
        <Link className="btn btn-primary" href="/">
          回首頁
        </Link>
      </div>
    </section>
  )
}
