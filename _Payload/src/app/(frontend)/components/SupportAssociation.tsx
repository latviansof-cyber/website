'use client'

import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { localizeHref } from '@/lib/i18nRouting'
import type { SiteSettingsContent } from '@/lib/siteSettings'

const QUICK_AMOUNTS = [25, 50, 100]

export function SupportAssociation({
  contained = true,
  siteSettings,
}: {
  contained?: boolean
  siteSettings?: SiteSettingsContent
}) {
  const { lang } = useLanguage()
  const donateLink = localizeHref('/donate', lang)
  const isLv = lang === 'lv'
  const payIdEmail = siteSettings?.en.contactEmail ?? 'hello@latviansofdarwin.org.au'

  const card = (
    <div className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-8 sm:p-12 text-center shadow-xl transition-all duration-300 hover:shadow-2xl">
      {/* Decorative top accent line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-latvian-red via-sunset-gold to-latvian-red" />
      
      <div className="mx-auto max-w-3xl">
        <span className="inline-block mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sunset-orange">
          {isLv ? 'Atbalstīt DLA' : 'Support DLA'}
        </span>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl text-ink tracking-tight">
          {isLv ? 'Palīdziet mūsu misijai plaukt' : 'Help Our Mission Thrive'}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/75">
          {isLv
            ? 'Ikkatrs ziedojums — neatkarīgi no apjoma — palīdz mums atbalstīt ģimenes, saglabāt latviešu kultūras mantojumu un uzturēt kopienas tradīcijas dzīvas Ziemeļu Teritorijā.'
            : 'Every contribution — no matter the size — helps us welcome newcomers, support families, preserve Latvian heritage, and keep our community traditions alive in the Northern Territory.'}
        </p>
      </div>

      {/* Reassurance strip */}
      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-ink/70">
        <span className="flex items-center gap-1">
          <span className="text-emerald-custom font-bold">✓</span> {isLv ? 'Bez komisijas caur PayID' : 'Zero fees via PayID'}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-emerald-custom font-bold">✓</span> {isLv ? 'Kvīts pēc pieprasījuma' : 'Tax receipt available'}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-emerald-custom font-bold">✓</span> {isLv ? 'Tieši kopienas vajadzībām' : 'Direct to community'}
        </span>
      </div>

      {/* Quick-donate amount tiles */}
      <ul
        className="mt-6 flex flex-wrap justify-center gap-3"
        aria-label={isLv ? 'Švidkais ziedojuma apjoma vyrob' : 'Quick donation amounts'}
      >
        {QUICK_AMOUNTS.map((amount) => (
          <li key={amount}>
            <Link
              href={donateLink}
              className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-cream px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:border-sunset-gold hover:bg-sunset-gold hover:text-ink hover:scale-105 active:scale-95"
              aria-label={isLv ? `Ziedot AU$${amount}` : `Donate AU$${amount}`}
            >
              AU${amount}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={donateLink}
            className="inline-flex items-center justify-center rounded-full bg-sunset-gold px-5 py-2.5 text-sm font-bold text-ink shadow-md transition-all duration-200 hover:bg-amber-300 hover:scale-105 active:scale-95"
            aria-label={isLv ? 'Ziedot AU$500 vai vairāk' : 'Donate AU$500 or more'}
          >
            AU$500+
          </Link>
        </li>
      </ul>

      {/* PayID quick reference */}
      <p className="mt-6 text-sm text-ink/70">
        {isLv ? 'Tiešais pārskaitījums caur PayID:' : 'Direct bank transfer via PayID:'}{' '}
        <strong className="font-semibold text-sunset-orange">{payIdEmail}</strong>{' '}
        · {isLv ? 'bez komisijas maksas' : 'zero fees'}
      </p>

      <div className="mt-6">
        <Link
          href={donateLink}
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-6 py-2.5 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:border-sunset-gold hover:bg-sunset-gold/10"
        >
          {isLv ? 'Visas ziedošanas iespējas →' : 'All donation options →'}
        </Link>
      </div>
    </div>
  )

  return (
    <section className="py-12 bg-cream border-t border-ink/10" id="donate-mission">
      {contained ? <Container>{card}</Container> : card}
    </section>
  )
}
