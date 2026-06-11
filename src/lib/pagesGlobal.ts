import { getPayloadClient } from './payload'

export type PagesGlobalContent = {
  en: {
    about: string
    history: string
  }
  lv: {
    about: string
    history: string
  }
}

export const fallbackPagesGlobal: PagesGlobalContent = {
  en: {
    about: 'Welcome to the Latvian Association of Darwin.',
    history: 'The history of the Latvian community in Darwin.',
  },
  lv: {
    about: 'Laipni lūdzam Dārvinas Latviešu Apvienībā.',
    history: 'Latviešu kopienas vēsture Dārvinā.',
  },
}

export async function getWebsitePagesContent(): Promise<PagesGlobalContent> {
  try {
    const payload = await getPayloadClient()
    const data = (await payload.findGlobal({
      slug: 'pages',
      depth: 0,
    })) as {
      en: { about?: unknown; history?: unknown }
      lv: { about?: unknown; history?: unknown }
    }

    return {
      en: {
        about: JSON.stringify(data.en.about ?? ''),
        history: JSON.stringify(data.en.history ?? ''),
      },
      lv: {
        about: JSON.stringify(data.lv.about ?? ''),
        history: JSON.stringify(data.lv.history ?? ''),
      },
    }
  } catch (error) {
    console.warn('[pagesGlobal] Payload pages global unavailable; using fallback content.', error)
    return fallbackPagesGlobal
  }
}
