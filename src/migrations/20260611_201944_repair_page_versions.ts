import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Deleted pages leave versions with a null parent because of ON DELETE SET NULL.
  await db.run(sql`
    DELETE FROM \`_pages_v\`
    WHERE parent_id IS NULL;
  `)

  await db.run(sql`
    INSERT INTO \`_pages_v\` (
      \`parent_id\`,
      \`version_admin_title\`,
      \`version_slug\`,
      \`version_order\`,
      \`version_en_title\`,
      \`version_en_excerpt\`,
      \`version_lv_title\`,
      \`version_lv_excerpt\`,
      \`version_meta_title\`,
      \`version_meta_description\`,
      \`version_meta_image_id\`,
      \`version_meta_no_index\`,
      \`version_updated_at\`,
      \`version_created_at\`,
      \`version__status\`,
      \`created_at\`,
      \`updated_at\`,
      \`latest\`,
      \`autosave\`
    )
    SELECT
      pages.id,
      pages.admin_title,
      pages.slug,
      pages.\`order\`,
      pages.en_title,
      pages.en_excerpt,
      pages.lv_title,
      pages.lv_excerpt,
      pages.meta_title,
      pages.meta_description,
      pages.meta_image_id,
      pages.meta_no_index,
      pages.updated_at,
      pages.created_at,
      pages._status,
      pages.created_at,
      pages.updated_at,
      true,
      false
    FROM pages
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`_pages_v\`
      WHERE \`_pages_v\`.parent_id = pages.id
        AND \`_pages_v\`.latest = true
    );
  `)

  await db.run(sql`
    INSERT INTO \`_pages_v_blocks_hero\` (
      \`_order\`,
      \`_parent_id\`,
      \`_path\`,
      \`en_eyebrow\`,
      \`en_heading\`,
      \`en_text\`,
      \`lv_eyebrow\`,
      \`lv_heading\`,
      \`lv_text\`,
      \`image_id\`,
      \`alignment\`,
      \`_uuid\`,
      \`block_name\`
    )
    SELECT
      block.\`_order\`,
      version.id,
      'version.layout',
      block.en_eyebrow,
      block.en_heading,
      block.en_text,
      block.lv_eyebrow,
      block.lv_heading,
      block.lv_text,
      block.image_id,
      block.alignment,
      block.id,
      block.block_name
    FROM pages_blocks_hero AS block
    INNER JOIN \`_pages_v\` AS version
      ON version.parent_id = block.\`_parent_id\`
      AND version.latest = true
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`_pages_v_blocks_hero\`
      WHERE \`_pages_v_blocks_hero\`.\`_parent_id\` = version.id
        AND \`_pages_v_blocks_hero\`.\`_uuid\` = block.id
    );
  `)

  await db.run(sql`
    INSERT INTO \`_pages_v_blocks_content\` (
      \`_order\`,
      \`_parent_id\`,
      \`_path\`,
      \`en_heading\`,
      \`en_body\`,
      \`lv_heading\`,
      \`lv_body\`,
      \`image_id\`,
      \`image_position\`,
      \`tone\`,
      \`_uuid\`,
      \`block_name\`
    )
    SELECT
      block.\`_order\`,
      version.id,
      'version.layout',
      block.en_heading,
      block.en_body,
      block.lv_heading,
      block.lv_body,
      block.image_id,
      block.image_position,
      block.tone,
      block.id,
      block.block_name
    FROM pages_blocks_content AS block
    INNER JOIN \`_pages_v\` AS version
      ON version.parent_id = block.\`_parent_id\`
      AND version.latest = true
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`_pages_v_blocks_content\`
      WHERE \`_pages_v_blocks_content\`.\`_parent_id\` = version.id
        AND \`_pages_v_blocks_content\`.\`_uuid\` = block.id
    );
  `)

  await db.run(sql`
    INSERT INTO \`_pages_v_blocks_cta\` (
      \`_order\`,
      \`_parent_id\`,
      \`_path\`,
      \`en_heading\`,
      \`en_text\`,
      \`lv_heading\`,
      \`lv_text\`,
      \`_uuid\`,
      \`block_name\`
    )
    SELECT
      block.\`_order\`,
      version.id,
      'version.layout',
      block.en_heading,
      block.en_text,
      block.lv_heading,
      block.lv_text,
      block.id,
      block.block_name
    FROM pages_blocks_cta AS block
    INNER JOIN \`_pages_v\` AS version
      ON version.parent_id = block.\`_parent_id\`
      AND version.latest = true
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`_pages_v_blocks_cta\`
      WHERE \`_pages_v_blocks_cta\`.\`_parent_id\` = version.id
        AND \`_pages_v_blocks_cta\`.\`_uuid\` = block.id
    );
  `)

  await db.run(sql`
    INSERT INTO \`_pages_v_blocks_cta_en_buttons\` (
      \`_order\`,
      \`_parent_id\`,
      \`label\`,
      \`link\`,
      \`variant\`,
      \`_uuid\`
    )
    SELECT
      button.\`_order\`,
      version_block.id,
      button.label,
      button.link,
      button.variant,
      button.id
    FROM pages_blocks_cta_en_buttons AS button
    INNER JOIN \`_pages_v_blocks_cta\` AS version_block
      ON version_block.\`_uuid\` = button.\`_parent_id\`
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`_pages_v_blocks_cta_en_buttons\`
      WHERE \`_pages_v_blocks_cta_en_buttons\`.\`_parent_id\` = version_block.id
        AND \`_pages_v_blocks_cta_en_buttons\`.\`_uuid\` = button.id
    );
  `)

  await db.run(sql`
    INSERT INTO \`_pages_v_blocks_cta_lv_buttons\` (
      \`_order\`,
      \`_parent_id\`,
      \`label\`,
      \`link\`,
      \`variant\`,
      \`_uuid\`
    )
    SELECT
      button.\`_order\`,
      version_block.id,
      button.label,
      button.link,
      button.variant,
      button.id
    FROM pages_blocks_cta_lv_buttons AS button
    INNER JOIN \`_pages_v_blocks_cta\` AS version_block
      ON version_block.\`_uuid\` = button.\`_parent_id\`
    WHERE NOT EXISTS (
      SELECT 1
      FROM \`_pages_v_blocks_cta_lv_buttons\`
      WHERE \`_pages_v_blocks_cta_lv_buttons\`.\`_parent_id\` = version_block.id
        AND \`_pages_v_blocks_cta_lv_buttons\`.\`_uuid\` = button.id
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`
    DELETE FROM \`_pages_v\`
    WHERE version_slug IN ('history', 'community', 'membership')
      AND latest = true
      AND autosave = false;
  `)
}
