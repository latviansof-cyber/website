import { getPayloadClient } from '@/lib/payload'
import { fallbackSpecialPages } from '@/lib/specialPages'
import { contentByLang } from '@/app/(frontend)/i18n/content'

async function main() {
  const payload = await getPayloadClient()
  const en = contentByLang.en
  const lv = contentByLang.lv

  console.log('🌱 Seeding Payload CMS…\n')

  // ── Site Settings ──
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      en: {
        associationName: 'Latvian Association of Darwin',
        tagline: 'Dārvinas Latviešu Apvienība',
        contactEmail: 'hello@darwinlatvians.org',
      },
      lv: {
        associationName: 'Dārvinas Latviešu Apvienība',
        tagline: 'Latvian Association of Darwin',
        contactEmail: 'hello@darwinlatvians.org',
      },
    },
  })
  console.log('  ✅ Site Settings updated')

  // ── Donation Settings ──
  await payload.updateGlobal({
    slug: 'donation-settings',
    data: {
      en: {
        bankName: 'Not configured',
        bsb: 'Not configured',
        accountNumber: 'Not configured',
        accountName: 'Latvian Association of Darwin',
        payId: 'Not configured',
        instructions: 'Enter verified donation details in Payload admin.',
      },
      lv: {
        bankName: 'Nav konfigurēts',
        bsb: 'Nav konfigurēts',
        accountNumber: 'Nav konfigurēts',
        accountName: 'Dārvinas Latviešu Apvienība',
        payId: 'Nav konfigurēts',
        instructions: 'Ievadiet pārbaudītu ziedojumu informāciju Payload administrācijā.',
      },
    },
  })
  console.log('  ✅ Donation Settings updated')

  // ── Homepage ──
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      en: {
        heroEyebrow: en.hero.eyebrow,
        heroTitle: en.hero.title,
        heroSubtitle: en.hero.subtitle,
        heroPrimaryLabel: en.hero.cta,
        heroSecondaryLabel: en.nav.about,
      },
      lv: {
        heroEyebrow: lv.hero.eyebrow,
        heroTitle: lv.hero.title,
        heroSubtitle: lv.hero.subtitle,
        heroPrimaryLabel: lv.hero.cta,
        heroSecondaryLabel: lv.nav.about,
      },
      heroPrimaryHref: '/#events',
      heroSecondaryHref: '/about',
    },
  })
  console.log('  ✅ Homepage updated')

  // ── Main Menu ──
  await payload.updateGlobal({
    slug: 'main-menu',
    data: {
      items: [
        { href: '/about', en: 'About', lv: 'Par Mums' },
        { href: '/events', en: 'Events', lv: 'Pasākumi' },
        { href: '/community', en: 'Community', lv: 'Kopiena' },
        { href: '/membership', en: 'Membership', lv: 'Dalība' },
        { href: '/donate', en: 'Donate', lv: 'Ziedot' },
      ],
    },
  })
  console.log('  ✅ Main Menu updated')

  // ── Footer ──
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      en: {
        tagline: en.footer.tagline,
        address: en.footer.address,
        rights: en.footer.rights,
      },
      lv: {
        tagline: lv.footer.tagline,
        address: lv.footer.address,
        rights: lv.footer.rights,
      },
    },
  })
  console.log('  ✅ Footer updated')

  // ── Regular Pages ──
  const pageSlugs = ['community', 'membership']
  for (const slug of pageSlugs) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
    })
    if (existing.docs.length > 0) {
      console.log(`  ⏭️  Page "${slug}" already exists, skipping`)
      continue
    }
    await payload.create({
      collection: 'pages',
      draft: false,
      data: {
        adminTitle: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        order: 10,
        en: {
          title: slug === 'community' ? 'Community' : 'Membership',
          excerpt: slug === 'community' ? 'Our community' : 'Become a member',
        },
        lv: {
          title: slug === 'community' ? 'Kopiena' : 'Dalība',
          excerpt: slug === 'community' ? 'Mūsu kopiena' : 'Kļūt par biedru',
        },
        layout: [
          {
            blockType: 'hero',
            en: {
              heading: slug === 'community' ? 'Our Community' : 'Membership',
              text: slug === 'community' ? 'The Latvian community in Darwin' : 'Join the Latvian Association of Darwin',
            },
            lv: {
              heading: slug === 'community' ? 'Mūsu Kopiena' : 'Dalība',
              text: slug === 'community' ? 'Latviešu kopiena Dārvinā' : 'Pievienojieties Dārvinas Latviešu Apvienībai',
            },
            alignment: 'center',
          },
          {
            blockType: 'content',
            en: {
              heading: null,
              body: slug === 'community' ? 'Welcome to the Latvian community in Darwin.' : 'Become a member of the Latvian Association of Darwin.',
            },
            lv: {
              heading: null,
              body: slug === 'community' ? 'Laipni lūdzam Latviešu kopienā Dārvinā.' : 'Kļūsti par Dārvinas Latviešu Apvienības biedru.',
            },
            tone: 'plain',
            imagePosition: 'none',
          },
        ],
      },
      overrideAccess: true,
    })
    console.log(`  ✅ Page "${slug}" created`)
  }

  // ── Special Pages ──
  const specialSlugs = ['about', 'privacy', 'terms', 'eula']
  for (const slug of specialSlugs) {
    const existing = await payload.find({
      collection: 'special-pages',
      where: { slug: { equals: slug } },
    })
    if (existing.docs.length > 0) {
      console.log(`  ⏭️  Special page "${slug}" already exists, skipping`)
      continue
    }
    await payload.create({
      collection: 'special-pages',
      draft: false,
      data: {
        adminTitle: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        en: {
          title: fallbackSpecialPages.find((p) => p.slug === slug)?.en.title ?? slug.charAt(0).toUpperCase() + slug.slice(1),
          content: fallbackSpecialPages.find((p) => p.slug === slug)?.en.content ?? `Content for ${slug}`,
        },
        lv: {
          title: fallbackSpecialPages.find((p) => p.slug === slug)?.lv.title ?? (slug === 'about' ? 'Par Mums' : slug === 'privacy' ? 'Privātums' : slug === 'terms' ? 'Noteikumi' : 'EULA'),
          content: fallbackSpecialPages.find((p) => p.slug === slug)?.lv.content ?? `Saturs priekš ${slug}`,
        },
      },
      overrideAccess: true,
    })
    console.log(`  ✅ Special page "${slug}" created`)
  }

  console.log('\n🎉 Seeding complete!')
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
