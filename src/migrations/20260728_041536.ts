import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`donation_settings_priority_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`en_title\` text NOT NULL,
  	\`en_body\` text NOT NULL,
  	\`lv_title\` text NOT NULL,
  	\`lv_body\` text NOT NULL,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`donation_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`donation_settings_priority_links_order_idx\` ON \`donation_settings_priority_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`donation_settings_priority_links_parent_id_idx\` ON \`donation_settings_priority_links\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`donation_settings_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`en_label\` text NOT NULL,
  	\`lv_label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`donation_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`donation_settings_features_order_idx\` ON \`donation_settings_features\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`donation_settings_features_parent_id_idx\` ON \`donation_settings_features\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`donation_settings_donation_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`amount\` numeric NOT NULL,
  	\`en_body\` text NOT NULL,
  	\`lv_body\` text NOT NULL,
  	\`url\` text,
  	\`new_tab\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`donation_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`donation_settings_donation_options_order_idx\` ON \`donation_settings_donation_options\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`donation_settings_donation_options_parent_id_idx\` ON \`donation_settings_donation_options\` (\`_parent_id\`);`,
  )
  await db.run(sql`INSERT INTO \`donation_settings_priority_links\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`en_title\`, \`en_body\`, \`lv_title\`, \`lv_body\`, \`new_tab\`)
    SELECT 1, \`id\`, 'cultural-events', 'Cultural Events',
      'Funding for continuity of language, heritage, and community celebrations like Jāņi and Lieldienas.',
      'Kultūras pasākumi',
      'Finansējums valodas, mantojuma un kopienas svētku, piemēram, Jāņu un Lieldienu, nepārtrauktībai.',
      false
    FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_priority_links\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`en_title\`, \`en_body\`, \`lv_title\`, \`lv_body\`, \`new_tab\`)
    SELECT 2, \`id\`, 'community-stability', 'Community Stability',
      'Help with hall rentals, equipment, and resources for our regular gatherings.',
      'Kopienas stabilitāte',
      'Palīdzība ar telpu īri, aprīkojumu un resursiem mūsu regulārajām tikšanās reizēm.',
      false
    FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_priority_links\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`en_title\`, \`en_body\`, \`lv_title\`, \`lv_body\`, \`new_tab\`)
    SELECT 3, \`id\`, 'emergency-relief', 'Emergency relief',
      'Immediate support for members of our community facing unexpected hardships.',
      'Ārkārtas palīdzība',
      'Tūlītējs atbalsts mūsu kopienas locekļiem, kuri saskaras ar neparedzētām grūtībām.',
      false
    FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_features\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`en_label\`, \`lv_label\`)
    SELECT 1, \`id\`, 'secure-checkout', 'Secure checkout', 'Droši maksājumi' FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_features\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`en_label\`, \`lv_label\`)
    SELECT 2, \`id\`, 'zero-fees', 'Zero fees via PayID', 'Bez komisijas maksas caur PayID' FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_features\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`en_label\`, \`lv_label\`)
    SELECT 3, \`id\`, 'direct-to-community', 'Direct to community', 'Tieši kopienai' FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_donation_options\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`amount\`, \`en_body\`, \`lv_body\`, \`new_tab\`)
    SELECT 1, \`id\`, 'amount-10', 10,
      'Helps with transport assistance or a community meal contribution.',
      'Palīdz ar transporta izdevumiem vai kopienas maltītes organizēšanu.', true
    FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_donation_options\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`amount\`, \`en_body\`, \`lv_body\`, \`new_tab\`)
    SELECT 2, \`id\`, 'amount-25', 25,
      'Covers materials for one cultural workshop or language class.',
      'Nosedz materiālu izmaksas vienai kultūras darbnīcai vai valodas nodarbībai.', true
    FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_donation_options\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`amount\`, \`en_body\`, \`lv_body\`, \`new_tab\`)
    SELECT 3, \`id\`, 'amount-50', 50,
      'Supports essential supplies for our major community events.',
      'Atbalsta nepieciešamos krājumus mūsu lielākajiem kopienas pasākumiem.', true
    FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_donation_options\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`amount\`, \`en_body\`, \`lv_body\`, \`new_tab\`)
    SELECT 4, \`id\`, 'amount-100', 100,
      'Funds hall hire for a regular community gathering or choir practice.',
      'Finansē telpu īri regulārai kopienas sanāksmei vai kora mēģinājumam.', true
    FROM \`donation_settings\`;`)
  await db.run(sql`INSERT INTO \`donation_settings_donation_options\`
    (\`_order\`, \`_parent_id\`, \`id\`, \`amount\`, \`en_body\`, \`lv_body\`, \`new_tab\`)
    SELECT 5, \`id\`, 'amount-250', 250,
      'Contributes significantly to our annual national day celebrations.',
      'Ievērojami veicina mūsu ikgadējo nacionālo svētku organizēšanu.', true
    FROM \`donation_settings\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`donation_settings_priority_links\`;`)
  await db.run(sql`DROP TABLE \`donation_settings_features\`;`)
  await db.run(sql`DROP TABLE \`donation_settings_donation_options\`;`)
}
