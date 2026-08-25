// Centralized bilingual content map for the DLA website.
// Validated against `src/lib/validation.ts` at module load so that any shape
// regression fails fast. When the Payload CMS lands (DLA-201..206) the same
// schemas will be reused to validate API responses.

import { SiteContentSchema, type SiteContentValidated, LangSchema } from '@/lib/validation'
import type { z } from 'zod'

export type Lang = z.infer<typeof LangSchema>

export type EventItem = SiteContentValidated['events']['items'][number]
export type SiteContent = SiteContentValidated

const en: SiteContent = {
  nav: {
    about: 'About',
    history: 'History',
    events: 'Events',
    skipToContent: 'Skip to content',
    donate: 'Donate',
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
      `The Latvian Association of Darwin (Dārvinas Latviešu Apvienība) is one of Australia's newest Latvian community organisations, officially incorporated on 22 October 2023 (ABN 25 545 712 911) to support the growing Latvian community in the Northern Territory.`,
      `Although formally established in 2023, the Association builds on many years of informal cultural, social, and commemorative gatherings held by Latvians living in Darwin going back to the 1980s. These community traditions—ranging from celebrations of Latvian national days to cultural events and diaspora commemorations—created a strong foundation for a permanent organisation to represent and unite Latvians across the Top End.`,
      `The Association was formed with a clear purpose: to preserve and promote Latvian culture, language, and heritage in Darwin, to support Latvian descendants, and to strengthen connections with Latvian organisations across Australia and internationally.`,
      `Today, the Latvian Association of Darwin continues to grow as a vibrant and welcoming community—honouring the past, celebrating the present, and ensuring Latvian culture thrives for future generations in the Northern Territory.`,
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
          `At the Latvian Association of Darwin Inc, we celebrate Lieldienas (Easter) — Latvia's joyful festival of spring and renewal—with a warm Top End twist. Families and friends gather for natural egg-dyeing, olu ripināšana (egg rolling) olu kaujas (egg-tapping battles), and shared Latvian treats. We embrace ancient customs to welcome the new season, creating a vibrant celebration that blends Latvian heritage with Darwin's tropical charm. Everyone is welcome to join us as we greet brighter days together.`,
      },
      {
        id: 'may4',
        title:
          '4. maijs - Day of the Restoration of Latvian Independence - Latvijas Republikas Neatkarības atjaunošanas diena',
        body:
          `On 4 May, we proudly mark Latvia's Restoration of Independence with the Baltā galdautu svētki—the White Tablecloth Celebration. Our community gathers around a table draped in a white cloth, symbolising peace, unity, and honesty. We share Latvian dishes, reflect on our nation's journey, and celebrate the resilience and spirit that connect Latvians near and far. In Darwin, this day is a heartfelt reminder of freedom, identity, and the strength of our shared heritage.`,
      },
      {
        id: 'jani',
        title: 'Jāņi – Midsummer Magic in the Top End',
        body:
          `Each June, we bring Latvia's beloved Jāņi - St John's Day/Midsummer night —to life beneath Darwin's star-filled skies. Our community sings traditional Līgo songs, weaves wreaths of leaves and flowers, enjoys hearty Latvian food, and gathers around the Līgo fire to honour the sun's strength and the promise of good fortune. Music, laughter, and the glow of the bonfire make Jāņi in Darwin a uniquely warm and spirited celebration of culture, nature, and togetherness.`,
      },
      {
        id: 'baltijas-cels',
        title: 'Baltijas ceļš – Commemorating the Baltic Way',
        body:
          `Every August, we join Latvians, Lithuanians, and Estonians worldwide in honouring the Baltijas ceļš—the Baltic Way. Through reflection, shared stories, and a symbolic human chain, we remember the nearly two million people who stood hand-in-hand in 1989 to peacefully demand freedom. Our Darwin commemoration highlights the courage, unity, and hope that shaped our nations' futures, keeping alive the message that collective strength can inspire profound change.`,
      },
      {
        id: 'nov18',
        title:
          `18. novembris – Proclamation Day of the Republic of Latvia – Latvia's Independence Day`,
        body:
          `On 18 November, we celebrate one of Latvia's most significant national days—the Proclamation of the Independence of the Republic of Latvia. Our Darwin community gathers to honour this historic moment with speeches, songs, and shared Latvian foods. It is a time to reflect on Latvia's story, celebrate our identity, and strengthen the bonds that connect Latvians across oceans. Everyone is warmly invited to join us in marking this important day with pride and gratitude.`,
      },
    ],
  },
  footer: {
    tagline: 'Latvian Association of Darwin — Dārvinas Latviešu Apvienība',
    quickLinks: 'Quick Links',
    resources: 'Resources',
    getInvolved: 'Get Involved',
    getInvolvedText: 'Whether you have Latvian heritage or want to connect with a vibrant community, there is always a place for you in our association.',
    incorporatedSince: 'Incorporated Entity from 22 October 2023',
    contactTitle: 'Get in Touch',
    contact: 'Get in touch',
    rights: 'All rights reserved.',
    address: 'Darwin, Northern Territory, Australia',
    languageLabel: 'Language',
    donate: {
      heroEyebrow: 'Support our community',
      heroTitle: 'Donate',
      heroSubtitle: 'Support our community in the Northern Territory and preserve our Latvian heritage.',
      
      urgentLabel: 'Urgent Priority',
      urgentTitle: 'Support Needed Now',
      urgentIntro: 'DLA directs support to our local community events, cultural preservation, and people in need. Fast donations let us respond quickly.',
      urgentItems: [
        {
          title: 'Cultural Events',
          body: 'Funding for continuity of language, heritage, and community celebrations like Jāņi and Lieldienas.',
        },
        {
          title: 'Community Stability',
          body: 'Help with hall rentals, equipment, and resources for our regular gatherings.',
        },
        {
          title: 'Emergency relief',
          body: 'Immediate support for members of our community facing unexpected hardships.',
        },
      ],

      features: ['Secure checkout', 'Zero fees via PayID', 'Direct to community'],

      quickLabel: 'Quick Donate',
      quickTitle: 'Choose an Amount',
      quickIntro: 'Select a preset amount to donate instantly, or scroll down to enter any amount.',
      presetAmounts: [
        { amount: 10, body: 'Helps with transport assistance or a community meal contribution.' },
        { amount: 25, body: 'Covers materials for one cultural workshop or language class.' },
        { amount: 50, body: 'Supports essential supplies for our major community events.' },
        { amount: 100, body: 'Funds hall hire for a regular community gathering or choir practice.' },
        { amount: 250, body: 'Contributes significantly to our annual national day celebrations.' },
      ],
      quickDonateButton: 'Donate now',

      largeDonationTitle: 'AU$500 or more',
      largeDonationBody: 'Recommended: direct bank transfer or PayID — no processing fees, request a receipt any time.',
      largeDonationButton: 'View details',

      customOrLabel: 'or enter any amount',
      customLoading: 'Loading secure checkout…',
      
      directLabel: 'Direct Payment',
      directTitle: 'Bank Transfer & PayID',
      directIntro: 'Recommended for larger donations. Direct transfers carry no processing fees and we can issue a receipt on request.',
      bankOrgName: 'Latvian Association of Darwin Incorporated',
      bankStep1Title: 'Open your banking app',
      bankStep1Body: 'Log in and select "Make a transfer" or "New payment"',
      bankStep2Title: 'Enter these details',
      bankBsbLabel: 'BSB',
      bankBsb: '000-000', // To be updated
      bankAccountLabel: 'Account Number',
      bankAccount: '00000000', // To be updated
      bankStep3Title: 'Add a reference (required)',
      bankStep3Ref: 'Your Name or "Donation"',
      bankStep3Body: 'This helps us track your donation and send a receipt.',
      payIdTitle: 'PayID — faster option',
      payIdBody: 'Send directly from any Australian banking app in seconds. Look for "Pay to PayID" or "New PayID payment" and paste the email below.',
      payIdEmailLabel: 'PayID Email',
      payIdEmail: 'dla@example.com', // To be updated
      payIdZeroFeesTitle: 'Zero fees',
      payIdZeroFeesBody: 'PayID and bank transfers route funds directly to DLA with no deductions. 100% of donations go to our programs.',
      receiptFooterText: 'Need a receipt? Email us with your name and transfer details and we\'ll confirm promptly.',

      intro: 'Every contribution - one-time or monthly - directly funds cultural events, language resources, and community gatherings.',
      amountLabel: 'Choose an amount (AUD)',
      customPlaceholder: 'Other amount',
      customAriaLabel: 'Custom donation amount in Australian dollars',
      frequencyLabel: 'Donation frequency',
      frequencyOneTime: 'One-time',
      frequencyMonthly: 'Monthly',
      submitButton: 'Donate now',
      submitLoading: 'Processing...',
      errorAmountRequired: 'Please choose or enter a donation amount before continuing.',
      errorInvalidAmount: 'Enter a positive number greater than zero.',
      successHeading: 'Thank you for your generosity!',
      successBody: 'In a real deployment this would hand off to a secure payment processor. For now we have logged your intent so the team can follow up.',
      successAnother: 'Make another donation',
      trustBadges: ['Secure', 'Community led'],
    },
  },
}

