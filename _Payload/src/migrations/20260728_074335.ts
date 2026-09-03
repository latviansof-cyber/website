import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`events\` ADD \`facebook_url\` text;`)
  await db.run(sql`ALTER TABLE \`_events_v\` ADD \`version_facebook_url\` text;`)
  await db.run(sql`ALTER TABLE \`special_pages\` ADD \`meta_no_index\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` ADD \`version_meta_no_index\` integer DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`facebook_url\`;`)
  await db.run(sql`ALTER TABLE \`_events_v\` DROP COLUMN \`version_facebook_url\`;`)
  await db.run(sql`ALTER TABLE \`special_pages\` DROP COLUMN \`meta_no_index\`;`)
  await db.run(sql`ALTER TABLE \`_special_pages_v\` DROP COLUMN \`version_meta_no_index\`;`)
}
