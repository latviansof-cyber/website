import { cache } from 'react'
import type { Page as PayloadPage } from '@/payload-types'
import { mediaURL } from '@/lib/media'
import { getPayloadClient } from './payload'

export type PageLanguage = {
  title: string
  excerpt: string
}

export type PageButton = {
  label: string
  link: string
  variant?: 'primary' | 'secondary' | null
}

export type HeroLayoutBlock = {
  blockType: 'hero'
  eyebrow?: string | null
  heading: string
  text: string
  image?: string
  alignment?: 'left' | 'center' | null
}

export type ContentLayoutBlock = {
  blockType: 'content'
  heading?: string | null
  body: string
  image?: string
  imagePosition?: 'left' | 'right' | 'none' | null
  tone?: 'plain' | 'muted' | null
}

export type CallToActionLayoutBlock = {
  blockType: 'cta'
  heading: string
  text?: string | null
  buttons?: PageButton[]
}

export type PageLayoutBlock = HeroLayoutBlock | ContentLayoutBlock | CallToActionLayoutBlock

export type WebsitePage = {
  slug: string
  order: number
  en: PageLanguage
  lv: PageLanguage
  layout: {
    en: PageLayoutBlock[]
    lv: PageLayoutBlock[]
  }
  meta: {
    title?: string | null
    description?: string | null
    image: string
    noIndex?: boolean | null
  }
}

type StarterPage = {
  slug: string
  order: number
  image: string
  en: PageLanguage & { body: string }
  lv: PageLanguage & { body: string }
  cta?: {
    en: Omit<CallToActionLayoutBlock, 'blockType'>
    lv: Omit<CallToActionLayoutBlock, 'blockType'>
  }
}

function starterPage(page: StarterPage): WebsitePage {
  const buildLayout = (language: 'en' | 'lv', eyebrow: string): PageLayoutBlock[] => {
    const content = page[language]
    const layout: PageLayoutBlock[] = [
      {
        blockType: 'hero',
        eyebrow,
        heading: content.title,
        text: content.excerpt,
        image: page.image,
        alignment: 'left',
      },
      {
        blockType: 'content',
        body: content.body,
        image: page.image,
        imagePosition: 'right',
        tone: 'plain',
      },
    ]

    if (page.cta) {
      layout.push({
        blockType: 'cta',
        ...page.cta[language],
      })
    }

    return layout
  }

  return {
    slug: page.slug,
    order: page.order,
    en: { title: page.en.title, excerpt: page.en.excerpt },
    lv: { title: page.lv.title, excerpt: page.lv.excerpt },
    layout: {
      en: buildLayout('en', 'Latvian Association of Darwin'),
      lv: buildLayout('lv', 'Dārvinas Latviešu Apvienība'),
    },
    meta: {
      image: page.image,
    },
  }
}

