import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'

export const metadata: Metadata = { title: '隱私權政策', robots: { index: false } }

export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ label: '隱私權政策' }]} title="隱私權政策" />
      <section className="section">
        <div className="container prose narrow">
          <p>BigZhaung 大壯做網站（以下稱「本站」）重視你的隱私，以下說明本站如何蒐集與使用你的個人資料。</p>
          <h2>蒐集的資料</h2>
          <p>當你填寫洽詢表單時，本站會蒐集你提供的姓名、Email、電話、LINE ID 與需求說明。</p>
          <h2>使用目的</h2>
          <p>這些資料只用於回覆你的洽詢、提供報價與後續合作聯繫，不會出售或提供給第三方。</p>
          <h2>保存與刪除</h2>
          <p>資料保存在本站後台資料庫。若你希望查詢、更正或刪除自己的資料，請透過聯絡頁的任一管道告知。</p>
          <h2>Cookie</h2>
          <p>本站僅使用網站運作必要的 Cookie，不使用廣告追蹤。</p>
          <h2>政策修訂</h2>
          <p>本政策如有修訂，會直接更新於本頁。</p>
        </div>
      </section>
    </>
  )
}
