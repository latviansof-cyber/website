import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { labels, posts, replies } from "../schema";
import { jwtAuthenication } from "../auth";
import {
  parseJsonObject,
  slugify,
  templates,
  validateContent,
  validateSettings,
} from "../content-validation";
import type { Template } from "../content-validation";

interface Env {
  DB: D1Database;
}

function decorate(item: typeof posts.$inferSelect) {
  return {
    ...item,
    contentEn: parseJsonObject(item.contentEn),
    contentLv: parseJsonObject(item.contentLv),
    settings: parseJsonObject(item.settings),
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function uniqueSlug(db: ReturnType<typeof drizzle>, base: string): Promise<string> {
  let candidate = base;
  let counter = 2;
  for (;;) {
    const existing = await db
      .select({ rowid: posts.rowid })
      .from(posts)
      .where(eq(posts.slug, candidate))
      .all();
    if (existing.length === 0) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  const key = parseInt(params.id as string);

  if (isNaN(key)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const db = drizzle(env.DB);
  const items = await db.select().from(posts).where(eq(posts.rowid, key));
  if (items.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const item = items[0];

  const postLabels = await db
    .select({ name: labels.name })
    .from(labels)
    .where(eq(labels.postId, item.rowid))
    .all();
  const postReplies = await db
    .select()
    .from(replies)
    .where(eq(replies.postId, item.rowid))
    .all();

  return Response.json({
    ...decorate(item),
    labels: postLabels.map((label) => label.name),
    replies: postReplies,
  });
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;

  if (!jwtAuthenication(context)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const postId = parseInt(params.id as string);
  if (isNaN(postId)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const db = drizzle(env.DB);
  const items = await db.select().from(posts).where(eq(posts.rowid, postId));
  if (items.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const current = items[0];
  const template = current.template as Template;
  if (!templates.includes(template)) {
    return Response.json({ error: "Unsupported record template" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Never let clients change the row identity, type or publish workflow.
  delete body.rowid;
  delete body.published;
  delete body.type;
  delete body.status;

  const next: Record<string, unknown> = { updated: new Date().getTime() };

  const enProvided = isObject(body.contentEn);
  const lvProvided = isObject(body.contentLv);
  const settingsProvided = isObject(body.settings);

  if (enProvided || lvProvided) {
    const mergedEn = enProvided ? body.contentEn : parseJsonObject(current.contentEn);
    const mergedLv = lvProvided ? body.contentLv : parseJsonObject(current.contentLv);
    const contentError = validateContent(template, mergedEn, mergedLv);
    if (contentError) {
      return Response.json({ error: contentError }, { status: 400 });
    }
  }
  if (settingsProvided) {
    const settingsError = validateSettings(template, body.settings);
    if (settingsError) {
      return Response.json({ error: settingsError }, { status: 400 });
    }
  }

  if (enProvided) {
    const enRecord = body.contentEn as Record<string, unknown>;
    next.contentEn = JSON.stringify(enRecord);
    // Legacy English title/content mirror columns.
    next.title = typeof enRecord.title === "string" ? enRecord.title : "";
    next.content = typeof enRecord.body === "string" ? enRecord.body : "";
  }
  if (lvProvided) {
    next.contentLv = JSON.stringify(body.contentLv);
  }
  if (settingsProvided) {
    next.settings = JSON.stringify(body.settings);
  }

  // Events get their public slug from the English title once, on first save.
  if (template === "event" && !current.slug) {
    const enRecord = enProvided
      ? (body.contentEn as Record<string, unknown>)
      : parseJsonObject(current.contentEn);
    const enTitle = typeof enRecord.title === "string" ? enRecord.title : "";
    next.slug = enTitle.trim() ? await uniqueSlug(db, slugify(enTitle)) : null;
  }

  try {
    const result = await db
      .update(posts)
      .set(next)
      .where(eq(posts.rowid, postId))
      .execute();
    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    );
  }

  const updatedItems = await db.select().from(posts).where(eq(posts.rowid, postId)).all();
  return Response.json(decorate(updatedItems[0]));
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;

  if (!jwtAuthenication(context)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const postId = parseInt(params.id as string);
  if (isNaN(postId)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const db = drizzle(env.DB);
  const items = await db.select().from(posts).where(eq(posts.rowid, postId));
  if (items.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  if (items[0].template !== "event") {
    return Response.json(
      { error: "Fixed site pages cannot be deleted; only events can be removed" },
      { status: 400 }
    );
  }

  await db.delete(labels).where(eq(labels.postId, postId)).execute();
  await db.delete(replies).where(eq(replies.postId, postId)).execute();
  await db.delete(posts).where(eq(posts.rowid, postId)).execute();

  return new Response(null, { status: 204 });
};