export const fallbackPages: WebsitePage[] = [
  starterPage({
    slug: 'history',
    order: 20,
    image: '/images/gathering2.jpg',
    en: {
      title: 'Our History',
      excerpt:
        'From informal gatherings in the 1980s to an incorporated association serving the Top End today.',
      body: "The Latvian Association of Darwin (Latvian Association of Darwin Incorporated) is one of Australia's newest Latvian community organisations. It was officially incorporated on 22 October 2023 (ABN 25 545 712 911) to support the growing Latvian community in the Northern Territory.\n\nThe Association builds on informal cultural, social, and commemorative gatherings held by Latvians in Darwin since the 1980s. National day celebrations, cultural events, and diaspora commemorations created the foundation for a permanent organisation.\n\nToday the Association honours that history while building a welcoming, active community for future generations.",
    },
    lv: {
      title: 'Mūsu vēsture',
      excerpt:
        'No neformālām tikšanās reizēm 20. gadsimta astoņdesmitajos gados līdz reģistrētai Top End kopienas organizācijai.',
      body: 'Dārvinas Latviešu Apvienība ir viena no Austrālijas jaunākajām latviešu kopienas organizācijām. Tā tika oficiāli reģistrēta 2023. gada 22. oktobrī (ABN 25 545 712 911), lai atbalstītu augošo latviešu kopienu Ziemeļu Teritorijā.\n\nApvienība turpina neformālo kultūras, sabiedrisko un piemiņas pasākumu tradīciju, ko Dārvinā dzīvojošie latvieši veidojuši kopš 20. gadsimta astoņdesmitajiem gadiem. Valsts svētki, kultūras sarīkojumi un diasporas piemiņas dienas radīja pamatu pastāvīgai organizācijai.\n\nŠodien Apvienība godina šo vēsturi un vienlaikus veido aktīvu, atvērtu kopienu nākamajām paaudzēm.',
    },
  }),
  starterPage({
    slug: 'community',
    order: 30,
    image: '/images/img1.webp',
    en: {
      title: 'Our Community',
      excerpt:
        'Discover the gatherings, cultural connections, and practical support that bring our Top End community together.',
      body: 'Our community includes recent arrivals, long-established families, Latvian descendants, and friends who share an interest in Latvia and Baltic culture.\n\nWe create opportunities to meet through seasonal celebrations, national commemorations, shared meals, family activities, and informal social gatherings. These occasions help newcomers form connections and give established members a place to maintain language and traditions.\n\nThe Association also connects members with Latvian organisations elsewhere in Australia and supports community-led ideas that keep our culture visible in the Northern Territory.',
    },
    lv: {
      title: 'Mūsu kopiena',
      excerpt:
        'Uzziniet par tikšanās reizēm, kultūras saitēm un praktisko atbalstu, kas vieno mūsu Top End kopienu.',
      body: 'Mūsu kopienā ir gan nesen ieradušies, gan sen dzīvojošas ģimenes, latviešu pēcnācēji un draugi, kurus interesē Latvija un Baltijas kultūra.\n\nMēs tiekamies gadskārtu svētkos, valsts piemiņas dienās, kopīgās maltītēs, ģimeņu pasākumos un neformālās tikšanās reizēs. Šie brīži palīdz jaunpienācējiem veidot kontaktus un dod iespēju saglabāt valodu un tradīcijas.\n\nApvienība veido saites arī ar latviešu organizācijām citviet Austrālijā un atbalsta kopienas idejas, kas dara mūsu kultūru redzamu Ziemeļu Teritorijā.',
    },
  }),
  starterPage({
    slug: 'membership',
    order: 40,
    image: '/images/membership-welcome.webp',
    en: {
      title: 'Join the Association',
      excerpt:
        'Become part of the Association, contribute your ideas, and help Latvian culture thrive in Darwin.',
      body: 'Membership is open to people who support the aims of the Latvian Association of Darwin. Latvian heritage is welcome but not required.\n\nMembers can take part in planning activities, contribute ideas, volunteer at events, and help shape the Association as it grows. You can also begin by attending an event and meeting the community before deciding to join.',
    },
    lv: {
      title: 'Pievienojieties apvienībai',
      excerpt:
        'Kļūstiet par Apvienības daļu, dalieties idejās un palīdziet latviešu kultūrai Dārvinā attīstīties.',
      body: 'Par biedru var kļūt ikviens, kurš atbalsta Dārvinas Latviešu Apvienības mērķus. Latviska izcelsme ir gaidīta, bet nav obligāta.\n\nBiedri var piedalīties aktivitāšu plānošanā, ierosināt idejas, palīdzēt pasākumos un veidot Apvienības nākotni. Pirms iestāšanās varat arī apmeklēt kādu pasākumu un iepazīt kopienu.',
    },
    cta: {
      en: {
        heading: 'Ready to get involved?',
        text: 'Ask about membership, volunteering, or how you can contribute to the Latvian community in Darwin.',
        buttons: [
          {
            label: 'Email the Association',
            link: 'mailto:hello@latviansofdarwin.org.au',
            variant: 'primary',
          },
          { label: 'Support our community', link: '/donate', variant: 'secondary' },
        ],
      },
      lv: {
        heading: 'Vai vēlaties iesaistīties?',
        text: 'Jautājiet par dalību, brīvprātīgo darbu vai kā varat atbalstīt latviešu kopienu Dārvinā.',
        buttons: [
          {
            label: 'Rakstīt apvienībai',
            link: 'mailto:hello@latviansofdarwin.org.au',
            variant: 'primary',
          },
          { label: 'Ziedot kopienai', link: '/donate', variant: 'secondary' },
        ],
      },
    },
  }),
  starterPage({
    slug: 'culture',
    order: 50,
    image: '/images/culture.png',
    en: {
      title: 'Culture & Traditions',
      excerpt:
        'Explore the vibrant Latvian heritage, from song and dance festivals to seasonal celebrations kept alive in Darwin.',
      body: 'Latvian culture is deeply rooted in history, nature, and community. In Darwin, we actively preserve and celebrate our unique traditions, keeping them alive for future generations and sharing them with the wider Australian community.\n\nFrom the traditional summer solstice celebration of Jāņi with its flower crowns, songs, and bonfires, to celebrating national holidays, we cherish our rich heritage. We also maintain connections with the broader Latvian diaspora in Australia, participating in regional song festivals, cultural events, and youth gatherings.\n\nTraditional crafts, folk dancing, and singing are at the heart of our community life, offering a bridge between Latvia and our home in the Northern Territory.',
    },
    lv: {
      title: 'Kultūra un tradīcijas',
      excerpt:
        'Iepazīstiet dzīvīgo latviešu mantojumu, no dziesmu un deju svētkiem līdz gadskārtu svinībām Dārvinā.',
      body: 'Latviešu kultūra ir cieši saistīta ar vēsturi, dabu un kopienu. Dārvinā mēs aktīvi saglabājam un kopjam savas unikālās tradīcijas, nododot tās nākamajām paaudzēm un daloties tajās ar plašāku Austrālijas sabiedrību.\n\nNo tradicionālajām vasaras saulgriežu svinībām – Jāņiem ar vainagu pīšanu, dziesmām un ugunskuriem, līdz valsts svētku atzīmēšanai – mēs godinām mūsu bagāto mantojumu. Mēs arī uzturam saites ar plašāku latviešu diasporu Austrālijā, piedaloties reģionālos dziesmu svētkos, kultūras pasākumos un jauniešu salidojumos.\n\nTradicionālie amatniecības izstrādājumi, tautas dejas un dziedāšana ir mūsu kopienas dzīves centrā, nodrošinot tiltu starp Latviju un mūsu mājām Ziemeļu Teritorijā.',
    },
  }),
]


