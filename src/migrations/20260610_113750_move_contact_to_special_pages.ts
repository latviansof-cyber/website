import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Insert "Contact Us" page into special_pages
  await db.run(sql`INSERT INTO \`special_pages\` (
    \`admin_title\`,
    \`slug\`,
    \`en_title\`,
    \`en_content\`,
    \`lv_title\`,
    \`lv_content\`,
    \`_status\`
  ) VALUES (
    'Contact Us',
    'contact',
    'Contact Us',
    'We would love to hear from you! Whether you are a Latvian newly arrived in the Northern Territory, a descendant wishing to reconnect with your heritage, or a local resident interested in Latvian culture, our door is always open.\n\nYou can reach out to us via email for general inquiries, membership applications, or event details. We also encourage you to follow our social media channels to stay updated on upcoming community gatherings and initiatives.\n\nLet''s connect and build a stronger community together in the Top End!\n\nEmail: hello@darwinlatvians.org',
    'Kontakti',
    'Mēs priecāsimies par jūsu ziņām! Neatkarīgi no tā, vai esat latvietis, kurš nesen ieradies Ziemeļu Teritorijā, pēcnācējs, kurš vēlas atjaunot saikni ar savu mantojumu, vai vietējais iedzīvotājs, kuram interesē latviešu kultūra – mūsu durvis ir atvērtas.\n\nSazinieties ar mums pa e-pastu, lai uzdotu jautājumus, pieteiktos dalībai apvienībā vai uzzinātu par pasākumiem. Tāpat aicinām sekot mūsu sociālo tīklu profiliem, lai uzzinātu jaunumus par nākamiem kopienas sarīkojumiem un iniciatīvām.\n\nSazināsimies un veidosim stiprāku kopienu kopā Ziemeļu Teritorijā!\n\nE-pasts: hello@darwinlatvians.org',
    'published'
  );`)

  // 2. Delete old standard Contact page and its blocks from pages table to avoid routing conflicts
  await db.run(sql`DELETE FROM \`pages_blocks_hero\` WHERE \`_parent_id\` IN (SELECT \`id\` FROM \`pages\` WHERE \`slug\` = 'contact');`)
  await db.run(sql`DELETE FROM \`pages_blocks_content\` WHERE \`_parent_id\` IN (SELECT \`id\` FROM \`pages\` WHERE \`slug\` = 'contact');`)
  await db.run(sql`DELETE FROM \`pages_blocks_cta\` WHERE \`_parent_id\` IN (SELECT \`id\` FROM \`pages\` WHERE \`slug\` = 'contact');`)
  await db.run(sql`DELETE FROM \`pages\` WHERE \`slug\` = 'contact';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // 1. Delete "Contact Us" from special_pages
  await db.run(sql`DELETE FROM \`special_pages\` WHERE \`slug\` = 'contact';`)

  // 2. Re-insert the old standard Contact page (id: 6)
  await db.run(sql`INSERT INTO \`pages\` (
    \`id\`,
    \`admin_title\`,
    \`slug\`,
    \`order\`,
    \`en_title\`,
    \`en_excerpt\`,
    \`lv_title\`,
    \`lv_excerpt\`,
    \`meta_title\`,
    \`meta_description\`,
    \`meta_no_index\`,
    \`_status\`
  ) VALUES (
    6,
    'Contact Us',
    'contact',
    60,
    'Contact Us',
    'Get in touch with the Latvian Association of Darwin. We welcome questions, membership inquiries, and cultural collaborations.',
    'Kontakti',
    'Sazinieties ar Dārvinas Latviešu Apvienību. Mēs priecāsimies par jūsu jautājumiem, sadarbības priekšlikumiem un vēstulēm.',
    'Contact Us',
    'Get in touch with the Latvian Association of Darwin. We welcome questions, membership inquiries, and cultural collaborations.',
    false,
    'published'
  );`)

  // 3. Re-insert Contact blocks (hero, content, cta)
  await db.run(sql`INSERT INTO \`pages_blocks_hero\` (
    \`_order\`, \`_parent_id\`, \`_path\`, \`id\`, \`en_eyebrow\`, \`en_heading\`, \`en_text\`, \`lv_eyebrow\`, \`lv_heading\`, \`lv_text\`, \`alignment\`
  ) VALUES (
    0, 6, 'layout', 'page-6-hero-0', 'Latvian Association of Darwin', 'Contact Us', 'Get in touch with the Latvian Association of Darwin. We welcome questions, membership inquiries, and cultural collaborations.', 'Dārvinas Latviešu Apvienība', 'Kontakti', 'Sazinieties ar Dārvinas Latviešu Apvienību. Mēs priecāsimies par jūsu jautājumiem, sadarbības priekšlikumiem un vēstulēm.', 'left'
  );`)

  await db.run(sql`INSERT INTO \`pages_blocks_content\` (
    \`_order\`, \`_parent_id\`, \`_path\`, \`id\`, \`en_body\`, \`lv_body\`, \`image_position\`, \`tone\`
  ) VALUES (
    1, 6, 'layout', 'page-6-content-1', 'We would love to hear from you! Whether you are a Latvian newly arrived in the Northern Territory, a descendant wishing to reconnect with your heritage, or a local resident interested in Latvian culture, our door is always open.\n\nYou can reach out to us via email for general inquiries, membership applications, or event details. We also encourage you to follow our social media channels to stay updated on upcoming community gatherings and initiatives.\n\nLet''s connect and build a stronger community together in the Top End!', 'Mēs priecāsimies par jūsu ziņām! Neatkarīgi no tā, vai esat latvietis, kurš nesen ieradies Ziemeļu Teritorijā, pēcnācējs, kurš vēlas atjaunot saikni ar savu mantojumu, vai vietējais iedzīvotājs, kuram interesē latviešu kultūra – mūsu durvis ir atvērtas.\n\nSazinieties ar mums pa e-pastu, lai uzdotu jautājumus, pieteiktos dalībai apvienībā vai uzzinātu par pasākumiem. Tāpat aicinām sekot mūsu sociālo tīklu profiliem, lai uzzinātu jaunumus par nākamiem kopienas sarīkojumiem un iniciatīvām.\n\nSazināsimies un veidosim stiprāku kopienu kopā Ziemeļu Teritorijā!', 'right', 'plain'
  );`)
}
