import type { Metadata } from 'next'

import { PageHero } from '@/components/Breadcrumbs'
import { ContactForm } from '@/components/ContactForm'
import { Icon, LineIcon } from '@/components/Icon'
import { getDictionary } from '@/i18n/dictionaries'
import { alternates, pageLang, type LangParams } from '@/i18n/page'
import { contactDefaults, CONTACT_ROLES, resolveFields } from '@/lib/contact-defaults'
import { getContactPage, getServices, getSettings } from '@/lib/data'

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const lang = await pageLang(params)
  const page = await getContactPage(lang)
  return {
    title: page.heroTitle || contactDefaults.heroTitle,
    description: page.heroLead || contactDefaults.heroLead,
    alternates: alternates(lang, '/contact'),
  }
}

export default async function ContactPage({ params }: LangParams) {
  const lang = await pageLang(params)
  const dict = getDictionary(lang).contact
  const [settings, services, page] = await Promise.all([getSettings(lang), getServices(lang), getContactPage(lang)])
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
      <PageHero crumbs={[{ label: t.heroTitle }]} lang={lang} lead={t.heroLead} title={t.heroTitle} />
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
              <p className="empty-note">{dict.channelsEmpty}</p>
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
              lang={lang}
              services={services.map((s) => s.title)}
              texts={{
                contactHint: t.contactHint,
                submitLabel: t.submitLabel,
                successTitle: t.successTitle,
                successText: t.successText,
                sending: dict.sending,
                selectPlaceholder: dict.selectPlaceholder,
              }}
            />
          </div>
        </div>
      </section>
    </>
  )
}
