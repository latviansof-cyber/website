import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { fallbackHomepage } from '../lib/homepage'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`homepage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`en_hero_eyebrow\` text NOT NULL,
  	\`en_hero_title\` text NOT NULL,
  	\`en_hero_subtitle\` text NOT NULL,
  	\`en_hero_primary_label\` text NOT NULL,
  	\`en_hero_secondary_label\` text NOT NULL,
  	\`en_events_title\` text NOT NULL,
  	\`en_events_intro\` text NOT NULL,
  	\`lv_hero_eyebrow\` text NOT NULL,
  	\`lv_hero_title\` text NOT NULL,
  	\`lv_hero_subtitle\` text NOT NULL,
  	\`lv_hero_primary_label\` text NOT NULL,
  	\`lv_hero_secondary_label\` text NOT NULL,
  	\`lv_events_title\` text NOT NULL,
  	\`lv_events_intro\` text NOT NULL,
  	\`hero_image_id\` integer,
  	\`hero_primary_href\` text DEFAULT '#events' NOT NULL,
  	\`hero_secondary_href\` text DEFAULT '/about' NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_hero_image_idx\` ON \`homepage\` (\`hero_image_id\`);`)
  await db.run(sql`INSERT INTO \`homepage\` (
    \`id\`,
    \`en_hero_eyebrow\`,
    \`en_hero_title\`,
    \`en_hero_subtitle\`,
    \`en_hero_primary_label\`,
    \`en_hero_secondary_label\`,
    \`en_events_title\`,
    \`en_events_intro\`,
    \`lv_hero_eyebrow\`,
    \`lv_hero_title\`,
    \`lv_hero_subtitle\`,
    \`lv_hero_primary_label\`,
    \`lv_hero_secondary_label\`,
    \`lv_events_title\`,
    \`lv_events_intro\`,
    \`hero_primary_href\`,
    \`hero_secondary_href\`,
    \`updated_at\`,
    \`created_at\`
  ) VALUES (
    1,
    ${fallbackHomepage.en.heroEyebrow},
    ${fallbackHomepage.en.heroTitle},
    ${fallbackHomepage.en.heroSubtitle},
    ${fallbackHomepage.en.heroPrimaryLabel},
    ${fallbackHomepage.en.heroSecondaryLabel},
    ${fallbackHomepage.en.eventsTitle},
    ${fallbackHomepage.en.eventsIntro},
    ${fallbackHomepage.lv.heroEyebrow},
    ${fallbackHomepage.lv.heroTitle},
    ${fallbackHomepage.lv.heroSubtitle},
    ${fallbackHomepage.lv.heroPrimaryLabel},
    ${fallbackHomepage.lv.heroSecondaryLabel},
    ${fallbackHomepage.lv.eventsTitle},
    ${fallbackHomepage.lv.eventsIntro},
    ${fallbackHomepage.heroPrimaryHref},
    ${fallbackHomepage.heroSecondaryHref},
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  );`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`homepage\`;`)
}
