import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD \`en_body\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`lv_body\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_en_body\` text;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_lv_body\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`en_body\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`lv_body\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_en_body\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_lv_body\`;`)
}
