import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`special_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`admin_title\` text,
  	\`slug\` text,
  	\`en_title\` text,
  	\`en_content\` text,
  	\`lv_title\` text,
  	\`lv_content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`special_pages_slug_idx\` ON \`special_pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`special_pages_updated_at_idx\` ON \`special_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`special_pages_created_at_idx\` ON \`special_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`special_pages__status_idx\` ON \`special_pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_special_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_admin_title\` text,
  	\`version_slug\` text,
  	\`version_en_title\` text,
  	\`version_en_content\` text,
  	\`version_lv_title\` text,
  	\`version_lv_content\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`special_pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_special_pages_v_parent_idx\` ON \`_special_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_special_pages_v_version_version_slug_idx\` ON \`_special_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_special_pages_v_version_version_updated_at_idx\` ON \`_special_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_special_pages_v_version_version_created_at_idx\` ON \`_special_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_special_pages_v_version_version__status_idx\` ON \`_special_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_special_pages_v_created_at_idx\` ON \`_special_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_special_pages_v_updated_at_idx\` ON \`_special_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_special_pages_v_latest_idx\` ON \`_special_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_special_pages_v_autosave_idx\` ON \`_special_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`footer_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	\`en\` text NOT NULL,
  	\`lv\` text NOT NULL,
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_items_order_idx\` ON \`footer_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_items_parent_id_idx\` ON \`footer_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`en_tagline\` text NOT NULL,
  	\`en_address\` text NOT NULL,
  	\`en_rights\` text NOT NULL,
  	\`lv_tagline\` text NOT NULL,
  	\`lv_address\` text NOT NULL,
  	\`lv_rights\` text NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`special_pages_id\` integer REFERENCES special_pages(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_special_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`special_pages_id\`);`)
  
  // Use DEFAULT value to make it safe to run on existing rows in SQLite D1
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`en_explore_eyebrow\` text NOT NULL DEFAULT 'Explore';`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`en_explore_title\` text NOT NULL DEFAULT 'Association and community';`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`en_explore_intro\` text NOT NULL DEFAULT 'Start with a short overview, then open the full page when you want the detail.';`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`lv_explore_eyebrow\` text NOT NULL DEFAULT 'Iepazīstiet mūs';`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`lv_explore_title\` text NOT NULL DEFAULT 'Apvienība un kopiena';`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`lv_explore_intro\` text NOT NULL DEFAULT 'Īss ievads svarīgākajās tēmās. Atveriet pilno lapu, lai uzzinātu vairāk.';`)

  // Seed Footer global
  await db.run(sql`INSERT INTO \`footer\` (
    \`id\`,
    \`en_tagline\`,
    \`en_address\`,
    \`en_rights\`,
    \`lv_tagline\`,
    \`lv_address\`,
    \`lv_rights\`,
    \`updated_at\`,
    \`created_at\`
  ) VALUES (
    1,
    'Connecting Latvians in the Top End.',
    'Darwin, Northern Territory, Australia',
    'All rights reserved.',
    'Vienojot latviešus Ziemeļu Teritorijā.',
    'Dārvina, Ziemeļu Teritorija, Austrālija',
    'Visas tiesības aizsargātas.',
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  );`)

  // Seed Footer menu items
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

  // Seed SpecialPages
  const specialPages = [
    {
      slug: 'privacy',
      adminTitle: 'Privacy Policy',
      enTitle: 'Privacy Policy',
      enContent: 'Latvian Association of Darwin (DLA) respects your privacy and handles personal information responsibly.\n\nInformation We Collect\nWe may collect contact details you provide directly to us (such as your email address), and minimal technical information required to operate the website.\n\nCookies and Analytics\nThis website may use minimal analytics cookies to understand how visitors use our site. These analytics cookies are optional and you can clear your browser data to reset any preferences. All data is anonymized.\n\nHow We Use Information\n- Respond to community inquiries\n- Share event and community updates\n- Improve website functionality\n\nData Sharing\nWe do not sell personal information. We only share information when required by law or with trusted service providers needed to run DLA services.\n\nYour Rights\nYou have the right to request access to any personal information we hold about you, or request correction or deletion of your personal information.\n\nContact\nFor privacy questions or requests, contact us at hello@darwinlatvians.org.',
      lvTitle: 'Privātuma politika',
      lvContent: 'Dārvinas Latviešu Apvienība (DLA) ciena jūsu privātumu un atbildīgi apstrādā personisko informāciju.\n\nInformācija, ko mēs vācam\nMēs varam vākt kontaktinformāciju, ko sniedzat tieši mums (piemēram, jūsu e-pasta adresi), un minimālo tehnisko informāciju, kas nepieciešama tīmekļa vietnes darbībai.\n\nSīkfaili un analīze\nŠī vietne var izmantot minimālus analītiskos sīkfailus, lai saprastu, kā apmeklētāji izmanto mūsu vietni. Šie sīkfaili ir neobligāti. Visi dati tiek anonimizēti.\n\nKā mēs izmantojam informāciju\n- Atbildēt uz kopienas pieprasījumiem\n- Kopīgot informāciju par pasākumiem un kopienas jaunumiem\n- Uzlabot tīmekļa vietnes darbību\n\nDatu kopīgošana\nMēs nepārdodam personisko informāciju. Mēs kopīgojam informāciju tikai tad, ja to pieprasa likums, vai ar uzticamiem pakalpojumu sniedzējiem, kas nepieciešami DLA pakalpojumu nodrošināšanai.\n\nJūsu tiesības\nJums ir tiesības pieprasīt piekļuvi jebkurai personiskajai informācijai, ko mēs glabājam par jums, vai pieprasīt jūsu personiskās informācijas labošanu vai dzēšanu.\n\nSaziņa\nJa jums ir jautājumi par privātumu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.'
    },
    {
      slug: 'terms',
      adminTitle: 'Terms & Conditions',
      enTitle: 'Terms & Conditions',
      enContent: 'Welcome to the Latvian Association of Darwin (DLA) website. By accessing or using this website, you agree to comply with and be bound by these Terms & Conditions.\n\nWebsite Content\nAll content, branding, images, and materials on this website are the intellectual property of the Latvian Association of Darwin, unless otherwise stated. You may not reproduce, distribute, or reuse any materials without our prior written permission.\n\nUse of Website\nYou agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else\'s use and enjoyment of the website.\n\nThird-Party Links\nOur website may contain links to external websites. DLA is not responsible for the content, privacy policies, or practices of any third-party websites.\n\nLimitation of Liability\nWhile we strive to keep information accurate and up-to-date, DLA makes no representations or warranties of any kind about the completeness, accuracy, or availability of the website content. Your use of this website is at your own risk.\n\nContact\nIf you have any questions about these Terms & Conditions, please contact us at hello@darwinlatvians.org.',
      lvTitle: 'Lietošanas noteikumi',
      lvContent: 'Laipni lūdzam Dārvinas Latviešu Apvienības (DLA) tīmekļa vietnē. Piekļūstot šai vietnei vai izmantojot to, jūs piekrītat ievērot šos lietošanas noteikumus.\n\nVietnes saturs\nViss saturs, zīmols, attēli un materiāli šajā vietnē ir Dārvinas Latviešu Apvienības intelektuālais īpašums, ja vien nav norādīts citādi. Jūs nedrīkstat reproducēt, izplatīt vai atkārtoti izmantot nekādus materiālus bez mūsu iepriekšējas rakstiskas atļaujas.\n\nVietnes izmantošana\nJūs piekrītat izmantot šo vietni tikai likumīgiem mērķiem un tādā veidā, kas nepārkāpj citu personu tiesības, neierobežo un nekavē vietnes izmantošanu.\n\nTrešo pušu saites\nMūsu vietnē var būt saites uz ārējām vietnēm. DLA neatbild par trešo pušu vietņu saturu, privātuma politikām vai praksi.\n\nAtbildības ierobežojums\nLai gan mēs cenšamies nodrošināt informācijas precizitāti, DLA nesniedz nekādas garantijas par vietnes satura pilnīgumu vai pieejamību. Vietnes izmantošana ir uz jūsu pašu risku.\n\nSaziņa\nJa jums ir jautājumi par šiem lietošanas noteikumiem, lūdzu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.'
    },
    {
      slug: 'eula',
      adminTitle: 'EULA',
      enTitle: 'End User License Agreement (EULA)',
      enContent: 'This End User License Agreement ("Agreement") is a legal agreement between you and the Latvian Association of Darwin (DLA) for the use of this website and any digital services provided through it.\n\nLicense Grant\nDLA grants you a personal, non-exclusive, non-transferable, revocable license to access and use this website solely for personal, non-commercial purposes in accordance with this Agreement.\n\nRestrictions\nYou agree not to:\n- Modify, decompile, or reverse engineer any part of the website.\n- Use the website to distribute malware, spam, or unlawful content.\n- Scrap or systematically extract data from the website without our permission.\n\nTermination\nThis license is effective until terminated. DLA reserves the right to suspend or terminate your access to the website at any time without notice if you violate this Agreement.\n\nGoverning Law\nThis Agreement is governed by the laws of the Northern Territory, Australia.\n\nContact\nFor any questions regarding this EULA, please contact us at hello@darwinlatvians.org.',
      lvTitle: 'Gala lietotāja licences līgums (EULA)',
      lvContent: 'Šis Gala lietotāja licences līgums ("Līgums") ir juridisks līgums starp jums un Dārvinas Latviešu Apvienību (DLA) par šīs vietnes un ar tās starpniecību sniegto digitālo pakalpojumu izmantošanu.\n\nLicences piešķiršana\nDLA piešķir jums personisku, neekskluzīvu, nenododamu un atsaucamu licenci, lai piekļūtu vietnei un izmantotu to personiskiem, nekomerciāliem mērķiem saskaņā ar šo Līgumu.\n\nIerobežojumi\nJūs piekrītat:\n- Nepārveidot un neveikt vietnes daļu reversās inženierijas procesus.\n- Neizmantot vietni ļaunprogrammatūras, mēstuļu vai nelikumīga satura izplatīšanai.\n- Neveikt automātisku datu ieguvi no vietnes bez mūsu atļaujas.\n\nIzbeigšana\nŠī licence ir spēkā līdz tās izbeigšanai. DLA patur tiesības jebkurā laikā bez brīdinājuma apturēt vai izbeigt jūsu piekļuvi vietnei, ja pārkāpjat šo Līgumu.\n\nPiemērojamie tiesību akti\nŠo Līgumu reglamentē Ziemeļu Teritorijas (Austrālija) tiesību akti.\n\nSaziņa\nJa jums ir jautājumi par šo EULA, lūdzu, sazinieties ar mums pa e-pastu hello@darwinlatvians.org.'
    }
  ]

  for (const [order, page] of specialPages.entries()) {
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
      ${order + 1},
      ${page.adminTitle},
      ${page.slug},
      ${page.enTitle},
      ${page.enContent},
      ${page.lvTitle},
      ${page.lvContent},
      'published'
    );`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`special_pages\`;`)
  await db.run(sql`DROP TABLE \`_special_pages_v\`;`)
  await db.run(sql`DROP TABLE \`footer_items\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`pages_id\` integer,
  	\`events_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "pages_id", "events_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "pages_id", "events_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`en_explore_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`en_explore_title\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`en_explore_intro\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`lv_explore_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`lv_explore_title\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`lv_explore_intro\`;`)
}
