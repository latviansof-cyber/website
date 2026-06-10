import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Insert "About" page into special_pages
  await db.run(sql`INSERT INTO \`special_pages\` (
    \`id\`,
    \`admin_title\`,
    \`slug\`,
    \`en_title\`,
    \`en_content\`,
    \`lv_title\`,
    \`lv_content\`,
    \`_status\`
  ) VALUES (
    4,
    'About the Association',
    'about',
    'About the Association',
    'The Latvian Association of Darwin (Dārvinas Latviešu Apvienība) is a community organisation dedicated to bringing together Latvians, Latvian descendants, and friends of Latvia across the Northern Territory. We provide a welcoming place where culture, language, and traditions can be shared, preserved, and enjoyed.\n\nOur community supports cooperation among Latvians in Darwin, across Australia, and with organisations in Latvia and around the world. Cultural events, social gatherings, educational activities, and community initiatives strengthen our shared identity and create a sense of belonging.\n\nWhether you have Latvian heritage, an interest in Baltic culture, or simply want to connect with a vibrant multicultural community, you are welcome.',
    'Par apvienību',
    'Dārvinas Latviešu Apvienība ir kopienas organizācija, kas apvieno latviešus, latviešu pēcnācējus un Latvijas draugus visā Ziemeļu Teritorijā. Mēs piedāvājam draudzīgu vietu, kur kultūra, valoda un tradīcijas tiek kopīgotas, saglabātas un baudītas.\n\nMūsu kopiena veicina sadarbību starp latviešiem Dārvinā, visā Austrālijā un ar organizācijām Latvijā un pasaulē. Kultūras pasākumi, saviesīgas tikšanās, izglītojošas aktivitātes un kopienas iniciatīvas stiprina mūsu kopīgo identitāti un piederības sajūtu.\n\nNeatkarīgi no tā, vai jums ir latvietis, kurš nesen ieradies Ziemeļu Teritorijā, pēcnācējs, kurš vēlas atjaunot saikni ar savu mantojumu, vai vietējais iedzīvotājs, kuram interesē latviešu kultūra – mūsu durvis ir atvērtas.',
    'published'
  );`)

  // 2. Remove old footer items
  await db.run(sql`DELETE FROM \`footer_items\` WHERE \`_parent_id\` = 1;`)

  // 3. Seed new footer items: About, Contacts, Privacy, Terms, EULA
  const footerItems = [
    { href: '/about', en: 'About', lv: 'Par mums' },
    { href: '/contact', en: 'Contacts', lv: 'Kontakti' },
    { href: '/privacy', en: 'Privacy Policy', lv: 'Privātuma politika' },
    { href: '/terms', en: 'Terms & Conditions', lv: 'Lietošanas noteikumi' },
    { href: '/eula', en: 'EULA', lv: 'EULA' }
  ]

  for (const [order, item] of footerItems.entries()) {
    await db.run(sql`INSERT INTO \`footer_items\` (
      \`_order\`,
      \`_parent_id\`,
      \`id\`,
      \`href\`,
      \`en\`,
      \`lv\`,
      \`new_tab\`
    ) VALUES (
      ${order + 1},
      1,
      ${`footer-item-new-${order + 1}`},
      ${item.href},
      ${item.en},
      ${item.lv},
      false
    );`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DELETE FROM \`special_pages\` WHERE \`slug\` = 'about';`)
  await db.run(sql`DELETE FROM \`footer_items\` WHERE \`_parent_id\` = 1;`)
  
  // Re-seed previous items
  const footerItems = [
    { href: '/about', en: 'About', lv: 'Par mums' },
    { href: '/history', en: 'History', lv: 'Vēsture' },
    { href: '/community', en: 'Community', lv: 'Kopiena' },
    { href: '/membership', en: 'Join the Association', lv: 'Pievienoties apvienībai' },
    { href: '/#events', en: 'Events', lv: 'Pasākumi' },
    { href: '/donate', en: 'Donate', lv: 'Ziedot' },
    { href: '/privacy', en: 'Privacy Policy', lv: 'Privātuma politika' },
    { href: '/terms', en: 'Terms & Conditions', lv: 'Lietošanas noteikumi' },
    { href: '/eula', en: 'EULA', lv: 'EULA' }
  ]

  for (const [order, item] of footerItems.entries()) {
    await db.run(sql`INSERT INTO \`footer_items\` (
      \`_order\`,
      \`_parent_id\`,
      \`id\`,
      \`href\`,
      \`en\`,
      \`lv\`,
      \`new_tab\`
    ) VALUES (
      ${order + 1},
      1,
      ${`footer-item-${order + 1}`},
      ${item.href},
      ${item.en},
      ${item.lv},
      false
    );`)
  }
}
