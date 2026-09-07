import { desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { media } from "../schema";
import { jwtAuthenication } from "../auth";

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const maxSize = 10 * 1024 * 1024; // 10 MB

/** Lists media rows newest first. Public so page rendering can resolve alt text. */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  const db = drizzle(env.DB);
  const items = await db.select().from(media).orderBy(desc(media.createdAt)).all();
  return Response.json({ items });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (!jwtAuthenication(context)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Expected a multipart form upload" }, { status: 400 });
  }
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: 'Upload the image in a "file" form field' }, { status: 400 });
  }
  if (file.size === 0) {
    return Response.json({ error: "File is empty" }, { status: 400 });
  }
  if (file.size > maxSize) {
    return Response.json({ error: "File larger than 10 MB" }, { status: 400 });
  }
  const mimeType = file.type === "image/jpg" ? "image/jpeg" : file.type;
  if (!allowedMimeTypes.has(mimeType)) {
    return Response.json(
      { error: "Only JPEG, PNG, WebP, GIF and SVG images are allowed" },
      { status: 400 }
    );
  }

  const id = crypto.randomUUID();
  await env.BUCKET.put(id, file, {
    httpMetadata: {
      contentType: mimeType,
      cacheControl: "public, max-age=31536000",
    },
  });

  const db = drizzle(env.DB);
  const row = {
    id,
    filename: file.name || "image",
    mimeType,
    size: file.size,
    altEn: "",
    altLv: "",
    createdAt: Date.now(),
  };
  await db.insert(media).values(row).execute();
  return Response.json(row);
};
