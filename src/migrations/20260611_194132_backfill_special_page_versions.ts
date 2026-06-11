import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`
    INSERT INTO \`_special_pages_v\` (
      \`parent_id\`,
      \`version_admin_title\`,
      \`version_slug\`,
      \`version_en_title\`,
      \`version_en_content\`,
      \`version_lv_title\`,
      \`version_lv_content\`,
      \`version_updated_at\`,
      \`version_created_at\`,
      \`version__status\`,
      \`created_at\`,
      \`updated_at\`,
      \`latest\`,
      \`autosave\`
    )
    SELECT
      special_pages.id,
      special_pages.admin_title,
      special_pages.slug,
      special_pages.en_title,
      special_pages.en_content,
      special_pages.lv_title,
      special_pages.lv_content,
      special_pages.updated_at,
      special_pages.created_at,
      special_pages._status,
      special_pages.created_at,
      special_pages.updated_at,
      true,
      false
    FROM special_pages
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`_special_pages_v\`
      WHERE \`_special_pages_v\`.parent_id = special_pages.id
        AND \`_special_pages_v\`.latest = true
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`
    DELETE FROM \`_special_pages_v\`
    WHERE latest = true
      AND autosave = false
      AND EXISTS (
        SELECT 1
        FROM special_pages
        WHERE special_pages.id = \`_special_pages_v\`.parent_id
          AND special_pages.updated_at = \`_special_pages_v\`.updated_at
          AND special_pages.slug = \`_special_pages_v\`.version_slug
      );
  `)
}
