/**
 * migrate-payload-content.ts
 *
 * Copies the live Payload site content (latviansofdarwin.org.au) into the
 * FlareCMS evaluation database as `page` rows in the local `posts` table,
 * plus uploads referenced images to the attached R2 bucket through the
 * FlareCMS assets API.
 *
 * Usage:
 *   npx tsx scripts/migrate-payload-content.ts \
 *     --payload-dir /tmp/flare-migrate \
 *     --base http://localhost:8788 \
 *     --admin admin --pass secret123
 *
 * Add `--remote` to write to the deployed evaluation D1 database instead of
 * the local one (requires the real D1 database id in wrangler.jsonc and
 * CLOUDFLARE_API_TOKEN in .env.local).
 *
 * The script is idempotent: it deletes all `page` rows and all media rows
 * (and their R2 objects) before inserting fresh data.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

type ArgMap = Record<string, string>;

function parseArgs(argv: string[]): ArgMap {
  const out: ArgMap = {};
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        out[key] = "true";
      } else {
        out[key] = next;
        i += 1;
      }
    }
  }
  return out;
}

const args = parseArgs(process.argv);
const payloadDir = args["payload-dir"] ?? "/tmp/flare-migrate";
const base = args.base ?? "http://localhost:8788";
const admin = args.admin ?? "admin";
const pass = args.pass ?? "secret123";
const remote = args.remote === "true";

function loadJson(name: string): unknown {
  const path = join(payloadDir, name);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    throw new Error(`Cannot read payload snapshot ${path}: ${String(err)}`);
  }
}

function asRecord(v: unknown): Record<string, unknown> {
  if (typeof v === "object" && v !== null && !Array.isArray(v)) {
    return v as Record<string, unknown>;
  }
  return {};
}

function str(v: unknown): string {
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  return "";
}

/** Guarded reader: no casts on unknown shapes. */
function get(obj: unknown, key: string): unknown {
  const rec = asRecord(obj);
  return key in rec ? rec[key] : undefined;
}

function langObj(obj: unknown, lang: string): Record<string, unknown> {
  const rec = asRecord(obj);
  const group = rec[lang];
  return asRecord(group);
}

function findDoc(list: unknown, predicate: (doc: Record<string, unknown>) => boolean): Record<string, unknown> | undefined {
  const docs = Array.isArray(list) ? list : [];
  for (const raw of docs) {
    const doc = asRecord(raw);
    if (predicate(doc)) return doc;
  }
  return undefined;
}

// ---------------------------------------------------------------- HTTP bits

async function apiJson(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const res = await fetch(`${base}${path}`, init);
  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${path}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

let token = "";

async function login(): Promise<void> {
  const res = await apiJson("/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ adminUsername: admin, adminPassword: pass }),
  });
  token = str(res.token);
  if (!token) throw new Error("Login succeeded but no token returned");
  console.log(`logged in as ${admin}`);
}

// ------------------------------------------------------------------ helpers

function htmlToMarkdown(html: string): string {
  let s = html;
  // Escaped iframes (Payload stores them HTML-entity escaped).
  s = s.replace(/&lt;iframe[\s\S]*?&lt;\/iframe&gt;/gi, (m: string) => {
    const m2 = m.match(/src=(?:&quot;|"|')(https?:[^&"'?]+)/i);
    return m2 ? `\n\n[Watch the video](${m2[1]})\n\n` : "";
  });
  s = s.replace(/<iframe[^>]*src=["'](https?:[^"']+)["'][^>]*><\/iframe>/gi, (_m: string, u: string) => `\n\n[Watch the video](${u})\n\n`);
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_m: string, lvl: string, inner: string) => `\n\n${"#".repeat(Number(lvl))} ${stripTags(inner).trim()}\n\n`);
  s = s.replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**");
  s = s.replace(/<b>([\s\S]*?)<\/b>/gi, "**$1**");
  s = s.replace(/<em>([\s\S]*?)<\/em>/gi, "_$1_");
  s = s.replace(/<a [^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m: string, inner: string) => `- ${stripTags(inner).trim()}\n`);
  s = s.replace(/<\/?[uo]l[^>]*>/gi, "\n");
  s = s.replace(/<\/p>/gi, "\n\n");
  s = s.replace(/<p[^>]*>/gi, "");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<img [^>]*alt=["']([^"']*)["'][^>]*>/gi, (_m: string, alt: string) => `![${alt}]()`);
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&#39;/g, "'");
  s = stripTags(s);
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

