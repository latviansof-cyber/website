import { cache } from 'react'
import type { Homepage as PayloadHomepage } from '@/payload-types'
import { mediaURL } from '@/lib/media'
import { contentByLang } from '@/app/(frontend)/i18n/content'
import { getPayloadClient } from './payload'

export type HomepageContent = {
  heroImage?: string
  heroPrimaryHref: string
  heroSecondaryHref: string
  en: {
    heroEyebrow: string
    heroTitle: string
    heroSubtitle: string
    heroPrimaryLabel: string
    heroSecondaryLabel: string
    eventsTitle: string
    eventsIntro: string
    exploreEyebrow: string
    exploreTitle: string
    exploreIntro: string
  }
  lv: {
    heroEyebrow: string
    heroTitle: string
    heroSubtitle: string
    heroPrimaryLabel: string
    heroSecondaryLabel: string
    eventsTitle: string
    eventsIntro: string
    exploreEyebrow: string
    exploreTitle: string
    exploreIntro: string
  }
}

export const fallbackHomepage: HomepageContent = {
  heroPrimaryHref: '#events',
  heroSecondaryHref: '/about',
  en: {
    heroEyebrow: contentByLang.en.hero.eyebrow,
    heroTitle: contentByLang.en.hero.title,
    heroSubtitle: contentByLang.en.hero.subtitle,
    heroPrimaryLabel: contentByLang.en.hero.cta,
    heroSecondaryLabel: contentByLang.en.nav.about,
    eventsTitle: contentByLang.en.events.title,
    eventsIntro: contentByLang.en.events.intro,
    exploreEyebrow: 'Explore',
    exploreTitle: 'Association and community',
    exploreIntro: 'Start with a short overview, then open the full page when you want the detail.',
  },
  lv: {
    heroEyebrow: contentByLang.lv.hero.eyebrow,
    heroTitle: contentByLang.lv.hero.title,
    heroSubtitle: contentByLang.lv.hero.subtitle,
    heroPrimaryLabel: contentByLang.lv.hero.cta,
    heroSecondaryLabel: contentByLang.lv.nav.about,
    eventsTitle: contentByLang.lv.events.title,
    eventsIntro: contentByLang.lv.events.intro,
    exploreEyebrow: 'Iepazīstiet mūs',
    exploreTitle: 'Apvienība un kopiena',
    exploreIntro: 'Īss ievads svarīgākajās tēmās. Atveriet pilno lapu, lai uzzinātu vairāk.',
  },
}


export const getHomepage = cache(async (): Promise<HomepageContent> => {
  try {
    const payload = await getPayloadClient()
    const homepage = await payload.findGlobal({
      slug: 'homepage',
      depth: 1,
    })

    return {
      heroImage: mediaURL(homepage.heroImage),
      heroPrimaryHref: homepage.heroPrimaryHref,
      heroSecondaryHref: homepage.heroSecondaryHref,
      en: homepage.en,
      lv: homepage.lv,
    }
  } catch (error) {
    console.warn('[homepage] Payload homepage unavailable; using fallback content.', error)
    return fallbackHomepage
  }
})
