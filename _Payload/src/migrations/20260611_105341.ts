import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_order_idx\` ON \`site_settings_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_parent_id_idx\` ON \`site_settings_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`en_association_name\` text NOT NULL,
  	\`en_tagline\` text,
  	\`en_contact_email\` text,
  	\`lv_association_name\` text NOT NULL,
  	\`lv_tagline\` text,
  	\`lv_contact_email\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`donation_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`en_bank_name\` text NOT NULL,
  	\`en_bsb\` text NOT NULL,
  	\`en_account_number\` text NOT NULL,
  	\`en_account_name\` text NOT NULL,
  	\`en_pay_id\` text,
  	\`en_instructions\` text,
  	\`lv_bank_name\` text NOT NULL,
  	\`lv_bsb\` text NOT NULL,
  	\`lv_account_number\` text NOT NULL,
  	\`lv_account_name\` text NOT NULL,
  	\`lv_pay_id\` text,
  	\`lv_instructions\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`ALTER TABLE \`special_pages\` ADD \`meta_en_title\` text;`)
  await db.run(sql`ALTER TABLE \`special_pages\` ADD \`meta_en_description\` text;`)
  await db.run(sql`ALTER TABLE \`special_pages\` ADD \`meta_lv_title\` text;`)
  await db.run(sql`ALTER TABLE \`special_pages\` ADD \`meta_lv_description\` text;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` ADD \`version_meta_en_title\` text;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` ADD \`version_meta_en_description\` text;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` ADD \`version_meta_lv_title\` text;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` ADD \`version_meta_lv_description\` text;`)
  await db.run(sql`INSERT INTO \`site_settings\` (
    \`id\`,
    \`en_association_name\`,
    \`en_tagline\`,
    \`en_contact_email\`,
    \`lv_association_name\`,
    \`lv_tagline\`,
    \`lv_contact_email\`,
    \`updated_at\`,
    \`created_at\`
  ) VALUES (
    1,
    'Latvian Association of Darwin',
    'Dārvinas Latviešu Apvienība',
    'hello@darwinlatvians.org',
    'Dārvinas Latviešu Apvienība',
    'Latvian Association of Darwin',
    'hello@darwinlatvians.org',
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  );`)
  await db.run(sql`INSERT INTO \`donation_settings\` (
    \`id\`,
    \`en_bank_name\`,
    \`en_bsb\`,
    \`en_account_number\`,
    \`en_account_name\`,
    \`en_pay_id\`,
    \`en_instructions\`,
    \`lv_bank_name\`,
    \`lv_bsb\`,
    \`lv_account_number\`,
    \`lv_account_name\`,
    \`lv_pay_id\`,
    \`lv_instructions\`,
    \`updated_at\`,
    \`created_at\`
  ) VALUES (
    1,
    'Not configured',
    'Not configured',
    'Not configured',
    'Latvian Association of Darwin',
    'Not configured',
    'Enter the verified association bank account and PayID details before accepting donations.',
    'Nav konfigurēts',
    'Nav konfigurēts',
    'Nav konfigurēts',
    'Dārvinas Latviešu Apvienība',
    'Nav konfigurēts',
    'Pirms ziedojumu pieņemšanas ievadiet pārbaudītu apvienības bankas kontu un PayID informāciju.',
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  );`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_social_links\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`donation_settings\`;`)
  await db.run(sql`ALTER TABLE \`special_pages\` DROP COLUMN \`meta_en_title\`;`)
  await db.run(sql`ALTER TABLE \`special_pages\` DROP COLUMN \`meta_en_description\`;`)
  await db.run(sql`ALTER TABLE \`special_pages\` DROP COLUMN \`meta_lv_title\`;`)
  await db.run(sql`ALTER TABLE \`special_pages\` DROP COLUMN \`meta_lv_description\`;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` DROP COLUMN \`version_meta_en_title\`;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` DROP COLUMN \`version_meta_en_description\`;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` DROP COLUMN \`version_meta_lv_title\`;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` DROP COLUMN \`version_meta_lv_description\`;`)
}
