'use client'

import Link from 'next/link'
import type { WebsitePage } from '@/lib/pages'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Eyebrow } from './ui/Eyebrow'
import { Section } from './ui/Section'

export function PageCards({ pages }: { pages: WebsitePage[] }) {
  const { lang } = useLanguage()
  const copy =
    lang === 'lv'
      ? {
          eyebrow: 'Iepazīstiet mūs',
          title: 'Apvienība un kopiena',
          intro: 'Īss ievads svarīgākajās tēmās. Atveriet pilno lapu, lai uzzinātu vairāk.',
          readMore: 'Lasīt vairāk',
        }
      : {
          eyebrow: 'Explore',
          title: 'Association and community',
          intro: 'Start with a short overview, then open the full page when you want the detail.',
          readMore: 'Read more',
        }

  return (
    <Section id="about" ariaLabel={copy.title} tone="muted" className="relative overflow-hidden">
      <Container className="relative z-10">
        <div className="max-w-3xl">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-light">{copy.intro}</p>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {pages.map((page) => {
            const content = page[lang]
            const isLogo = page.slug === 'history'

            return (
              <article
                key={page.slug}
                id={page.slug === 'history' ? 'history' : undefined}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`aspect-[16/10] overflow-hidden ${
                    isLogo ? 'bg-cream p-6 sm:p-8' : 'bg-slate-100'
                  }`}
                >
                  <img
                    src={page.meta.image}
                    alt=""
                    className={`h-full w-full transition duration-500 ${
                      isLogo
                        ? 'object-contain group-hover:scale-[1.02]'
                        : 'object-cover group-hover:scale-105'
                    }`}
                  />
                </div>
                <div className="p-7 sm:p-8">
                  <h3 className="font-serif text-2xl font-bold text-ink">{content.title}</h3>
                  <p className="mt-4 leading-7 text-ink-light">{content.excerpt}</p>
                  <Link
                    href={`/${page.slug}`}
                    className="mt-6 inline-flex items-center gap-2 font-bold text-sunset-red transition hover:text-sunset-orange"
                  >
                    {copy.readMore}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
