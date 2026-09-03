'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { WebsitePage } from '@/lib/pages'
import type { HomepageContent } from '@/lib/homepage'
import { useLanguage } from '../i18n/LanguageProvider'
import { localizeHref } from '@/lib/i18nRouting'
import { Container } from './ui/Container'
import { Eyebrow } from './ui/Eyebrow'
import { Section } from './ui/Section'

export function PageCards({
  pages,
  homepage,
}: {
  pages: WebsitePage[]
  homepage: HomepageContent
}) {
  const { lang } = useLanguage()
  const content = homepage[lang]
  const isLatvian = lang === 'lv'
  const copy = {
    eyebrow: content.exploreEyebrow,
    title: content.exploreTitle,
    intro: content.exploreIntro,
    seeFullInfo: isLatvian ? 'Skatīt pilnu informāciju' : 'See full info',
  }

  return (
    <Section id="about" ariaLabel={copy.title} tone="muted" className="relative overflow-hidden py-24 sm:py-32 bg-slate-50/50">
      <Container className="relative z-10 space-y-12">
        <div className="max-w-3xl flex flex-col items-start">
          <Eyebrow className="text-sunset-red tracking-widest font-bold uppercase mb-4">
            {copy.eyebrow}
          </Eyebrow>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {copy.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-sunset-red to-sunset-gold mt-6 rounded-full" />
          <p className="mt-8 text-pretty text-lg leading-relaxed text-ink-light sm:text-xl max-w-2xl font-medium">
            {copy.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page, index) => {
            const pageContent = page[lang]
            const isLogo = page.slug === 'history'

            return (
              <article
                key={page.slug}
                id={page.slug === 'history' ? 'history' : undefined}
                className="group flex h-full flex-col rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-sm shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:bg-white overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link
                  href={localizeHref(`/${page.slug}`, lang)}
                  className="relative block h-48 sm:h-56 w-full overflow-hidden cursor-pointer bg-white"
                  aria-label={pageContent.title}
                >
                  <Image
                    src={page.meta.image}
                    alt={pageContent.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`transition-transform duration-700 ${
                      isLogo
                        ? 'object-contain p-6 sm:p-8 group-hover:scale-105'
                        : 'object-cover group-hover:scale-110'
                    }`}
                  />
                </Link>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold leading-tight text-ink group-hover:text-sunset-red transition-colors duration-300">
                      <Link href={localizeHref(`/${page.slug}`, lang)}>
                        {pageContent.title}
                      </Link>
                    </h3>
                    <div className="mt-4 w-10 h-0.5 bg-slate-200 group-hover:bg-sunset-gold transition-colors duration-300" />
                    <p className="mt-4 line-clamp-3 text-base leading-relaxed text-ink-light font-medium">
                      {pageContent.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 mt-6">
                    <Link
                      href={localizeHref(`/${page.slug}`, lang)}
                      className="inline-flex items-center gap-1 font-bold text-sunset-red hover:text-latvian-red transition-colors text-sm"
                      aria-label={`${copy.seeFullInfo}: ${pageContent.title}`}
                    >
                      {copy.seeFullInfo} →
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
