'use client'

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

function HeroLayout({ block }: { block: HeroLayoutBlock }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-white sm:py-28">
      {block.image ? (
        <img
          src={block.image}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
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
  const paragraphs = block.body.split(/\n\s*\n/).filter(Boolean)
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
          <div className="space-y-7 text-lg leading-8 text-ink-light sm:text-xl sm:leading-9">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
        {showImage ? (
          <img
            src={block.image}
            alt=""
            className={`aspect-[4/3] w-full rounded-3xl object-cover shadow-xl ${
              block.imagePosition === 'left' ? 'lg:order-1' : ''
            }`}
          />
        ) : null}
      </Container>
    </section>
  )
}

function CallToActionLayout({ block }: { block: CallToActionLayoutBlock }) {
  return (
    <section className="bg-ink py-16 text-white lg:py-20">
      <Container className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="font-serif text-4xl font-bold">{block.heading}</h2>
          {block.text ? (
            <p className="mt-4 text-lg leading-relaxed text-white/75">{block.text}</p>
          ) : null}
        </div>
        {block.buttons?.length ? (
          <div className="flex flex-wrap gap-3">
            {block.buttons.map((button) => (
              <Link
                key={`${button.link}-${button.label}`}
                href={button.link}
                className={
                  button.variant === 'secondary'
                    ? 'rounded-full border border-white/50 px-5 py-3 font-bold text-white hover:bg-white/10'
                    : 'rounded-full bg-sunset-orange px-5 py-3 font-bold text-ink hover:bg-sunset-gold'
                }
              >
                {button.label}
              </Link>
            ))}
          </div>
        ) : null}
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
        if (block.blockType === 'cta') return <CallToActionLayout key={key} block={block} />
        return <ContentLayout key={key} block={block} />
      })}
    </main>
  )
}