const lv: SiteContent = {
  nav: {
    about: 'Par mums',
    history: 'Vēsture',
    events: 'Pasākumi',
    skipToContent: 'Pāriet uz saturu',
    donate: 'Ziedot',
  },
  hero: {
    eyebrow: 'Ziemeļu Teritorija, Austrālija',
    title: 'Dārvinas Latviešu Apvienība',
    subtitle:
      'Dārvinas Latviešu Apvienība — welcoming community for Latvians, Latvian descendants, and friends of Latvia in the Top End.',
    cta: 'Uzziniet par mūsu pasākumiem',
  },
  about: {
    title: 'Par apvienību',
    body: [
      'Dārvinas Latviešu Apvienība ir kopienas organizācija, kas apvieno latviešus, latviešu pēcnācējus un Latvijas draugus visā Ziemeļu Teritorijā. Izveidota, lai atbalstītu un svinētu latviešu mantojumu, Apvienība piedāvā draudzīgu telpu, kurā kultūra, valoda un tradīcijas tiek kopīgotas, saglabātas un baudītas.',
      'Mūsu kopiena ir veidota uz savienojumu pamata — atbalstot sadarbību un vienotību starp latviešiem Dārvinā, visā Austrālijā un ar organizācijām Latvijā un visā pasaulē. Arī kultūras pasākumiem, sociālajiem pulcēšanās brīžiem, izglītojošām aktivitātēm un kopienas iniciatīvām mēs cenšamies stiprināt mūsu kopīgo identitāti un radīt piederības sajūtu visiem, kas novērtē latviešu kultūru.',
      'Apvienība arī veicina latviešu kultūras, sociālo, izglītības un labklājības aktivitāšu tālāku attīstību Ziemeļu Teritorijā. Neatkarīgi no tā, vai jums ir latviešu izcelsme, interese par Baltijas kultūru vai vienkārši vēlaties pievienoties dzīvai daudzkultūru kopienai, mēs jūs laipni aicinām pievienoties.',
      'Kopā mēs svinam savu vēsturi, atbalstām viens otru un nodrošinām, ka latviešu kultūra Dārvinā plaukst nākamajām paaudzēm.',
    ],
  },
  history: {
    title: 'Mūsu vēsture',
    body: [
      'Dārvinas Latviešu Apvienība ir viena no Austrālijas jaunākajām latviešu kopienas organizācijām, oficiāli reģistrēta 2023. gada 22. oktobrī (ABN 25 545 712 911), lai atbalstītu augošo latviešu kopienu Ziemeļu Teritorijā.',
      'Lai gan formāli dibināta 2023. gadā, Apvienība balstās uz daudzu gadu neformāliem kultūras, sociāliem un piemiņas pulcēšanās brīžiem, ko Dārvinā dzīvojošie latvieši rīkoja jau kopš 1980. gadiem. Šīs kopienas tradīcijas — sākot no Latvijas nacionālo dienu svinēšanām līdz kultūras pasākumiem un diasporas piemiņas brīžiem — radīja spēcīgu pamatu pastāvīgai organizācijai, kas pārstāvētu un vienotu latviešus visā Top End reģionā.',
      'Apvienība tika izveidota ar skaidru mērķi: saglabāt un veicināt latviešu kultūru, valodu un mantojumu Dārvinā, atbalstīt latviešu pēcnācējus un stiprināt saiknes ar latviešu organizācijām visā Austrālijā un starptautiski.',
      'Šodien Dārvinas Latviešu Apvienība turpina augt kā dzīva un uzņemoša kopiena — godinot pagātni, svinot tagadni un nodrošinot, ka latviešu kultūra plaukst nākamajām paaudzēm Ziemeļu Teritorijā.',
    ],
  },
  events: {
    title: 'Pasākumi',
    intro:
      'Gada garumā mēs pulcējamies, lai godinātu latviešu tradīcijas, atzīmētu nacionālās dienas un sagaidītu gadalaiku maiņu. Visi ir laipni aicināti pievienoties.',
    items: [
      {
        id: 'lieldienas',
        title: 'Lieldienas – Easter the Latvian Way in Darwin',
        body:
          'Dārvinas Latviešu Apvienībā mēs svinam Lieldienas — Latvijas priecīgo pavasara un atjaunošanās svētku — ar siltu Top End pieskārienu. Ģimenes un draugi pulcējas olu dabīgai krāsošanai, olu ripināšanai, olu kaujām un bauda latviešu našķus. Mēs pieņemam senās paražas, lai sagaidītu jauno sezonu, radot dzīvespriecīgu svinēšanu, kas sapludina latviešu mantojumu ar Dārvinas tropisko šarmu. Visi ir laipni aicināti pievienoties mums, sagaidot gaišākas dienas kopā.',
      },
      {
        id: 'may4',
        title: '4. maijs — Latvijas Republikas Neatkarības atjaunošanas diena',
        body:
          '4. maijā mēs ar lepnumu atzīmējam Latvijas Neatkarības atjaunošanas dienu, svinot Baltā galdauta svētkus. Mūsu kopiena pulcējas ap baltu galdautu, kas simbolizē mieru, vienotību un godīgumu. Mēs dalāmies latviešu ēdienos, pārdomājam mūsu valsts ceļu un svinam izturību un garu, kas vieno latviešus visā pasaulē. Dārvinā šī diena ir sirsnīgs atgādinājums par brīvību, identitāti un kopīgo mantojumu.',
      },
      {
        id: 'jani',
        title: 'Jāņi — saulgriežu maģija Top End reģionā',
        body:
          'Katru jūniju mēs atdzīvinām Latvijā tik mīļos Jāņus — Līgo vakaru un Jāņu dienu — zem Dārvinas zvaigžņotajām debesīm. Mūsu kopiena dzied tradicionālās Līgo dziesmas, pin vainagus no lapām un ziediem, bauda latviešu ēdienus un pulcējas ap Līgo uguni, godinot saules spēku un labas veiksmes solījumu. Mūzika, smiekli un ugunskura gaisma padara Jāņus Dārvinā par īpaši siltu un dzīvespriecīgu kultūras, dabas un kopības svinēšanu.',
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
    quickLinks: 'Ātrās saites',
    resources: 'Resursi',
    getInvolved: 'Iesaisties',
    getInvolvedText: 'Neatkarīgi no tā, vai jums ir latviešu izcelsme, vai vēlaties pievienoties mūsu kopienai, jūs vienmēr esat laipni gaidīti mūsu apvienībā.',
    incorporatedSince: 'Reģistrēta asociācija no 2023. gada 22. oktobra',
    contactTitle: 'Sazināties ar mums',
    contact: 'Sazināties ar mums',
    rights: 'Visas tiesības aizsargātas.',
    address: 'Dārvina, Ziemeļu Teritorija, Austrālija',
    languageLabel: 'Valoda',
    donate: {
      heroEyebrow: 'Atbalsti mūsu kopienu',
      heroTitle: 'Ziedot',
      heroSubtitle: 'Atbalstiet mūsu kopienu Ziemeļu Teritorijā un palīdziet saglabāt latviešu mantojumu.',
      
      urgentLabel: 'Aktuālās vajadzības',
      urgentTitle: 'Atbalsts nepieciešams tagad',
      urgentIntro: 'DLA novirza atbalstu mūsu vietējiem pasākumiem, kultūras saglabāšanai un cilvēkiem, kuriem tas nepieciešams. Ātri ziedojumi ļauj mums nekavējoties reaģēt.',
      urgentItems: [
        {
          title: 'Kultūras pasākumi',
          body: 'Finansējums valodas, mantojuma un kopienas svētku, piemēram, Jāņu un Lieldienu, nepārtrauktībai.',
        },
        {
          title: 'Kopienas stabilitāte',
          body: 'Palīdzība ar telpu īri, aprīkojumu un resursiem mūsu regulārajām tikšanās reizēm.',
        },
        {
          title: 'Ārkārtas palīdzība',
          body: 'Tūlītējs atbalsts mūsu kopienas locekļiem, kuri saskaras ar neparedzētām grūtībām.',
        },
      ],

      features: ['Droši maksājumi', 'Bez komisijas maksas caur PayID', 'Tieši kopienai'],

      quickLabel: 'Ātrs ziedojums',
      quickTitle: 'Izvēlies summu',
      quickIntro: 'Izvēlieties norādīto summu, lai ziedotu nekavējoties, vai ritiniet uz leju, lai ievadītu jebkuru summu.',
      presetAmounts: [
        { amount: 10, body: 'Palīdz ar transporta izdevumiem vai kopienas maltītes organizēšanu.' },
        { amount: 25, body: 'Nosedz materiālu izmaksas vienai kultūras darbnīcai vai valodas nodarbībai.' },
        { amount: 50, body: 'Atbalsta nepieciešamos krājumus mūsu lielākajiem kopienas pasākumiem.' },
        { amount: 100, body: 'Finansē telpu īri regulārai kopienas sanāksmei vai kora mēģinājumam.' },
        { amount: 250, body: 'Ievērojami veicina mūsu ikgadējo nacionālo svētku organizēšanu.' },
      ],
      quickDonateButton: 'Ziedot tagad',

      largeDonationTitle: 'AU$500 vai vairāk',
      largeDonationBody: 'Ieteicams: tiešs bankas pārskaitījums vai PayID — bez apstrādes maksas, kvīts pieejama pēc pieprasījuma.',
      largeDonationButton: 'Skatīt informāciju',

      customOrLabel: 'vai ievadi jebkuru summu',
      customLoading: 'Ielādē drošu maksājumu sistēmu…',
      
      directLabel: 'Tiešs maksājums',
      directTitle: 'Bankas pārskaitījums un PayID',
      directIntro: 'Ieteicams lielākiem ziedojumiem. Tiešajiem pārskaitījumiem nav apstrādes maksas, un mēs varam izsniegt kvīti pēc pieprasījuma.',
      bankOrgName: 'Latvian Association of Darwin Inc',
      bankStep1Title: 'Atveriet savu bankas lietotni',
      bankStep1Body: 'Piesakieties un izvēlieties "Veikt pārskaitījumu" vai "Jauns maksājums"',
      bankStep2Title: 'Ievadiet šo informāciju',
      bankBsbLabel: 'BSB',
      bankBsb: '000-000', // To be updated
      bankAccountLabel: 'Konta numurs',
      bankAccount: '00000000', // To be updated
      bankStep3Title: 'Pievienojiet atsauci (obligāti)',
      bankStep3Ref: 'Jūsu vārds vai "Ziedojums"',
      bankStep3Body: 'Tas palīdz mums izsekot jūsu ziedojumam un nosūtīt kvīti.',
      payIdTitle: 'PayID — ātrāks veids',
      payIdBody: 'Sūtiet tieši no jebkuras Austrālijas bankas lietotnes dažu sekunžu laikā. Meklējiet "Pay to PayID" un ielīmējiet tālāk norādīto e-pastu.',
      payIdEmailLabel: 'PayID E-pasts',
      payIdEmail: 'dla@example.com', // To be updated
      payIdZeroFeesTitle: 'Bez komisijas maksas',
      payIdZeroFeesBody: 'PayID un bankas pārskaitījumi nosūta līdzekļus tieši DLA bez jebkādiem atvilkumiem. 100% ziedojumu nonāk mūsu programmās.',
      receiptFooterText: 'Nepieciešama kvīts? Nosūtiet mums e-pastu ar savu vārdu un pārskaitījuma detaļām, un mēs to apstiprināsim.',

      intro: 'Jebkurš ziedojums - vienreizējs vai ikmēneša - tieši atbalsta kultūras pasākumus, valodas resursus un kopienas pulcēšanās. 100% ziedojumu nonāk Dārvinas Latviešu Apvienības programmās.',
      amountLabel: 'Izvēlies summu (AUD)',
      customPlaceholder: 'Cita summa',
      customAriaLabel: 'Brīvi izvēlēta ziedojuma summa Austrālijas dolāros',
      frequencyLabel: 'Ziedojuma biežums',
      frequencyOneTime: 'Vienreizējs',
      frequencyMonthly: 'Ikmēneša',
      submitButton: 'Ziedot tagad',
      submitLoading: 'Notiek apstrāde...',
      errorAmountRequired: 'Lūdzu, izvēlies vai ievadi ziedojuma summu, pirms turpināt.',
      errorInvalidAmount: 'Ievadi pozitīvu skaitli, kas lielāks par nulli.',
      successHeading: 'Paldies par jūsu dāsnumu!',
      successBody: 'Reālā vidē šeit notiktu droša maksājuma apstrāde. Šobrīd mēs esam reģistrējuši jūsu nodomu, lai komanda varētu sazināties.',
      successAnother: 'Veikt vēl vienu ziedojumu',
      trustBadges: ['Droši', 'Vada kopiena'],
    },
  },
}

// Validate both content maps at module load. In dev we log, in prod we still log
// (CMS data is expected to be valid; the only path to invalid data is a developer
// mistake that should surface immediately).
const enResult = SiteContentSchema.safeParse(en)
const lvResult = SiteContentSchema.safeParse(lv)
if (!enResult.success) {
  // eslint-disable-next-line no-console
  console.error('[i18n] English content failed validation', enResult.error.format())
}
if (!lvResult.success) {
  // eslint-disable-next-line no-console
  console.error('[i18n] Latvian content failed validation', lvResult.error.format())
}

export const contentByLang: Record<Lang, SiteContent> = {
  en: enResult.success ? enResult.data : en,
  lv: lvResult.success ? lvResult.data : lv,
}