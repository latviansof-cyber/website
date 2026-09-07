import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { media } from "../schema";
import { jwtAuthenication } from "../auth";

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

/** Streams the R2 object for the given media id. Public. */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const key = params.id as string;

  const object = (await env.BUCKET.get(key, {
    range: request.headers,
  })) as R2ObjectBody | null;
  if (!object) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("cache-control", "public, max-age=31536000");
  if (object.range) {
    const range = object.range as {
      offset: number;
      length: number;
      end: number;
    };
    const end = range.end ?? object.size - 1;
    headers.set("content-range", `bytes ${range.offset}-${end}/${object.size}`);
  }
  const status = request.headers.get("range") !== null ? 206 : 200;
  return new Response(object.body, { headers, status });
};

/** Updates only the bilingual alt text of a media row. */
export const onRequestPatch: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;

  if (!jwtAuthenication(context)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = drizzle(env.DB);
  const items = await db.select().from(media).where(eq(media.id, params.id as string)).all();
  if (items.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const set: Record<string, unknown> = {};
  if (body.altEn !== undefined) {
    if (typeof body.altEn !== "string")
      return Response.json({ error: '"altEn" must be text' }, { status: 400 });
    set.altEn = body.altEn;
  }
  if (body.altLv !== undefined) {
    if (typeof body.altLv !== "string")
      return Response.json({ error: '"altLv" must be text' }, { status: 400 });
    set.altLv = body.altLv;
  }
  if (Object.keys(set).length === 0) {
    return Response.json({ error: "Nothing to update" }, { status: 400 });
  }

  const result = await db.update(media).set(set).where(eq(media.id, params.id as string)).execute();
  if (!result.success) {
    return Response.json({ error: result.error }, { status: 500 });
  }
  const updated = await db.select().from(media).where(eq(media.id, params.id as string)).all();
  return Response.json(updated[0]);
};

/** Removes the R2 object and the media row. */
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;

  if (!jwtAuthenication(context)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = drizzle(env.DB);
  const items = await db.select().from(media).where(eq(media.id, params.id as string)).all();
  if (items.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await env.BUCKET.delete(items[0].id);
  await db.delete(media).where(eq(media.id, items[0].id)).execute();
  return new Response(null, { status: 204 });
};