function sqlStr(v: string): string {
  return v.replace(/'/g, "''");
}

type Row = {
  slug: string;
  template: string;
  sortOrder: number;
  title: string;
  content: string;
  contentEn: string;
  contentLv: string;
  settings: string;
};

// ------------------------------------------------------------- media upload

async function uploadMedia(
  prodId: string,
  filename: string,
  prodUrl: string,
  alt: string
): Promise<string> {
  const fileRes = await fetch(`https://latviansofdarwin.org.au${prodUrl}`);
  if (!fileRes.ok) throw new Error(`Fetch media ${prodUrl}: HTTP ${fileRes.status}`);
  const bytes = await fileRes.arrayBuffer();
  if (bytes.byteLength > 10 * 1024 * 1024) {
    throw new Error(`Media ${filename} exceeds 10 MB; cannot migrate it`);
  }
  const contentType = fileRes.headers.get("content-type") ?? "image/jpeg";
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: contentType }), filename);
  const created = await apiJson("/api/assets", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const localId = str(created.id);
  if (!localId) throw new Error(`Media upload returned no id for ${filename}`);
  await apiJson(`/api/assets/${localId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ altEn: alt, altLv: "" }),
  });
  return localId;
}

async function purgeMedia(): Promise<void> {
  const list = await apiJson("/api/assets");
  const items = Array.isArray(list.items) ? list.items : [];
  for (const raw of items) {
    const item = asRecord(raw);
    const id = str(item.id);
    if (!id) continue;
    const res = await fetch(`${base}/api/assets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok && res.status !== 404) {
      throw new Error(`Delete media ${id}: HTTP ${res.status}`);
    }
  }
  console.log(`purged ${items.length} media row(s)`);
}

// ------------------------------------------------------------ row builders

