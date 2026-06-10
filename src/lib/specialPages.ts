import type { SpecialPage as PayloadSpecialPage } from '@/payload-types'
import { getPayloadClient } from './payload'

export type SpecialPageLanguage = {
  title: string
  content: string
}

export type SpecialPageContent = {
  slug: string
  en: SpecialPageLanguage
  lv: SpecialPageLanguage
}

export const fallbackSpecialPages: SpecialPageContent[] = [
  {
    slug: 'privacy',
    en: {
      title: 'Privacy Policy',
      content: `Latvian Association of Darwin (DLA) respects your privacy and handles personal information responsibly.

Information We Collect
We may collect contact details you provide directly to us (such as your email address), and minimal technical information required to operate the website.

Cookies and Analytics
This website may use minimal analytics cookies to understand how visitors use our site. These analytics cookies are optional and you can clear your browser data to reset any preferences. All data is anonymized.

How We Use Information
- Respond to community inquiries
- Share event and community updates
- Improve website functionality

Data Sharing
We do not sell personal information. We only share information when required by law or with trusted service providers needed to run DLA services.

Your Rights
You have the right to request access to any personal information we hold about you, or request correction or deletion of your personal information.

Contact
For privacy questions or requests, contact us at hello@darwinlatvians.org.`
    },
    lv: {
      title: 'Privātuma politika',
      content: `Dārvinas Latviešu Apvienība (DLA) ciena jūsu privātumu un atbildīgi apstrādā personisko informāciju.

Informācija, ko mēs vācam
Mēs varam vākt kontaktinformāciju, ko sniedzat tieši mums (piemēram, jūsu e-pasta adresi), un minimālo tehnisko informāciju, kas nepieciešama tīmekļa vietnes darbībai.

Sīkfaili un analīze
Šī vietne var izmantot minimālus analītiskos sīkfailus, lai saprastu, kā apmeklētāji izmanto mūsu vietni. Šie sīkfaili ir neobligāti. Visi dati tiek anonimizēti.

Kā mēs izmantojam informāciju
- Atbildēt uz kopienas pieprasījumiem
- Kopīgot informāciju par pasākumiem un kopienas jaunumiem
- Uzlabot tīmekļa vietnes darbību

Datu kopīgošana
Mēs nepārdodam personisko informāciju. Mēs kopīgojam informāciju tikai tad, ja to pieprasa likums, vai ar uzticamiem pakalpojumu sniedzējiem, kas nepieciešami DLA pakalpojumu nodrošināšanai.

Jūsu tiesības
Jums ir tiesības pieprasīt piekļuvi jebkurai personiskajai informācijai, ko mēs glabājam par jums, vai pieprasīt jūsu personiskās informācijas labošanu vai dzēšanu.

Saziņa
Ja jums ir jautājumi par privātumu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.`
    }
  },
  {
    slug: 'terms',
    en: {
      title: 'Terms & Conditions',
      content: `Welcome to the Latvian Association of Darwin (DLA) website. By accessing or using this website, you agree to comply with and be bound by these Terms & Conditions.

Website Content
All content, branding, images, and materials on this website are the intellectual property of the Latvian Association of Darwin, unless otherwise stated. You may not reproduce, distribute, or reuse any materials without our prior written permission.

Use of Website
You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.

Third-Party Links
Our website may contain links to external websites. DLA is not responsible for the content, privacy policies, or practices of any third-party websites.

Limitation of Liability
While we strive to keep information accurate and up-to-date, DLA makes no representations or warranties of any kind about the completeness, accuracy, or availability of the website content. Your use of this website is at your own risk.

Contact
If you have any questions about these Terms & Conditions, please contact us at hello@darwinlatvians.org.`
    },
    lv: {
      title: 'Lietošanas noteikumi',
      content: `Laipni lūdzam Dārvinas Latviešu Apvienības (DLA) tīmekļa vietnē. Piekļūstot šai vietnei vai izmantojot to, jūs piekrītat ievērot šos lietošanas noteikumus.

Vietnes saturs
Viss saturs, zīmols, attēli un materiāli šajā vietnē ir Dārvinas Latviešu Apvienības intelektuālais īpašums, ja vien nav norādīts citādi. Jūs nedrīkstat reproducēt, izplatīt vai atkārtoti izmantot nekādus materiālus bez mūsu iepriekšējas rakstiskas atļaujas.

Vietnes izmantošana
Jūs piekrītat izmantot šo vietni tikai likumīgiem mērķiem un tādā veidā, kas nepārkāpj citu personu tiesības, neierobežo un nekavē vietnes izmantošanu.

Trešo pušu saites
Mūsu vietnē var būt saites uz ārējām vietnēm. DLA neatbild par trešo pušu vietņu saturu, privātuma politikām vai praksi.

Atbildības ierobežojums
Lai gan mēs cenšamies nodrošināt informācijas precizitāti, DLA nesniedz nekādas garantijas par vietnes satura pilnīgumu vai pieejamību. Vietnes izmantošana ir uz jūsu pašu risku.

Saziņa
Ja jums ir jautājumi par šiem lietošanas noteikumiem, lūdzu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.`
    }
  },
  {
    slug: 'eula',
    en: {
      title: 'End User License Agreement (EULA)',
      content: `This End User License Agreement ("Agreement") is a legal agreement between you and the Latvian Association of Darwin (DLA) for the use of this website and any digital services provided through it.

License Grant
DLA grants you a personal, non-exclusive, non-transferable, revocable license to access and use this website solely for personal, non-commercial purposes in accordance with this Agreement.

Restrictions
You agree not to:
- Modify, decompile, or reverse engineer any part of the website.
- Use the website to distribute malware, spam, or unlawful content.
- Scrap or systematically extract data from the website without our permission.

Termination
This license is effective until terminated. DLA reserves the right to suspend or terminate your access to the website at any time without notice if you violate this Agreement.

Governing Law
This Agreement is governed by the laws of the Northern Territory, Australia.

Contact
For any questions regarding this EULA, please contact us at hello@darwinlatvians.org.`
    },
    lv: {
      title: 'Gala lietotāja licences līgums (EULA)',
      content: `Šis Gala lietotāja licences līgums ("Līgums") ir juridisks līgums starp jums un Dārvinas Latviešu Apvienību (DLA) par šīs vietnes un ar tās starpniecību sniegto digitālo pakalpojumu izmantošanu.

Licences piešķiršana
DLA piešķir jums personisku, neekskluzīvu, nenododamu un atsaucamu licenci, lai piekļūtu vietnei un izmantotu to personiskiem, nekomerciāliem mērķiem saskaņā ar šo Līgumu.

Ierobežojumi
Jūs piekrītat:
- Nepārveidot un neveikt vietnes daļu reversās inženierijas procesus.
- Neizmantot vietni ļaunprogrammatūras, mēstuļu vai nelikumīga satura izplatīšanai.
- Neveikt automātisku datu ieguvi no vietnes bez mūsu atļaujas.

Izbeigšana
Šī licence ir spēkā līdz tās izbeigšanai. DLA patur tiesības jebkurā laikā bez brīdinājuma apturēt vai izbeigt jūsu piekļuvi vietnei, ja pārkāpjat šo Līgumu.

Piemērojamie tiesību akti
Šo Līgumu reglamentē Ziemeļu Teritorijas (Austrālija) tiesību akti.

Saziņa
Ja jums ir jautājumi par šo EULA, lūdzu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.`
    }
  }
]

export async function getSpecialPage(slug: string): Promise<SpecialPageContent | undefined> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'special-pages',
      depth: 1,
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          equals: 'published',
        },
      },
    })

    if (result.docs.length === 0) {
      return fallbackSpecialPages.find((p) => p.slug === slug)
    }

    const doc = result.docs[0]
    return {
      slug: doc.slug,
      en: doc.en,
      lv: doc.lv,
    }
  } catch (error) {
    console.warn(`[special-pages] Payload special page ${slug} unavailable; using fallback.`, error)
    return fallbackSpecialPages.find((p) => p.slug === slug)
  }
}
