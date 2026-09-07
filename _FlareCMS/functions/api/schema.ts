import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const postTemplates = [
  "content",
  "simple",
  "home",
  "event",
  "navigation",
  "footer",
  "site",
  "donate",
] as const;
export type PostTemplate = (typeof postTemplates)[number];

export const posts = sqliteTable(
  "posts",
  {
    rowid: integer("rowid").primaryKey(),
    published: integer("published")
      .notNull()
      .default(sql`(ROUND(unixepoch('subsec') * 1000))`),
    updated: integer("updated")
      .notNull()
      .default(sql`(ROUND(unixepoch('subsec') * 1000))`),
    type: text("type").$type<"post" | "page">().notNull().default("post"),
    status: text("status")
      .$type<"publish" | "draft">()
      .notNull()
      .default("publish"),
    // Legacy columns kept for backward compatibility. Real content lives in
    // the structured JSON columns below; `title`/`content` mirror the English
    // title/body because SQLite cannot drop columns simply.
    title: text("title").notNull(),
    content: text("content").notNull(),
    slug: text("slug"),
    template: text("template")
      .$type<PostTemplate>()
      .notNull()
      .default("content"),
    sortOrder: integer("sortOrder").notNull().default(10),
    contentEn: text("contentEn").notNull().default("{}"),
    contentLv: text("contentLv").notNull().default("{}"),
    settings: text("settings").notNull().default("{}"),
  },
  (table) => {
    return {
      typeStatusPublishedIdIdx: index("typeStatusPublishedIdIdx").on(
        table.type,
        table.status,
        table.published,
        table.rowid
      ),
      postsSlugIdx: uniqueIndex("postsSlugIdx").on(table.slug),
      postsTemplateOrderIdx: index("postsTemplateOrderIdx").on(
        table.template,
        table.sortOrder
      ),
    };
  }
);

export const labels = sqliteTable(
  "labels",
  {
    postId: integer("postId")
      .notNull()
      .references(() => posts.rowid, {
        onDelete: "cascade",
      }),
    name: text("name").notNull(),
  },
  (table) => {
    return {
      idNameIdx: index("idNameIdx").on(table.postId, table.name),
      nameIdx: index("nameIdx").on(table.name),
    };
  }
);

export const replies = sqliteTable(
  "replies",
  {
    rowid: integer("rowid").primaryKey(),
    published: integer("published")
      .notNull()
      .default(sql`(ROUND(unixepoch('subsec') * 1000))`),
    content: text("content").notNull(),
    postId: integer("postId")
      .notNull()
      .references(() => posts.rowid, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      postIdIdx: index("postIdIdx").on(table.postId),
    };
  }
);

export const options = sqliteTable("options", {
  key: text("key").primaryKey().notNull(),
  value: text("value").notNull(),
});

export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey().notNull(),
    filename: text("filename").notNull(),
    mimeType: text("mimeType").notNull(),
    size: integer("size").notNull(),
    altEn: text("altEn").notNull().default(""),
    altLv: text("altLv").notNull().default(""),
    createdAt: integer("createdAt").notNull(),
  },
  (table) => {
    return {
      mediaCreatedAtIdx: index("mediaCreatedAtIdx").on(table.createdAt),
    };
  }
);
