// Centralized bilingual content map for the DLA website.
// When we move to Payload CMS (DLA-201..206) this file will be replaced
// by data fetched from the `pages` global / `events` collection.

export type Lang = 'en' | 'lv'

export interface EventItem {
  id: string
  title: string
  body: string
}

export interface SiteContent {
  nav: { about: string; history: string; events: string; skipToContent: string }
  hero: { eyebrow: string; title: string; subtitle: string; cta: string }
  about: { title: string; body: string[] }
  history: { title: string; body: string[] }
  events: { title: string; intro: string; items: EventItem[] }
  footer: { tagline: string; contact: string; rights: string; address: string; languageLabel: string }
}

export const en: SiteContent = {
  nav: {
    about: 'About',
    history: 'History',
    events: 'Events',
    skipToContent: 'Skip to content',
  },
  hero: {
    eyebrow: 'Northern Territory, Australia',
    title: 'Latvian Association of Darwin',
    subtitle:
      'Dārvinas Latviešu Apvienība — a welcoming community for Latvians, Latvian descendants, and friends of Latvia in the Top End.',
    cta: 'Discover our events',
  },
  about: {
    title: 'About the Association',
    body: [
      'The Latvian Association of Darwin (Dārvinas Latviešu Apvienība) is a community organisation dedicated to bringing together Latvians, Latvian descendants, and friends of Latvia across the Northern Territory. Formed to support and celebrate Latvian heritage, the Association provides a welcoming space where culture, language, and traditions can be shared, preserved, and enjoyed.',
      'Our community is built on connection — supporting cooperation and unity among Latvians in Darwin, across Australia, and with organisations in Latvia and around the world. Through cultural events, social gatherings, educational activities, and community initiatives, we aim to strengthen our shared identity and foster a sense of belonging for all who value Latvian culture.',
      'The Association also works to promote the ongoing development of Latvian cultural, social, educational, and welfare activities in the Northern Territory. Whether you have Latvian heritage, an interest in Baltic culture, or simply want to connect with a vibrant multicultural community, we welcome you to join us.',
      'Together, we celebrate our history, support each other, and ensure that Latvian culture thrives in Darwin for generations to come.',
    ],
  },
  history: {
    title: 'Our History',
    body: [
      'The Latvian Association of Darwin (Dārvinas Latviešu Apvienība) is one of Australia’s newest Latvian community organisations, officially incorporated on 22 August 2023 to support the growing Latvian community in the Northern Territory.',
      'Although formally established in 2023, the Association builds on many years of informal cultural, social, and commemorative gatherings held by Latvians living in Darwin going back to the 1980s. These community traditions—ranging from celebrations of Latvian national days to cultural events and diaspora commemorations—created a strong foundation for a permanent organisation to represent and unite Latvians across the Top End.',
      'The Association was formed with a clear purpose: to preserve and promote Latvian culture, language, and heritage in Darwin, to support Latvian descendants, and to strengthen connections with Latvian organisations across Australia and internationally.',
      'Today, the Latvian Association of Darwin continues to grow as a vibrant and welcoming community—honouring the past, celebrating the present, and ensuring Latvian culture thrives for future generations in the Northern Territory.',
    ],
  },
  events: {
    title: 'Events',
    intro:
      'Throughout the year we gather to honour Latvian traditions, mark national days, and welcome the seasons. Everyone is warmly invited to join us.',
    items: [
      {
        id: 'lieldienas',
        title: 'Lieldienas – Easter the Latvian Way in Darwin',
        body:
          'At the Latvian Association of Darwin Inc, we celebrate Lieldienas (Easter) — Latvia’s joyful festival of spring and renewal—with a warm Top End twist. Families and friends gather for natural egg‑dyeing, olu ripināšana (egg rolling) olu kaujas (egg‑tapping battles), and shared Latvian treats. We embrace ancient customs to welcome the new season, creating a vibrant celebration that blends Latvian heritage with Darwin’s tropical charm. Everyone is welcome to join us as we greet brighter days together.',
      },
      {
        id: 'may4',
        title:
          '4. maijs - Day of the Restoration of Latvian Independence - Latvijas Republikas Neatkarības atjaunošanas diena',
        body:
          'On 4 May, we proudly mark Latvia’s Restoration of Independence with the Baltā galdautu svētki—the White Tablecloth Celebration. Our community gathers around a table draped in a white cloth, symbolising peace, unity, and honesty. We share Latvian dishes, reflect on our nation’s journey, and celebrate the resilience and spirit that connect Latvians near and far. In Darwin, this day is a heartfelt reminder of freedom, identity, and the strength of our shared heritage.',
      },
      {
        id: 'jani',
        title: 'Jāņi – Midsummer Magic in the Top End',
        body:
          'Each June, we bring Latvia’s beloved Jāņi - St John’s Day/Midsummer night —to life beneath Darwin’s star‑filled skies. Our community sings traditional Līgo songs, weaves wreaths of leaves and flowers, enjoys hearty Latvian food, and gathers around the Līgo fire to honour the sun’s strength and the promise of good fortune. Music, laughter, and the glow of the bonfire make Jāņi in Darwin a uniquely warm and spirited celebration of culture, nature, and togetherness.',
      },
      {
        id: 'baltijas-cels',
        title: 'Baltijas ceļš – Commemorating the Baltic Way',
        body:
          'Every August, we join Latvians, Lithuanians, and Estonians worldwide in honouring the Baltijas ceļš—the Baltic Way. Through reflection, shared stories, and a symbolic human chain, we remember the nearly two million people who stood hand‑in‑hand in 1989 to peacefully demand freedom. Our Darwin commemoration highlights the courage, unity, and hope that shaped our nations’ futures, keeping alive the message that collective strength can inspire profound change.',
      },
      {
        id: 'nov18',
        title:
          '18. novembris – Proclamation Day of the Republic of Latvia – Latvia’s Independence Day',
        body:
          'On 18 November, we celebrate one of Latvia’s most significant national days—the Proclamation of the Independence of the Republic of Latvia. Our Darwin community gathers to honour this historic moment with speeches, songs, and shared Latvian foods. It is a time to reflect on Latvia’s story, celebrate our identity, and strengthen the bonds that connect Latvians across oceans. Everyone is warmly invited to join us in marking this important day with pride and gratitude.',
      },
    ],
  },
  footer: {
    tagline: 'Latvian Association of Darwin — Dārvinas Latviešu Apvienība',
    contact: 'Get in touch',
    rights: 'All rights reserved.',
    address: 'Darwin, Northern Territory, Australia',
    languageLabel: 'Language',
  },
}

