'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from './ui/Container'

type Supporter = {
  url: string
  alt: string
  link: string
  enHelpText: string
  lvHelpText: string
}

const SUPPORTERS: Supporter[] = [
  {
    url: '/images/supporters/australian-government.webp',
    alt: 'Australian Government',
    link: 'https://my.gov.au/',
    enHelpText: 'Access federal services, visa information, Medicare, Centrelink, and national support resources.',
    lvHelpText: 'Piekļūstiet federālajiem pakalpojumiem, vīzu informācijai, Medicare un valsts atbalsta resursiem.',
  },
  {
    url: '/images/supporters/NT-goverment.webp',
    alt: 'NT Government',
    link: 'https://nt.gov.au/',
    enHelpText: 'Northern Territory government services including housing, health information, and community programs.',
    lvHelpText: 'Ziemeļu Teritorijas pakalpojumi, tostarp mājokļi, veselības aprūpe un vietējās kopienas programmas.',
  },
  {
    url: '/images/supporters/australain-red-cross.webp',
    alt: 'Australian Red Cross',
    link: 'https://www.redcross.org.au/places/offices/darwin/',
    enHelpText: 'Emergency relief, humanitarian assistance, and practical help for individuals and families.',
    lvHelpText: 'Ārkārtas atbalsts, humānā palīdzība un praktisks atbalsts ģimenēm un indivīdiem.',
  },
  {
    url: '/images/supporters/melaluka.webp',
    alt: 'Melaleuca Australia',
    link: 'https://melaleuca.org.au/',
    enHelpText: 'Settlement support, casework, referrals, and guidance for building a stable life in the NT.',
    lvHelpText: 'Apmetnes atbalsts, sociālais darbs un norādes stabilas dzīves veidošanai Ziemeļu Teritorijā.',
  },
  {
    url: '/images/supporters/uaant-logo.svg',
    alt: 'UAANT (Ukrainian Association of NT)',
    link: 'https://uaant.org.au/',
    enHelpText: 'Partner multicultural association in Darwin collaborating on joint community events and initiatives.',
    lvHelpText: 'Sadarbības partneru asociācija Dārvinā, kas kopīgi rīko kopienas pasākumus un iniciatīvas.',
  },
]

function TrustedPartnerCard({ supporter, lang }: { supporter: Supporter; lang: 'en' | 'lv' }) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipId = useId()
  const helpText = lang === 'lv' ? supporter.lvHelpText : supporter.enHelpText

  return (
    <div className="group relative flex flex-col items-center rounded-2xl border border-ink/10 bg-white p-3.5 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sunset-gold hover:shadow-lg">
      <a
        href={supporter.link}
        aria-describedby={tooltipId}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-[16/10] w-full items-center justify-center p-1 sm:p-2 focus-visible:outline-2 focus-visible:outline-sunset-orange"
      >
        <Image
          src={supporter.url}
          alt={`${supporter.alt} logo`}
          width={280}
          height={140}
          className="h-full max-h-24 sm:max-h-28 w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-105"
        />
      </a>

      {/* Info Icon Button */}
      <button
        type="button"
        aria-label={`How ${supporter.alt} can help`}
        aria-controls={tooltipId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-ink/5 text-xs font-bold text-ink/70 transition-all hover:bg-sunset-gold hover:text-ink focus:outline-none"
      >
        i
      </button>

      {/* Tooltip */}
      <div
        id={tooltipId}
        role="tooltip"
        className={`absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-xl bg-ink p-3 text-xs leading-relaxed text-white shadow-xl transition-all duration-200 ${
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible translate-y-2 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100'
        }`}
      >
        <div className="font-semibold text-sunset-gold mb-1">{supporter.alt}</div>
        {helpText}
        <div className="absolute top-full left-1/2 -ml-1.5 border-4 border-transparent border-t-ink" />
      </div>
    </div>
  )
}

export function TrustedPartners() {
  const { lang } = useLanguage()

  return (
    <section id="trusted-partners" className="py-16 bg-cream border-t border-ink/10">
      <Container>
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sunset-orange">
              {lang === 'lv' ? 'Sadarbība & Kopiena' : 'Collaboration & Community'}
            </span>
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-ink mt-1">
              {lang === 'lv' ? 'Uzticamie partneri' : 'Trusted Partners'}
            </h2>
          </div>
          <p className="max-w-md text-sm text-ink/70 leading-relaxed">
            {lang === 'lv'
              ? 'Mēs sadarbojamies ar vietējām un nacionālajām organizācijām, lai sniegtu praktisku atbalstu mūsu kopienai.'
              : 'We collaborate with local and national organizations to deliver practical support for our community.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 md:gap-6">
          {SUPPORTERS.map((supporter) => (
            <TrustedPartnerCard key={supporter.alt} supporter={supporter} lang={lang} />
          ))}
        </div>
      </Container>
    </section>
  )
}
