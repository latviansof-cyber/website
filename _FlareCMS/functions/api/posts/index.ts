import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { labels, posts } from "../schema";
import { jwtAuthenication } from "../auth";
import {
  parseJsonObject,
  validateContent,
  validateSettings,
} from "../content-validation";

interface Env {
  DB: D1Database;
}

function decoratePage(item: typeof posts.$inferSelect) {
  return {
    ...item,
    contentEn: parseJsonObject(item.contentEn),
    contentLv: parseJsonObject(item.contentLv),
    settings: parseJsonObject(item.settings),
  };
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const db = drizzle(env.DB);
  const searchParams = new URL(request.url).searchParams;
  const type = searchParams.get("type") as "post" | "page" | null;
  const status = searchParams.get("status") as "publish" | "draft" | null;

  if (type === "page") {
    // Site records: fixed pages, shared website content and events. Ordered by
    // sortOrder; the admin regroups them into sections and orders events by
    // their event date client-side.
    const items = await db
      .select()
      .from(posts)
      .where(
        and(eq(posts.type, "page"), status ? eq(posts.status, status) : eq(posts.status, "publish"))
      )
      .orderBy(asc(posts.sortOrder), desc(posts.published), asc(posts.rowid))
      .all();
    return Response.json({ items: items.map(decoratePage) });
  }

  // Legacy blog-style listing (posts, optional status filter).
  const baseQuery = db.select().from(posts);
  const conditions = [eq(posts.type, "post")];
  if (status) conditions.push(eq(posts.status, status));

  const items = await baseQuery
    .where(and(...conditions))
    .orderBy(desc(posts.published))
    .all();

  const postIds = items.map((item) => item.rowid);
  const postLabels = postIds.length
    ? await db
        .select({ name: labels.name, postId: labels.postId })
        .from(labels)
        .where(inArray(labels.postId, postIds))
        .all()
    : [];
  const postLabelsMap = postLabels.reduce((map, label) => {
    if (!map[label.postId]) map[label.postId] = [];
    map[label.postId].push(label.name);
    return map;
  }, {} as Record<string, string[]>);
  const result = items.map((item) =>
    Object.assign(decoratePage(item), { labels: postLabelsMap[item.rowid] || [] })
  );

  return Response.json({ items: result });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!jwtAuthenication(context)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = drizzle(env.DB);
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.template !== "event") {
    return Response.json(
      { error: "Only event records can be created; edit fixed site pages instead" },
      { status: 400 }
    );
  }

  const contentEn = body.contentEn;
  const contentLv = body.contentLv;
  const settings = body.settings ?? {};
  if (typeof contentEn !== "object" || contentEn === null || Array.isArray(contentEn)) {
    return Response.json({ error: "contentEn must be an object" }, { status: 400 });
  }
  if (typeof contentLv !== "object" || contentLv === null || Array.isArray(contentLv)) {
    return Response.json({ error: "contentLv must be an object" }, { status: 400 });
  }
  const contentError =
    validateContent("event", contentEn, contentLv) ||
    validateSettings("event", settings);
  if (contentError) {
    return Response.json({ error: contentError }, { status: 400 });
  }

  const contentEnRecord = contentEn as Record<string, unknown>;
  const contentLvRecord = contentLv as Record<string, unknown>;
  const enTitle = typeof contentEnRecord.title === "string" ? contentEnRecord.title : "";
  const enBody = typeof contentEnRecord.body === "string" ? contentEnRecord.body : "";

  try {
    const result = await db
      .insert(posts)
      .values({
        type: "page",
        status: "publish",
        template: "event",
        title: enTitle,
        content: enBody,
        contentEn: JSON.stringify(contentEnRecord),
        contentLv: JSON.stringify(contentLvRecord),
        settings: JSON.stringify(settings),
      })
      .returning({ rowid: posts.rowid })
      .execute();
    if (result.length) {
      return Response.json({ rowid: result[0].rowid });
    }
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Insert failed" },
      { status: 500 }
    );
  }
  return Response.json({ error: "Insert failed" }, { status: 500 });
};
