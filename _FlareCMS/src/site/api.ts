// Tiny fetch + reading helpers for the public site. The whole site is driven
// by the 13 fixed `posts` records (plus events), fetched from the Pages API on
// the same origin.

import { useCallback, useEffect, useState } from "react";

import type { SiteRecord } from "../contentTypes";

export const LANGS = ["en", "lv"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string | undefined | null): value is Lang {
  return value === "en" || value === "lv";
}

export async function fetchSiteRecords(): Promise<SiteRecord[]> {
  const response = await fetch("/api/posts?type=page");
  if (!response.ok) {
    throw new Error(`Could not load site content (${response.status})`);
  }
  const body = (await response.json()) as { items: SiteRecord[] };
  return body.items;
}

// Module-level cache: every public component (layout, homepage, pages,
// events) reads the same record list, so it is fetched at most once per
// session and invalidated after a short TTL or an explicit reload.
let cache: { at: number; promise: Promise<SiteRecord[]> } | null = null;
const CACHE_TTL_MS = 60_000;

export function getSiteRecords(force = false): Promise<SiteRecord[]> {
  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.promise;
  }
  const promise = fetchSiteRecords().catch((error) => {
    if (cache?.promise === promise) cache = null;
    throw error;
  });
  cache = { at: Date.now(), promise };
  return promise;
}

export interface UseSiteRecords {
  records: SiteRecord[] | null;
  error: string;
  loading: boolean;
  reload: () => void;
}

export function useSiteRecords(): UseSiteRecords {
  const [records, setRecords] = useState<SiteRecord[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback((force: boolean) => {
    setError("");
    if (!force) {
      const existing = cache;
      if (!existing) {
        setRecords(null);
      }
    } else {
      setRecords(null);
    }
    getSiteRecords(force)
      .then((items) => setRecords(items))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const reload = useCallback(() => load(true), [load]);
  return { records, error, loading: !error && records === null, reload };
}

export function findRecord(records: SiteRecord[], slug: string | undefined): SiteRecord | undefined {
  if (!slug) return undefined;
  return records.find((record) => record.slug === slug);
}

export function recordByTemplate(
  records: SiteRecord[],
  template: SiteRecord["template"]
): SiteRecord[] {
  return records.filter((record) => record.template === template);
}

// Runtime readers for fields that only exist on some template shapes.
function objectValue(obj: unknown, key: string): unknown {
  if (typeof obj !== "object" || obj === null) return undefined;
  if (!(key in obj)) return undefined;
  return (obj as Record<string, unknown>)[key]; // key presence verified above
}

export function readString(obj: unknown, key: string, fallback = ""): string {
  const value = objectValue(obj, key);
  return typeof value === "string" ? value : fallback;
}

export function readBoolean(obj: unknown, key: string, fallback = false): boolean {
  const value = objectValue(obj, key);
  return typeof value === "boolean" ? value : fallback;
}

export function readNullableId(obj: unknown, key: string): string | null {
  const value = objectValue(obj, key);
  return typeof value === "string" && value ? value : null;
}

/** Resolves a media row id to its public URL, with a static image fallback. */
export function mediaSrc(id: string | null | undefined, fallback = "/images/img1.webp"): string {
  return id ? `/api/assets/${id}` : fallback;
}

/**
 * Localizes an href to a language. Mirrors the production behaviour: anchors,
 * mailto/tel links and external URLs are left untouched; paths already
 * prefixed with /en or /lv are rewritten in place; anything else gets the
 * language prefix.
 */
export function localizeHref(href: string, lang: Lang): string {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("//") ||
    /^[a-z][a-z\d+.-]*:/i.test(href)
  ) {
    return href;
  }
  const normalized = href.startsWith("/") ? href : `/${href}`;
  const segments = normalized.split("/");
  if (isLang(segments[1] ?? "")) {
    segments[1] = lang;
    return segments.join("/");
  }
  return `/${lang}${normalized === "/" ? "" : normalized}`;
}

/** Parses an event date value; invalid or missing values return null. */
export function parseEventDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Events are past when their date (end of day) is before now. */
export function isEventPast(value: unknown): boolean {
  const date = parseEventDate(value);
  if (!date) return false;
  date.setHours(23, 59, 59, 999);
  return date.getTime() < Date.now();
}

/** Human date for an event in the active language (production formats per locale). */
export function formatEventDate(value: unknown, lang: Lang): string | null {
  const date = parseEventDate(value);
  if (!date) return null;
  return date.toLocaleDateString(lang === "lv" ? "lv-LV" : "en-AU", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
