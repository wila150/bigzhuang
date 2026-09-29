import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { CtaBanner } from '@/components/CtaBanner'
import { Icon, type IconName } from '@/components/Icon'
import { getProcess } from '@/lib/data'

export const metadata: Metadata = { title: '合作流程', description: '從需求訪談到教育訓練與交接，6 個步驟讓你清楚每個階段要做什麼。' }

const stepIcons: IconName[] = ['chat', 'doc', 'palette', 'code', 'rocket', 'handshake']

export default async function ProcessPage() {
  const process = await getProcess()
  return (
    <>
      <PageHero crumbs={[{ label: '合作流程' }]} lead={process.intro} title="合作流程" />
      <section className="section">
        <div className="container">
          <ol className="timeline">
            {(process.steps ?? []).map((s, i) => (
              <li className="timeline-item" key={s.id ?? i}>
                <span className="timeline-icon">
                  <Icon name={stepIcons[i % stepIcons.length]} size={26} />
                </span>
                <div className="timeline-body">
                  <span className="step-num">STEP {String(i + 1).padStart(2, '0')}</span>
                  <h2>{s.title}</h2>
                  {s.description ? <p>{s.description}</p> : null}
                  {s.duration ? <p className="timeline-duration">大約 {s.duration}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBanner />
    </>
  )
}