export const getWebsitePage = cache(async (slug: string): Promise<WebsitePage | undefined> => {
  const pages = await getWebsitePages()
  return pages.find((page) => page.slug === slug)
})

function cleanExcerpt(rawExcerpt: string | undefined | null, rawBody: string | undefined | null): string {
  const text = (rawExcerpt || rawBody || '').replace(/<[^>]*>/g, '').trim()
  if (!text) return ''
  if (text.length <= 250) return text
  const firstParagraph = text.split(/\n+/)[0].trim()
  if (firstParagraph.length <= 250) return firstParagraph
  return firstParagraph.slice(0, 220).trim() + '...'
}

function mapLayout(
  layout: PayloadPage['layout'],
  language: 'en' | 'lv',
  fallbackLayout: PageLayoutBlock[] = [],
): PageLayoutBlock[] {
  if (!Array.isArray(layout)) return fallbackLayout
  return layout.map((block, index) => {
    const fallbackBlock = fallbackLayout[index]

    if (block.blockType === 'hero') {
      const content = block[language]
      return {
        blockType: 'hero',
        eyebrow: content.eyebrow,
        heading: content.heading,
        text: content.text,
        image:
          mediaURL(block.image) ||
          (fallbackBlock?.blockType === 'hero' ? fallbackBlock.image : undefined),
        alignment: block.alignment,
      }
    }

    if (block.blockType === 'cta') {
      const content = block[language]
      return {
        blockType: 'cta',
        heading: content.heading,
        text: content.text,
        buttons: content.buttons,
      }
    }

    const content = block[language]
    return {
      blockType: 'content',
      heading: content.heading,
      body: content.body,
      image:
        mediaURL(block.image) ||
        (fallbackBlock?.blockType === 'content' ? fallbackBlock.image : undefined),
      imagePosition: block.imagePosition,
      tone: block.tone,
    }
  })
}

function resolvePageLayout(
  page: any,
  language: 'en' | 'lv',
  fallbackLayout: PageLayoutBlock[] = [],
): PageLayoutBlock[] {
  if (Array.isArray(page.layout) && page.layout.length > 0) {
    return mapLayout(page.layout, language, fallbackLayout)
  }

  const langObj = page[language] || {}
  const title = langObj.title || page.adminTitle || ''
  const bodyText = langObj.body || langObj.excerpt || ''
  const excerptText = cleanExcerpt(langObj.excerpt, langObj.body)

  if (bodyText) {
    const layout: PageLayoutBlock[] = [
      {
        blockType: 'hero',
        eyebrow: language === 'lv' ? 'Dārvinas Latviešu Apvienība' : 'Latvian Association of Darwin',
        heading: title,
        text: excerptText,
        alignment: 'left',
      },
      {
        blockType: 'content',
        body: bodyText,
        imagePosition: 'none',
        tone: 'plain',
      },
    ]
    return layout
  }

  return fallbackLayout
}

export const getWebsitePages = cache(async (): Promise<WebsitePage[]> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      depth: 1,
      limit: 100,
      pagination: false,
      sort: 'order',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    if (result.docs.length === 0) return fallbackPages

    return result.docs.map((page: any) => {
      const fallback = fallbackPages.find((item) => item.slug === page.slug)
      return {
        slug: page.slug,
        order: page.order,
        en: {
          title: page.en?.title || fallback?.en.title || '',
          excerpt: cleanExcerpt(page.en?.excerpt, page.en?.body) || fallback?.en.excerpt || '',
        },
        lv: {
          title: page.lv?.title || fallback?.lv.title || '',
          excerpt: cleanExcerpt(page.lv?.excerpt, page.lv?.body) || fallback?.lv.excerpt || '',
        },
        layout: {
          en: resolvePageLayout(page, 'en', fallback?.layout.en),
          lv: resolvePageLayout(page, 'lv', fallback?.layout.lv),
        },
        meta: {
          title: page.meta?.title,
          description: page.meta?.description,
          image: mediaURL(page.meta?.image) ?? fallback?.meta.image ?? '/images/gathering1.jpg',
          noIndex: page.meta?.noIndex,
        },
      }
    })
  } catch (error) {
    console.warn('[pages] Payload pages unavailable; using fallback content.', error)
    return fallbackPages
  }
})


