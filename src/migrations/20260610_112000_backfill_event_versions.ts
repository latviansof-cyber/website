import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`
    INSERT INTO \`_events_v\` (
      \`parent_id\`,
      \`version_admin_title\`,
      \`version_slug\`,
      \`version_order\`,
      \`version_accent_tone\`,
      \`version_image_id\`,
      \`version_en_title\`,
      \`version_en_body\`,
      \`version_lv_title\`,
      \`version_lv_body\`,
      \`version_updated_at\`,
      \`version_created_at\`,
      \`version__status\`,
      \`created_at\`,
      \`updated_at\`,
      \`latest\`,
      \`autosave\`
    )
    SELECT
      events.id,
      events.admin_title,
      events.slug,
      events.\`order\`,
      events.accent_tone,
      events.image_id,
      events.en_title,
      events.en_body,
      events.lv_title,
      events.lv_body,
      events.updated_at,
      events.created_at,
      events._status,
      events.created_at,
      events.updated_at,
      true,
      false
    FROM events
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`_events_v\`
      WHERE \`_events_v\`.parent_id = events.id
        AND \`_events_v\`.latest = true
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`
    DELETE FROM \`_events_v\`
    WHERE latest = true
      AND autosave = false
      AND EXISTS (
        SELECT 1
        FROM events
        WHERE events.id = \`_events_v\`.parent_id
          AND events.updated_at = \`_events_v\`.updated_at
          AND events.slug = \`_events_v\`.version_slug
      );
  `)
}