export const lv: SiteContent = {
  nav: {
    about: 'Par mums',
    history: 'Vēsture',
    events: 'Pasākumi',
    skipToContent: 'Pāriet uz saturu',
  },
  hero: {
    eyebrow: 'Ziemeļu Teritorija, Austrālija',
    title: 'Dārvinas Latviešu Apvienība',
    subtitle:
      'Latvian Association of Darwin — viesmīlīga kopiena latviešiem, latviešu pēctečiem un Latvijas draugiem Top End reģionā.',
    cta: 'Apskatīt pasākumus',
  },
  about: {
    title: 'Par apvienību',
    body: [
      'Dārvinas Latviešu Apvienība ir kopienas organizācija, kas apvieno latviešus, latviešu pēctečus un Latvijas draugus visā Ziemeļu Teritorijā. Tā dibināta, lai atbalstītu un svinētu latviešu kultūras mantojumu, nodrošinot vietu, kur kopīgi dalīties tradīcijās, valodā un kultūrā.',
      'Mūsu kopiena balstās uz savstarpēju saikni — veicinot sadarbību un vienotību starp latviešiem Dārvinā, visā Austrālijā un ar organizācijām Latvijā un citviet pasaulē. Ar kultūras pasākumu, sabiedrisku tikšanos, izglītojošu aktivitāšu un kopienas iniciatīvu palīdzību mēs stiprinām kopīgo identitāti un piederības sajūtu ikvienam, kurš novērtē latviešu kultūru.',
      'Apvienība arī strādā, lai veicinātu latviešu kultūras, sabiedrisko, izglītības un labklājības aktivitāšu attīstību Ziemeļu Teritorijā. Neatkarīgi no tā, vai jums ir latviešu saknes, interese par Baltijas kultūru vai vēlme pievienoties daudzveidīgai un aktīvai kopienai — mēs jūs sirsnīgi aicinām pievienoties.',
      'Kopā mēs godinām savu vēsturi, atbalstām viens otru un nodrošinām, ka latviešu kultūra Dārvinā dzīvo arī nākotnē.',
    ],
  },
  history: {
    title: 'Mūsu vēsture',
    body: [
      'Dārvinas Latviešu Apvienība (Latvian Association of Darwin Inc) ir viena no jaunākajām Austrālijas latviešu organizācijām. Tā oficiāli reģistrēta 2023. gada 22. augustā, lai atbalstītu augošo latviešu kopienu Ziemeļu Teritorijā.',
      'Lai gan organizācija formāli dibināta 2023. gadā, tā balstās uz daudzu gadu neformālām kultūras, sabiedriskām un piemiņas aktivitātēm, ko latvieši Dārvinā rīkojuši jau kopš 1980. gadiem. Šīs kopienas tradīcijas — sākot no Latvijas valsts svētku atzīmēšanas līdz kultūras pasākumiem un diasporas piemiņas brīžiem — radīja spēcīgu pamatu pastāvīgas organizācijas izveidei, kas pārstāvētu un vienotu latviešus visā Top End reģionā.',
      'Apvienība tika dibināta ar skaidru mērķi: saglabāt un popularizēt latviešu kultūru, valodu un mantojumu Dārvinā, atbalstīt latviešu pēctečus un stiprināt saikni ar latviešu organizācijām visā Austrālijā un pasaulē.',
      'Šodien Dārvinas Latviešu Apvienība turpina augt kā dzīva un viesmīlīga kopiena — godinot pagātni, svinot tagadni un nodrošinot, ka latviešu kultūra Ziemeļu Teritorijā plaukst arī nākamajās paaudzēs.',
    ],
  },
  events: {
    title: 'Pasākumi',
    intro:
      'Gada gaitā mēs pulcējamies, lai godinātu latviešu tradīcijas, atzīmētu valsts svētkus un sagaidītu jaunus gadalaikus. Visi ir sirsnīgi aicināti pievienoties.',
    items: [
      {
        id: 'lieldienas',
        title: 'Lieldienas — latviskās Lieldienas Dārvinā',
        body:
          'Dārvinas Latviešu Apvienībā mēs svinam Lieldienas — priecīgos pavasara un atjaunotnes svētkus — ar siltu Top End piesitienu. Ģimenes un draugi pulcējas dabiskai olu krāsošanai, olu ripināšanai, olu kaujām un latviešu gardumu baudīšanai. Mēs kopjam senās tradīcijas, lai sveiktu jauno sezonu, radot krāsainus svētkus, kas apvieno latviešu mantojumu ar Dārvinas tropisko noskaņu. Visi ir laipni aicināti pievienoties, sagaidot gaišākas dienas kopā.',
      },
      {
        id: 'jani',
        title: 'Jāņi — saulgriežu maģija Top End reģionā',
        body:
          'Katru jūniju mēs atdzīvinām Latvijā tik mīļos Jāņus — Līgo vakaru un Jāņu dienu — zem Dārvinas zvaigžņotajām debesīm. Mūsu kopiena dzied tradicionālās Līgo dziesmas, pin vainagus no lapām un ziediem, bauda latviešu ēdienus un pulcējas ap Līgo uguni, godinot saules spēku un labas veiksmes solījumu. Mūzika, smiekli un ugunskura gaisma padara Jāņus Dārvinā par īpaši siltu un dzīvespriecīgu kultūras, dabas un kopības svinēšanu.',
      },
      {
        id: 'may4',
        title: '4. maijs — Latvijas Republikas Neatkarības atjaunošanas diena',
        body:
          '4. maijā mēs ar lepnumu atzīmējam Latvijas Neatkarības atjaunošanas dienu, svinot Baltā galdauta svētkus. Mūsu kopiena pulcējas ap baltu galdautu, kas simbolizē mieru, vienotību un godīgumu. Mēs dalāmies latviešu ēdienos, pārdomājam mūsu valsts ceļu un svinam izturību un garu, kas vieno latviešus visā pasaulē. Dārvinā šī diena ir sirsnīgs atgādinājums par brīvību, identitāti un kopīgo mantojumu.',
      },
      {
        id: 'baltijas-cels',
        title: 'Baltijas ceļš — Baltijas ceļa piemiņai',
        body:
          'Katru augustu mēs pievienojamies latviešiem, lietuviešiem un igauņiem visā pasaulē, godinot Baltijas ceļu. Ar pārdomām, kopīgiem stāstiem un simbolisku cilvēku ķēdi mēs pieminam gandrīz divus miljonus cilvēku, kuri 1989. gadā stāvēja plecu pie pleca, lai miermīlīgi pieprasītu brīvību. Mūsu piemiņas pasākums Dārvinā izceļ drosmi, vienotību un cerību, kas veidoja mūsu valstu nākotni, un saglabā vēstījumu, ka kopīga rīcība var radīt lielas pārmaiņas.',
      },
      {
        id: 'nov18',
        title: '18. novembris — Latvijas Republikas proklamēšanas diena',
        body:
          '18. novembrī mēs svinam vienu no nozīmīgākajiem Latvijas valsts svētkiem — Latvijas Republikas proklamēšanas dienu. Dārvinā mēs pulcējamies, lai godinātu šo vēsturisko brīdi ar uzrunām, dziesmām un latviešu ēdieniem. Tas ir laiks pārdomām par Latvijas ceļu, identitātes svinēšanai un saiknes stiprināšanai starp latviešiem visā pasaulē. Visi ir sirsnīgi aicināti pievienoties šiem svētkiem ar lepnumu un pateicību.',
      },
    ],
  },
  footer: {
    tagline: 'Dārvinas Latviešu Apvienība — Latvian Association of Darwin',
    contact: 'Sazināties ar mums',
    rights: 'Visas tiesības aizsargātas.',
    address: 'Dārvina, Ziemeļu Teritorija, Austrālija',
    languageLabel: 'Valoda',
  },
}

export const contentByLang: Record<Lang, SiteContent> = { en, lv }
