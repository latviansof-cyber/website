'use client'

import Image from 'next/image'
import Link from 'next/link'
import type {
  CallToActionLayoutBlock,
  ContentLayoutBlock,
  HeroLayoutBlock,
  WebsitePage,
} from '@/lib/pages'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'
import { Eyebrow } from './ui/Eyebrow'
import { localizeHref, type Lang } from '@/lib/i18nRouting'

import { FormattedText } from './ui/FormattedText'

function HeroLayout({ block }: { block: HeroLayoutBlock }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-white sm:py-28">
      {block.image ? (
        <Image
          src={block.image}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
          loading="eager"
        />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink/95 via-sunset-red/80 to-sunset-orange/70" />
      <Container className={block.alignment === 'center' ? 'text-center' : ''}>
        <div className={block.alignment === 'center' ? 'mx-auto max-w-4xl' : 'max-w-4xl'}>
          {block.eyebrow ? <Eyebrow tone="amber">{block.eyebrow}</Eyebrow> : null}
          <h1 className="font-serif text-5xl font-bold leading-tight sm:text-7xl">
            {block.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/90">{block.text}</p>
        </div>
      </Container>
    </section>
  )
}

function ContentLayout({ block }: { block: ContentLayoutBlock }) {
  const showImage = block.image && block.imagePosition !== 'none'

  return (
    <section className={block.tone === 'muted' ? 'bg-white/70 py-16 lg:py-24' : 'py-16 lg:py-24'}>
      <Container
        className={
          showImage ? 'grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]' : 'max-w-3xl'
        }
      >
        <article className={block.imagePosition === 'left' ? 'lg:order-2' : ''}>
          {block.heading ? (
            <h2 className="mb-7 font-serif text-4xl font-bold text-ink">{block.heading}</h2>
          ) : null}
          <FormattedText
            text={block.body}
            className="space-y-7 text-lg leading-8 text-ink-light sm:text-xl sm:leading-9"
          />
        </article>
        {showImage ? (
          <Image
            src={block.image}
            alt=""
            width={800}
            height={600}
            unoptimized
            className={`aspect-[4/3] w-full rounded-3xl object-cover shadow-xl ${
              block.imagePosition === 'left' ? 'lg:order-1' : ''
            }`}
            loading="lazy"
          />
        ) : null}
      </Container>
    </section>
  )
}

function CallToActionLayout({ block, lang }: { block: CallToActionLayoutBlock; lang: Lang }) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-cream">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-latvian-red via-sunset-red to-sunset-orange px-8 py-12 sm:px-14 sm:py-16 text-white shadow-2xl">
          {/* Subtle background glow effects */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-sunset-gold/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-sunset-gold/90 mb-2 block">
                {lang === 'lv' ? 'Iesaisties kopienā' : 'Get Involved'}
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl">
                {block.heading}
              </h2>
              {block.text ? (
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/90 font-medium">
                  {block.text}
                </p>
              ) : null}
            </div>
            {block.buttons?.length ? (
              <div className="flex flex-wrap items-center gap-4 shrink-0">
                {block.buttons.map((button) => {
                  const href = localizeHref(button.link, lang)
                  const isExternal = href.startsWith('mailto:') || href.startsWith('http')
                  const className =
                    button.variant === 'secondary'
                      ? 'inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-sm backdrop-blur-xs transition hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-offset-2'
                      : 'inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-latvian-red shadow-lg transition hover:bg-sunset-gold hover:text-ink focus-visible:ring-2 focus-visible:ring-offset-2'

                  return isExternal ? (
                    <a key={`${button.link}-${button.label}`} href={href} className={className}>
                      {button.label}
                    </a>
                  ) : (
                    <Link key={`${button.link}-${button.label}`} href={href} className={className}>
                      {button.label}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

export function ContentPage({ page }: { page: WebsitePage }) {
  const { lang } = useLanguage()

  return (
    <main id="main" className="bg-cream text-ink" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="name" content={page[lang].title} />
      <meta itemProp="description" content={page[lang].excerpt} />
      {page.layout[lang].map((block, index) => {
        const key = `${block.blockType}-${index}`
        if (block.blockType === 'hero') return <HeroLayout key={key} block={block} />
        if (block.blockType === 'cta')
          return <CallToActionLayout key={key} block={block} lang={lang} />
        return <ContentLayout key={key} block={block} />
      })}
    </main>
  )
}
