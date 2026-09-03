import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`main_menu_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	\`en\` text NOT NULL,
  	\`lv\` text NOT NULL,
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`main_menu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`main_menu_items_order_idx\` ON \`main_menu_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`main_menu_items_parent_id_idx\` ON \`main_menu_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`main_menu\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`main_menu\` (
    \`id\`,
    \`updated_at\`,
    \`created_at\`
  ) VALUES (
    1,
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
    strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  );`)

  const items = [
    { href: '/about', en: 'About', lv: 'Par mums' },
    { href: '/history', en: 'History', lv: 'Vēsture' },
    { href: '/community', en: 'Community', lv: 'Kopiena' },
    { href: '/membership', en: 'Join', lv: 'Pievienoties' },
    { href: '/culture', en: 'Culture', lv: 'Kultūra' },
    { href: '/contact', en: 'Contact', lv: 'Kontakti' },
    { href: '/#events', en: 'Events', lv: 'Pasākumi' },
  ]

  for (const [order, item] of items.entries()) {
    await db.run(sql`INSERT INTO \`main_menu_items\` (
      \`_order\`,
      \`_parent_id\`,
      \`id\`,
      \`href\`,
      \`en\`,
      \`lv\`,
      \`new_tab\`
    ) VALUES (
      ${order + 1},
      1,
      ${`main-menu-item-${order + 1}`},
      ${item.href},
      ${item.en},
      ${item.lv},
      false
    );`)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`main_menu_items\`;`)
  await db.run(sql`DROP TABLE \`main_menu\`;`)
}