function buildRows(snapshots: Record<string, unknown>): Row[] {
  const rows: Row[] = [];
  const now = Date.now();
  const mediaDocs = get(snapshots.media, "docs");
  const mediaAlt = (prodId: unknown): string => {
    const doc = findDoc(mediaDocs, (d) => str(d.id) === String(prodId));
    return doc ? str(get(doc, "alt")) : "";
  };

  // site ---------------------------------------------------------------
  const siteSettings = asRecord(get(snapshots, "site-settings"));
  const siteEn = langObj(siteSettings, "en");
  const siteLv = langObj(siteSettings, "lv");
  const socialLinks = Array.isArray(siteSettings.socialLinks)
    ? siteSettings.socialLinks
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
        .map((item) => ({ platform: str(item.platform), url: str(item.url) }))
    : [];
  rows.push({
    slug: "site",
    template: "site",
    sortOrder: 10,
    title: str(siteEn.associationName) || "site",
    content: "",
    contentEn: JSON.stringify({
      associationName: str(siteEn.associationName),
      tagline: str(siteEn.tagline),
      contactEmail: str(siteEn.contactEmail),
    }),
    contentLv: JSON.stringify({
      associationName: str(siteLv.associationName),
      tagline: str(siteLv.tagline),
      contactEmail: str(siteLv.contactEmail),
    }),
    settings: JSON.stringify({ socialLinks }),
  });

  // navigation ----------------------------------------------------------
  const menu = asRecord(get(snapshots, "main-menu"));
  const menuItems = Array.isArray(menu.items)
    ? menu.items
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
        .map((item) => ({
          en: { label: str(item.en), href: str(item.href), newTab: item.newTab === true },
          lv: { label: str(item.lv), href: str(item.href), newTab: item.newTab === true },
        }))
    : [];
  rows.push({
    slug: "navigation",
    template: "navigation",
    sortOrder: 20,
    title: "Navigation",
    content: "",
    contentEn: JSON.stringify({ items: menuItems.map((m) => m.en) }),
    contentLv: JSON.stringify({ items: menuItems.map((m) => m.lv) }),
    settings: "{}",
  });

  // footer ---------------------------------------------------------------
  const footer = asRecord(get(snapshots, "footer"));
  const footerEn = langObj(footer, "en");
  const footerLv = langObj(footer, "lv");
  const footerItems = Array.isArray(footer.items)
    ? footer.items
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
        .map((item) => ({
          en: { label: str(item.en), href: str(item.href), newTab: item.newTab === true },
          lv: { label: str(item.lv), href: str(item.href), newTab: item.newTab === true },
        }))
    : [];
  rows.push({
    slug: "footer",
    template: "footer",
    sortOrder: 30,
    title: "Footer",
    content: "",
    contentEn: JSON.stringify({
      tagline: str(footerEn.tagline),
      address: str(footerEn.address),
      rights: str(footerEn.rights),
      items: footerItems.map((m) => m.en),
    }),
    contentLv: JSON.stringify({
      tagline: str(footerLv.tagline),
      address: str(footerLv.address),
      rights: str(footerLv.rights),
      items: footerItems.map((m) => m.lv),
    }),
    settings: "{}",
  });

  // home ----------------------------------------------------------------
  const home = asRecord(get(snapshots, "homepage"));
  const homeEn = langObj(home, "en");
  const homeLv = langObj(home, "lv");
  const heroImage = asRecord(get(home, "heroImage"));
  const heroImageId = str(heroImage.id) || null;
  rows.push({
    slug: "home",
    template: "home",
    sortOrder: 40,
    title: str(homeEn.heroTitle) || "Home",
    content: "",
    contentEn: JSON.stringify({
      heroEyebrow: str(homeEn.heroEyebrow),
      heroTitle: str(homeEn.heroTitle),
      heroSubtitle: str(homeEn.heroSubtitle),
      heroPrimaryLabel: str(homeEn.heroPrimaryLabel),
      heroSecondaryLabel: str(homeEn.heroSecondaryLabel),
      eventsTitle: str(homeEn.eventsTitle),
      eventsIntro: str(homeEn.eventsIntro),
      exploreEyebrow: str(homeEn.exploreEyebrow),
      exploreTitle: str(homeEn.exploreTitle),
      exploreIntro: str(homeEn.exploreIntro),
    }),
    contentLv: JSON.stringify({
      heroEyebrow: str(homeLv.heroEyebrow),
      heroTitle: str(homeLv.heroTitle),
      heroSubtitle: str(homeLv.heroSubtitle),
      heroPrimaryLabel: str(homeLv.heroPrimaryLabel),
      heroSecondaryLabel: str(homeLv.heroSecondaryLabel),
      eventsTitle: str(homeLv.eventsTitle),
      eventsIntro: str(homeLv.eventsIntro),
      exploreEyebrow: str(homeLv.exploreEyebrow),
      exploreTitle: str(homeLv.exploreTitle),
      exploreIntro: str(homeLv.exploreIntro),
    }),
    settings: JSON.stringify({
      heroImageId,
      heroPrimaryHref: str(get(home, "heroPrimaryHref")) || "#events",
      heroSecondaryHref: str(get(home, "heroSecondaryHref")) || "/about",
    }),
  });

  // donate --------------------------------------------------------------
  const donate = asRecord(get(snapshots, "donation-settings"));
  const donateEn = langObj(donate, "en");
  const donateLv = langObj(donate, "lv");
  const features = Array.isArray(donate.features)
    ? donate.features
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    : [];
  const priorityLinks = Array.isArray(donate.priorityLinks)
    ? donate.priorityLinks
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    : [];
  const donationOptions = Array.isArray(donate.donationOptions)
    ? donate.donationOptions
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    : [];
  rows.push({
    slug: "donate",
    template: "donate",
    sortOrder: 50,
    title: "Donate",
    content: "",
    contentEn: JSON.stringify({
      title: "Donate",
      introduction: "",
      bankName: str(donateEn.bankName),
      bsb: str(donateEn.bsb),
      accountNumber: str(donateEn.accountNumber),
      accountName: str(donateEn.accountName),
      payId: str(donateEn.payId),
      instructions: htmlToMarkdown(str(donateEn.instructions)),
      features: features.map((f) => str(f.enLabel)),
      priorityCards: priorityLinks.map((p) => ({
        title: str(p.enTitle),
        body: str(p.enBody),
        url: str(p.url),
        newTab: p.newTab === true,
      })),
      donationCards: donationOptions.map((o) => ({
        amount: typeof o.amount === "number" ? o.amount : 0,
        body: str(o.enBody),
        url: str(o.url),
        newTab: o.newTab === true,
      })),
    }),
    contentLv: JSON.stringify({
      title: "Ziedot",
      introduction: "",
      bankName: str(donateLv.bankName),
      bsb: str(donateLv.bsb),
      accountNumber: str(donateLv.accountNumber),
      accountName: str(donateLv.accountName),
      payId: str(donateLv.payId),
      instructions: htmlToMarkdown(str(donateLv.instructions)),
      features: features.map((f) => str(f.lvLabel)),
      priorityCards: priorityLinks.map((p) => ({
        title: str(p.lvTitle),
        body: str(p.lvBody),
        url: str(p.url),
        newTab: p.newTab === true,
      })),
      donationCards: donationOptions.map((o) => ({
        amount: typeof o.amount === "number" ? o.amount : 0,
        body: str(o.lvBody),
        url: str(o.url),
        newTab: o.newTab === true,
      })),
    }),
    settings: "{}",
  });

  // simple pages from special-pages collection ---------------------------
  const spDocs = get(snapshots.specialPages, "docs");
  if (Array.isArray(spDocs)) {
    let n = 0;
    for (const raw of spDocs) {
      const doc = asRecord(raw);
      const en = langObj(doc, "en");
      const lv = langObj(doc, "lv");
      const meta = asRecord(get(doc, "meta"));
      const metaEn = langObj(meta, "en");
      const metaLv = langObj(meta, "lv");
      rows.push({
        slug: str(doc.slug) || `simple-${n}`,
        template: "simple",
        sortOrder: 60 + n,
        title: str(en.title) || str(doc.slug) || `simple-${n}`,
        content: str(en.content),
        contentEn: JSON.stringify({
          title: str(en.title),
          body: str(en.content),
          metaTitle: str(get(metaEn, "title")) || str(en.title),
          metaDescription: str(get(metaEn, "description")) || "",
        }),
        contentLv: JSON.stringify({
          title: str(lv.title),
          body: str(lv.content),
          metaTitle: str(get(metaLv, "title")) || str(lv.title),
          metaDescription: str(get(metaLv, "description")) || "",
        }),
        settings: JSON.stringify({ noIndex: meta.noIndex === true }),
      });
      n += 1;
    }
  }

  // content pages from pages collection -----------------------------------
  const pageDocs = get(snapshots.pages, "docs");
  if (Array.isArray(pageDocs)) {
    let n = 0;
    for (const raw of pageDocs) {
      const doc = asRecord(raw);
      const en = langObj(doc, "en");
      const lv = langObj(doc, "lv");
      const meta = asRecord(get(doc, "meta"));
      const layout = Array.isArray(doc.layout) ? doc.layout : [];
      const heroBlock = layout
        .filter((b): b is Record<string, unknown> => typeof b === "object" && b !== null)
        .find((b) => str(b.blockType) === "hero");

      // Build markdown body from layout content blocks (regular pages) or
      // from the rich HTML body (news-style pages with an empty layout).
      const blocks: string[] = [];
      let ctaEnLabel = "";
      let ctaLvLabel = "";
      let ctaEnHref = "";
      let ctaLvHref = "";
      for (const block of layout.filter((b): b is Record<string, unknown> => typeof b === "object" && b !== null)) {
        const type = str(block.blockType);
        const bEn = langObj(block, "en");
        const bLv = langObj(block, "lv");
        if (type === "content") {
          const heading = str(bEn.heading);
          const headingLv = str(bLv.heading);
          const bodyEn = str(bEn.body);
          const bodyLv = str(bLv.body);
          const image = asRecord(get(block, "image"));
          const imageLine = str(image.id)
            ? `\n\n![${str(image.alt) || ""}](/api/assets/${str(image.id)})\n\n`
            : "";
          blocks.push(htmlToMarkdown(`${heading ? `## ${heading}\n\n` : ""}${bodyEn}${imageLine}`));
          blocks.push(htmlToMarkdown(`${headingLv ? `## ${headingLv}\n\n` : ""}${bodyLv}${imageLine}`));
        } else if (type === "cta") {
          const buttonsEn = Array.isArray(bEn.buttons) ? bEn.buttons : [];
          const buttonsLv = Array.isArray(bLv.buttons) ? bLv.buttons : [];
          const firstEn = buttonsEn.length > 0 ? asRecord(buttonsEn[0]) : {};
          const firstLv = buttonsLv.length > 0 ? asRecord(buttonsLv[0]) : {};
          ctaEnLabel = str(firstEn.label) || str(get(bEn, "heading")) || "";
          ctaLvLabel = str(firstLv.label) || str(get(bLv, "heading")) || "";
          ctaEnHref = str(firstEn.link) || "";
          ctaLvHref = str(firstLv.link) || "";
        }
      }

      const rawBodyEn = str(get(en, "body"));
      const rawBodyLv = str(get(lv, "body"));
      const bodyEn = blocks.length > 0 ? blocks.filter((_, i) => i % 2 === 0).join("\n\n") : htmlToMarkdown(rawBodyEn);
      const bodyLv = blocks.length > 0 ? blocks.filter((_, i) => i % 2 === 1).join("\n\n") : htmlToMarkdown(rawBodyLv);
      const heroImage = heroBlock ? asRecord(get(heroBlock, "image")) : {};
      const metaImage = asRecord(get(meta, "image"));
      const imageIdRaw = str(heroImage.id) || str(metaImage.id) || null;
      const excerpt = str(get(en, "excerpt")) || str(get(langObj(heroBlock ?? {}, "en"), "text")) || "";

      rows.push({
        slug: str(doc.slug) || `page-${n}`,
        template: "content",
        sortOrder: Number(str(doc.order)) || 100 + n,
        title: str(en.title) || str(doc.slug) || `page-${n}`,
        content: bodyEn,
        contentEn: JSON.stringify({
          title: str(en.title) || str(doc.slug) || `page-${n}`,
          excerpt,
          body: bodyEn,
          ctaLabel: ctaEnLabel,
          metaTitle: str(get(meta, "title")) || str(en.title) || "",
          metaDescription: str(get(meta, "description")) || excerpt,
        }),
        contentLv: JSON.stringify({
          title: str(lv.title) || str(doc.slug) || `page-${n}`,
          excerpt: str(get(lv, "excerpt")) || "",
          body: bodyLv,
          ctaLabel: ctaLvLabel,
          metaTitle: str(lv.title) || "",
          metaDescription: str(get(lv, "excerpt")) || "",
        }),
        settings: JSON.stringify({
          imageId: imageIdRaw,
          ctaHref: ctaEnHref || ctaLvHref,
          noIndex: meta.noIndex === true,
        }),
      });
      n += 1;
    }
  }

  // events -----------------------------------------------------------------
  const eventDocs = get(snapshots.events, "docs");
  if (Array.isArray(eventDocs)) {
    let n = 0;
    for (const raw of eventDocs) {
      const doc = asRecord(raw);
      const en = langObj(doc, "en");
      const lv = langObj(doc, "lv");
      const image = asRecord(get(doc, "image"));
      rows.push({
        slug: str(doc.slug) || `event-${n}`,
        template: "event",
        sortOrder: Number(str(doc.order)) || 100 + n,
        title: str(en.title) || str(doc.slug) || `event-${n}`,
        content: str(en.body),
        contentEn: JSON.stringify({ title: str(en.title), body: htmlToMarkdown(str(en.body)) }),
        contentLv: JSON.stringify({ title: str(lv.title), body: htmlToMarkdown(str(lv.body)) }),
        settings: JSON.stringify({
          eventDate: str(get(doc, "eventDate")),
          facebookUrl: str(get(doc, "facebookUrl")),
          imageId: str(image.id) || null,
          accentTone: str(get(doc, "accentTone")) || "emerald",
        }),
      });
      n += 1;
    }
  }

  return rows;
}

// -------------------------------------------------------------------- main

async function main(): Promise<void> {
  const snapshots: Record<string, unknown> = {
    "site-settings": loadJson("globals_site-settings_depth_10.json"),
    "main-menu": loadJson("globals_main-menu_depth_10.json"),
    footer: loadJson("globals_footer_depth_10.json"),
    homepage: loadJson("globals_homepage_depth_10.json"),
    "donation-settings": loadJson("globals_donation-settings_depth_10.json"),
    pages: loadJson("pages_depth_10&limit_100&sort_-updatedAt.json"),
    specialPages: loadJson("special-pages_depth_10&limit_100&sort_-updatedAt.json"),
    events: loadJson("events_depth_10&limit_200&sort_-eventDate.json"),
    media: loadJson("media_depth_1&limit_500&sort_-updatedAt.json"),
  };

  await login();

  // Media rows are refreshed on every run (R2 objects are orphaned but the
  // bucket is evaluation-only; a remote rerun keeps bucket growth bounded by
  // the few dozen images in the source site).
  await purgeMedia();

  // Collect prod media ids referenced by content rows.
  const mediaDocs = get(snapshots.media, "docs");
  const wanted = new Map<string, { filename: string; url: string; alt: string }>();
  const collect = (id: unknown): void => {
    const idStr = str(id);
    if (!idStr || wanted.has(idStr)) return;
    const doc = findDoc(mediaDocs, (d) => str(d.id) === idStr);
    if (!doc) return;
    const filename = str(get(doc, "filename")) || "image";
    const url = str(get(doc, "url"));
    if (!url) return;
    wanted.set(idStr, { filename, url, alt: str(get(doc, "alt")) });
  };

  const allRows = buildRows(snapshots);
  // Find every imageId referenced inside contentEn/contentLv/settings of the
  // generated rows by scanning the parsed source payloads directly.
  const homeGlobal = asRecord(get(snapshots, "homepage"));
  collect(get(asRecord(get(homeGlobal, "heroImage")), "id"));
  const pageDocs = get(snapshots.pages, "docs");
  if (Array.isArray(pageDocs)) {
    for (const raw of pageDocs) {
      const doc = asRecord(raw);
      const meta = asRecord(get(doc, "meta"));
      collect(get(asRecord(get(meta, "image")), "id"));
      const layout = Array.isArray(doc.layout) ? doc.layout : [];
      for (const block of layout.filter((b): b is Record<string, unknown> => typeof b === "object" && b !== null)) {
        collect(get(asRecord(get(block, "image")), "id"));
      }
    }
  }
  const eventDocs = get(snapshots.events, "docs");
  if (Array.isArray(eventDocs)) {
    for (const raw of eventDocs) {
      const doc = asRecord(raw);
      collect(get(asRecord(get(doc, "image")), "id"));
    }
  }

  const prodToLocal = new Map<string, string>();
  for (const [prodId, info] of wanted) {
    const localId = await uploadMedia(prodId, info.filename, info.url, info.alt);
    prodToLocal.set(prodId, localId);
    console.log(`media ${prodId} (${info.filename}) -> ${localId}`);
  }

  // Substitute local media ids into rows.
  for (const row of allRows) {
    if (row.settings.includes("imageId")) {
      const settings = JSON.parse(row.settings) as Record<string, unknown>;
      if (settings.imageId && typeof settings.imageId === "string" && prodToLocal.has(settings.imageId)) {
        settings.imageId = prodToLocal.get(settings.imageId);
      }
      row.settings = JSON.stringify(settings);
    }
    if (row.contentEn.includes("/api/assets/") || row.contentLv.includes("/api/assets/")) {
      for (const key of ["contentEn", "contentLv"] as const) {
        const parsed = JSON.parse(row[key]) as { body?: string };
        if (parsed.body) {
          parsed.body = parsed.body.replace(/\/api\/assets\/([\w-]+)/g, (_m: string, oldId: string) => {
            const mapped = prodToLocal.get(oldId);
            return mapped ? `/api/assets/${mapped}` : _m;
          });
          row[key] = JSON.stringify(parsed);
        }
      }
    }
  }

  // Build and run the SQL.
  const now = Date.now();
  const statements: string[] = ["DELETE FROM posts WHERE type='page';"];
  for (const row of allRows) {
    const slug = sqlStr(row.slug);
    const title = sqlStr(row.title);
    const content = sqlStr(row.content);
    const en = sqlStr(row.contentEn);
    const lv = sqlStr(row.contentLv);
    const settings = sqlStr(row.settings);
    statements.push(
      `INSERT INTO posts (published, updated, type, status, title, content, slug, template, sortOrder, contentEn, contentLv, settings) VALUES (${now}, ${now}, 'page', 'publish', '${title}', '${content}', '${slug}', '${row.template}', ${row.sortOrder}, '${en}', '${lv}', '${settings}');`
    );
  }
  const sqlPath = join(payloadDir, "migrate.sql");
  writeFileSync(sqlPath, statements.join("\n"), "utf8");

  const mode = remote ? "--remote" : "--local";
  const wranglerArgs = [
    "wrangler@4.128.0",
    "d1",
    "execute",
    "DB",
    mode,
    "--file",
    sqlPath,
  ];
  execFileSync("npx", wranglerArgs, {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  rmSync(sqlPath, { force: true });

  console.log(`\nMigrated ${allRows.length} page row(s), ${prodToLocal.size} media file(s).`);
  console.log(`Next: verify via GET ${base}/api/posts?type=page and browse the public site.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
