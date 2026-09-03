import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { fallbackPages } from '../lib/pages'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_hero\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`_path\` text NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`en_eyebrow\` text,
    \`en_heading\` text,
    \`en_text\` text,
    \`lv_eyebrow\` text,
    \`lv_heading\` text,
    \`lv_text\` text,
    \`image_id\` integer,
    \`alignment\` text DEFAULT 'left',
    \`block_name\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_hero_image_idx\` ON \`pages_blocks_hero\` (\`image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_blocks_content\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`_path\` text NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`en_heading\` text,
    \`en_body\` text,
    \`lv_heading\` text,
    \`lv_body\` text,
    \`image_id\` integer,
    \`image_position\` text DEFAULT 'right',
    \`tone\` text DEFAULT 'plain',
    \`block_name\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_content_order_idx\` ON \`pages_blocks_content\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_content_parent_id_idx\` ON \`pages_blocks_content\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_content_path_idx\` ON \`pages_blocks_content\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_content_image_idx\` ON \`pages_blocks_content\` (\`image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_en_buttons\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` text NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`label\` text,
    \`link\` text,
    \`variant\` text DEFAULT 'primary',
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_cta_en_buttons_order_idx\` ON \`pages_blocks_cta_en_buttons\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_cta_en_buttons_parent_id_idx\` ON \`pages_blocks_cta_en_buttons\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_blocks_cta_lv_buttons\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` text NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`label\` text,
    \`link\` text,
    \`variant\` text DEFAULT 'primary',
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_cta_lv_buttons_order_idx\` ON \`pages_blocks_cta_lv_buttons\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_cta_lv_buttons_parent_id_idx\` ON \`pages_blocks_cta_lv_buttons\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_blocks_cta\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`_path\` text NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`en_heading\` text,
    \`en_text\` text,
    \`lv_heading\` text,
    \`lv_text\` text,
    \`block_name\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_blocks_cta_order_idx\` ON \`pages_blocks_cta\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_blocks_cta_parent_id_idx\` ON \`pages_blocks_cta\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_path_idx\` ON \`pages_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`admin_title\` text,
    \`slug\` text,
    \`order\` numeric DEFAULT 10,
    \`en_title\` text,
    \`en_excerpt\` text,
    \`lv_title\` text,
    \`lv_excerpt\` text,
    \`meta_title\` text,
    \`meta_description\` text,
    \`meta_image_id\` integer,
    \`meta_no_index\` integer DEFAULT false,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft',
    FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`_path\` text NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`en_eyebrow\` text,
    \`en_heading\` text,
    \`en_text\` text,
    \`lv_eyebrow\` text,
    \`lv_heading\` text,
    \`lv_text\` text,
    \`image_id\` integer,
    \`alignment\` text DEFAULT 'left',
    \`_uuid\` text,
    \`block_name\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_hero_order_idx\` ON \`_pages_v_blocks_hero\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_hero_parent_id_idx\` ON \`_pages_v_blocks_hero\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_hero_path_idx\` ON \`_pages_v_blocks_hero\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_hero_image_idx\` ON \`_pages_v_blocks_hero\` (\`image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_content\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`_path\` text NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`en_heading\` text,
    \`en_body\` text,
    \`lv_heading\` text,
    \`lv_body\` text,
    \`image_id\` integer,
    \`image_position\` text DEFAULT 'right',
    \`tone\` text DEFAULT 'plain',
    \`_uuid\` text,
    \`block_name\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_content_order_idx\` ON \`_pages_v_blocks_content\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_content_parent_id_idx\` ON \`_pages_v_blocks_content\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_content_path_idx\` ON \`_pages_v_blocks_content\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_content_image_idx\` ON \`_pages_v_blocks_content\` (\`image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_en_buttons\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`label\` text,
    \`link\` text,
    \`variant\` text DEFAULT 'primary',
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_en_buttons_order_idx\` ON \`_pages_v_blocks_cta_en_buttons\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_en_buttons_parent_id_idx\` ON \`_pages_v_blocks_cta_en_buttons\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta_lv_buttons\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`label\` text,
    \`link\` text,
    \`variant\` text DEFAULT 'primary',
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_cta\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_lv_buttons_order_idx\` ON \`_pages_v_blocks_cta_lv_buttons\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_lv_buttons_parent_id_idx\` ON \`_pages_v_blocks_cta_lv_buttons\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`_path\` text NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`en_heading\` text,
    \`en_text\` text,
    \`lv_heading\` text,
    \`lv_text\` text,
    \`_uuid\` text,
    \`block_name\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_order_idx\` ON \`_pages_v_blocks_cta\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_parent_id_idx\` ON \`_pages_v_blocks_cta\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_blocks_cta_path_idx\` ON \`_pages_v_blocks_cta\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_admin_title\` text,
    \`version_slug\` text,
    \`version_order\` numeric DEFAULT 10,
    \`version_en_title\` text,
    \`version_en_excerpt\` text,
    \`version_lv_title\` text,
    \`version_lv_excerpt\` text,
    \`version_meta_title\` text,
    \`version_meta_description\` text,
    \`version_meta_image_id\` integer,
    \`version_meta_no_index\` integer DEFAULT false,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`latest\` integer,
    \`autosave\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v\` (\`version_meta_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`key\` text NOT NULL,
    \`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`pages_id\` integer REFERENCES pages(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`,
  )

  for (const [pageIndex, page] of fallbackPages.entries()) {
    const pageID = pageIndex + 1
    await db.run(sql`INSERT INTO \`pages\` (
      \`id\`,
      \`admin_title\`,
      \`slug\`,
      \`order\`,
      \`en_title\`,
      \`en_excerpt\`,
      \`lv_title\`,
      \`lv_excerpt\`,
      \`meta_title\`,
      \`meta_description\`,
      \`meta_no_index\`,
      \`_status\`
    ) VALUES (
      ${pageID},
      ${page.en.title},
      ${page.slug},
      ${page.order},
      ${page.en.title},
      ${page.en.excerpt},
      ${page.lv.title},
      ${page.lv.excerpt},
      ${page.meta.title || page.en.title},
      ${page.meta.description || page.en.excerpt},
      false,
      'published'
    );`)

    for (const [blockIndex, enBlock] of page.layout.en.entries()) {
      const lvBlock = page.layout.lv[blockIndex]
      if (!lvBlock) continue
      const blockID = `page-${pageID}-${enBlock.blockType}-${blockIndex}`

      if (enBlock.blockType === 'hero' && lvBlock.blockType === 'hero') {
        await db.run(sql`INSERT INTO \`pages_blocks_hero\` (
          \`_order\`,
          \`_parent_id\`,
          \`_path\`,
          \`id\`,
          \`en_eyebrow\`,
          \`en_heading\`,
          \`en_text\`,
          \`lv_eyebrow\`,
          \`lv_heading\`,
          \`lv_text\`,
          \`alignment\`
        ) VALUES (
          ${blockIndex},
          ${pageID},
          'layout',
          ${blockID},
          ${enBlock.eyebrow ?? null},
          ${enBlock.heading ?? null},
          ${enBlock.text ?? null},
          ${lvBlock.eyebrow ?? null},
          ${lvBlock.heading ?? null},
          ${lvBlock.text ?? null},
          ${enBlock.alignment || 'left'}
        );`)
      }

      if (enBlock.blockType === 'content' && lvBlock.blockType === 'content') {
        await db.run(sql`INSERT INTO \`pages_blocks_content\` (
          \`_order\`,
          \`_parent_id\`,
          \`_path\`,
          \`id\`,
          \`en_heading\`,
          \`en_body\`,
          \`lv_heading\`,
          \`lv_body\`,
          \`image_position\`,
          \`tone\`
        ) VALUES (
          ${blockIndex},
          ${pageID},
          'layout',
          ${blockID},
          ${enBlock.heading ?? null},
          ${enBlock.body ?? null},
          ${lvBlock.heading ?? null},
          ${lvBlock.body ?? null},
          ${enBlock.imagePosition || 'right'},
          ${enBlock.tone || 'plain'}
        );`)
      }

      if (enBlock.blockType === 'cta' && lvBlock.blockType === 'cta') {
        await db.run(sql`INSERT INTO \`pages_blocks_cta\` (
          \`_order\`,
          \`_parent_id\`,
          \`_path\`,
          \`id\`,
          \`en_heading\`,
          \`en_text\`,
          \`lv_heading\`,
          \`lv_text\`
        ) VALUES (
          ${blockIndex},
          ${pageID},
          'layout',
          ${blockID},
          ${enBlock.heading ?? null},
          ${enBlock.text ?? null},
          ${lvBlock.heading ?? null},
          ${lvBlock.text ?? null}
        );`)

        for (const [buttonIndex, button] of (enBlock.buttons || []).entries()) {
          await db.run(sql`INSERT INTO \`pages_blocks_cta_en_buttons\` (
            \`_order\`, \`_parent_id\`, \`id\`, \`label\`, \`link\`, \`variant\`
          ) VALUES (
            ${buttonIndex},
            ${blockID},
            ${`${blockID}-en-button-${buttonIndex}`},
            ${button.label},
            ${button.link},
            ${button.variant || 'primary'}
          );`)
        }

        for (const [buttonIndex, button] of (lvBlock.buttons || []).entries()) {
          await db.run(sql`INSERT INTO \`pages_blocks_cta_lv_buttons\` (
            \`_order\`, \`_parent_id\`, \`id\`, \`label\`, \`link\`, \`variant\`
          ) VALUES (
            ${buttonIndex},
            ${blockID},
            ${`${blockID}-lv-button-${buttonIndex}`},
            ${button.label},
            ${button.link},
            ${button.variant || 'primary'}
          );`)
        }
      }
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_en_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta_lv_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_content\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_en_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta_lv_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`users_id\` integer,
    \`media_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id" FROM \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  )
}
