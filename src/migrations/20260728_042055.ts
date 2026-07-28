import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`events\` ADD \`event_date\` text;`)
  await db.run(sql`ALTER TABLE \`events\` ADD \`is_past\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_events_v\` ADD \`version_event_date\` text;`)
  await db.run(sql`ALTER TABLE \`_events_v\` ADD \`version_is_past\` integer DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`event_date\`;`)
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`is_past\`;`)
  await db.run(sql`ALTER TABLE \`_events_v\` DROP COLUMN \`version_event_date\`;`)
  await db.run(sql`ALTER TABLE \`_events_v\` DROP COLUMN \`version_is_past\`;`)
}
