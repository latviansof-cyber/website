import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add Culture & Traditions page
  await payload.create({
    collection: 'pages',
    data: {
      adminTitle: 'Culture & Traditions',
      slug: 'culture',
      order: 50,
      _status: 'published',
      en: {
        title: 'Culture & Traditions',
        excerpt: 'Explore the vibrant Latvian heritage, from song and dance festivals to seasonal celebrations kept alive in Darwin.',
      },
      lv: {
        title: 'Kultūra un tradīcijas',
        excerpt: 'Iepazīstiet dzīvīgo latviešu mantojumu, no dziesmu un deju svētkiem līdz gadskārtu svinībām Dārvinā.',
      },
      layout: [
        {
          blockType: 'hero',
          alignment: 'left',
          en: {
            eyebrow: 'Latvian Association of Darwin',
            heading: 'Culture & Traditions',
            text: 'Explore the vibrant Latvian heritage, from song and dance festivals to seasonal celebrations kept alive in Darwin.',
          },
          lv: {
            eyebrow: 'Dārvinas Latviešu Apvienība',
            heading: 'Kultūra un tradīcijas',
            text: 'Iepazīstiet dzīvīgo latviešu mantojumu, no dziesmu un deju svētkiem līdz gadskārtu svinībām Dārvinā.',
          }
        },
        {
          blockType: 'content',
          imagePosition: 'right',
          tone: 'plain',
          en: {
            body: 'Latvian culture is deeply rooted in history, nature, and community. In Darwin, we actively preserve and celebrate our unique traditions, keeping them alive for future generations and sharing them with the wider Australian community.\n\nFrom the traditional summer solstice celebration of Jāņi with its flower crowns, songs, and bonfires, to celebrating national holidays, we cherish our rich heritage. We also maintain connections with the broader Latvian diaspora in Australia, participating in regional song festivals, cultural events, and youth gatherings.\n\nTraditional crafts, folk dancing, and singing are at the heart of our community life, offering a bridge between Latvia and our home in the Northern Territory.',
          },
          lv: {
            body: 'Latviešu kultūra ir cieši saistīta ar vēsturi, dabu un kopienu. Dārvinā mēs aktīvi saglabājam un kopjam savas unikālās tradīcijas, nododot tās nākamajām paaudzēm un daloties tajās ar plašāku Austrālijas sabiedrību.\n\nNo tradicionālajām vasaras saulgriežu svinībām – Jāņiem ar vainagu pīšanu, dziesmām un ugunskuriem, līdz valsts svētku atzīmēšanai – mēs godinām mūsu bagāto mantojumu. Mēs arī uzturam saites ar plašāku latviešu diasporu Austrālijā, piedaloties reģionālos dziesmu svētkos, kultūras pasākumos un jauniešu salidojumos.\n\nTradicionālie amatniecības izstrādājumi, tautas dejas un dziedāšana ir mūsu kopienas dzīves centrā, nodrošinot tiltu starp Latviju un mūsu mājām Ziemeļu Teritorijā.',
          }
        }
      ]
    },
    req,
  })

  // Add Contact Us page
  await payload.create({
    collection: 'pages',
    data: {
      adminTitle: 'Contact Us',
      slug: 'contact',
      order: 60,
      _status: 'published',
      en: {
        title: 'Contact Us',
        excerpt: 'Get in touch with the Latvian Association of Darwin. We welcome questions, membership inquiries, and cultural collaborations.',
      },
      lv: {
        title: 'Kontakti',
        excerpt: 'Sazinieties ar Dārvinas Latviešu Apvienību. Mēs priecāsimies par jūsu jautājumiem, sadarbības priekšlikumiem un vēstulēm.',
      },
      layout: [
        {
          blockType: 'hero',
          alignment: 'left',
          en: {
            eyebrow: 'Latvian Association of Darwin',
            heading: 'Contact Us',
            text: 'Get in touch with the Latvian Association of Darwin. We welcome questions, membership inquiries, and cultural collaborations.',
          },
          lv: {
            eyebrow: 'Dārvinas Latviešu Apvienība',
            heading: 'Kontakti',
            text: 'Sazinieties ar Dārvinas Latviešu Apvienību. Mēs priecāsimies par jūsu jautājumiem, sadarbības priekšlikumiem un vēstulēm.',
          }
        },
        {
          blockType: 'content',
          imagePosition: 'right',
          tone: 'plain',
          en: {
            body: 'We would love to hear from you! Whether you are a Latvian newly arrived in the Northern Territory, a descendant wishing to reconnect with your heritage, or a local resident interested in Latvian culture, our door is always open.\n\nYou can reach out to us via email for general inquiries, membership applications, or event details. We also encourage you to follow our social media channels to stay updated on upcoming community gatherings and initiatives.\n\nLet\'s connect and build a stronger community together in the Top End!',
          },
          lv: {
            body: 'Mēs priecāsimies par jūsu ziņām! Neatkarīgi no tā, vai esat latvietis, kurš nesen ieradies Ziemeļu Teritorijā, pēcnācējs, kurš vēlas atjaunot saikni ar savu mantojumu, vai vietējais iedzīvotājs, kuram interesē latviešu kultūra – mūsu durvis ir atvērtas.\n\nSazinieties ar mums pa e-pastu, lai uzdotu jautājumus, pieteiktos dalībai apvienībā vai uzzinātu par pasākumiem. Tāpat aicinām sekot mūsu sociālo tīklu profiliem, lai uzzinātu jaunumus par nākamiem kopienas sarīkojumiem un iniciatīvām.\n\nSazināsimies un veidoim stiprāku kopienu kopā Ziemeļu Teritorijā!',
          }
        },
        {
          blockType: 'cta',
          en: {
            heading: 'Want to reach out?',
            text: 'Contact us via email or join us at the next gathering.',
            buttons: [
              {
                label: 'Send Email',
                link: 'mailto:hello@darwinlatvians.org',
                variant: 'primary',
              }
            ]
          },
          lv: {
            heading: 'Vēlaties sazināties?',
            text: 'Sazinieties ar mums pa e-pastu vai pievienojieties nākamajā tikšanās reizē.',
            buttons: [
              {
                label: 'Sūtīt e-pastu',
                link: 'mailto:hello@darwinlatvians.org',
                variant: 'primary',
              }
            ]
          }
        }
      ]
    },
    req,
  })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Delete the pages by slug
  await payload.delete({
    collection: 'pages',
    where: {
      slug: {
        in: ['culture', 'contact'],
      }
    },
    req,
  })
}
