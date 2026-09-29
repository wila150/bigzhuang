import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { ContactForm } from '@/components/ContactForm'
import { Icon, LineIcon } from '@/components/Icon'
import { contactDefaults, CONTACT_ROLES, resolveFields } from '@/lib/contact-defaults'
import { getContactPage, getServices, getSettings } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage()
  return { title: page.heroTitle || contactDefaults.heroTitle, description: page.heroLead || contactDefaults.heroLead }
}

export default async function ContactPage() {
  const [settings, services, page] = await Promise.all([getSettings(), getServices(), getContactPage()])
  const t = { ...contactDefaults, ...Object.fromEntries(Object.entries(page).filter(([, v]) => v !== null && v !== '')) }
  const fields = resolveFields(page.fields)
  // The 至少留一種 hint goes under the LINE ID field, or the last contact field if there is none.
  const contactFields = fields.filter((f) => (CONTACT_ROLES as readonly string[]).includes(f.role ?? ''))
  const contactHintFieldId = (contactFields.find((f) => f.role === 'lineId') ?? contactFields.at(-1))?.id

  const channels = [
    settings.lineId && {
      icon: <LineIcon size={26} />,
      label: 'LINE',
      value: settings.lineId,
      href: settings.lineUrl,
      note: t.lineNote,
    },
    settings.email && {
      icon: <Icon name="mail" size={26} />,
      label: 'Email',
      value: settings.email,
      href: `mailto:${settings.email}`,
      note: t.emailNote,
    },
    settings.instagram && {
      icon: <Icon name="instagram" size={26} />,
      label: 'Instagram',
      value: `@${settings.instagram}`,
      href: `https://www.instagram.com/${settings.instagram}/`,
      note: t.instagramNote,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string | null; note: string }[]

  return (
    <>
      <PageHero crumbs={[{ label: t.heroTitle }]} lead={t.heroLead} title={t.heroTitle} />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-channels">
            <h2>{t.channelsTitle}</h2>
            {channels.length ? (
              <ul>
                {channels.map((c) => (
                  <li key={c.label}>
                    <span className="channel-icon">{c.icon}</span>
                    <div>
                      <span className="channel-label">{c.label}</span>
                      {c.href ? (
                        <a href={c.href} rel="noopener noreferrer" target={c.href.startsWith('mailto') ? undefined : '_blank'}>
                          {c.value}
                        </a>
                      ) : (
                        <span>{c.value}</span>
                      )}
                      <span className="channel-note">{c.note}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-note">聯絡帳號設定中，請先使用右側表單。</p>
            )}
            {settings.serviceArea ? (
              <p className="contact-area">
                <Icon name="pin" size={18} /> {settings.serviceArea}
              </p>
            ) : null}
          </div>
          <div className="contact-form-wrap">
            <h2>{t.formTitle}</h2>
            <ContactForm
              contactHintFieldId={t.requireContact ? contactHintFieldId : undefined}
              fields={fields}
              services={services.map((s) => s.title)}
              texts={{ contactHint: t.contactHint, submitLabel: t.submitLabel, successTitle: t.successTitle, successText: t.successText }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
