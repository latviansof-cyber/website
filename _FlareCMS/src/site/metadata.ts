// Client-side route metadata: document.title, description, canonical URL,
// Open Graph fields and robots, applied whenever the route or language
// changes. Canonical URLs follow the evaluation hostname (location.origin).

import type { Lang } from "./api";

export interface MetaOptions {
  lang: Lang;
  title: string;
  description?: string;
  /** Path on the current origin, e.g. "/en/about". */
  canonicalPath: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
  ogImage?: string | null;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export function applyMetadata(options: MetaOptions): void {
  const { lang, title, description, canonicalPath, noIndex, ogType = "website", ogImage } = options;
  const absolute = (path: string) => new URL(path, window.location.origin).toString();

  document.title = title;
  upsertLink("canonical", absolute(canonicalPath));
  if (description) upsertMeta("name", "description", description);

  const image = ogImage ? absolute(ogImage) : absolute("/images/img1.webp");
  const locale = lang === "lv" ? "lv_LV" : "en_AU";
  const alternate = lang === "lv" ? "en_AU" : "lv_LV";
  const ogUrl = absolute(canonicalPath);

  upsertMeta("property", "og:type", ogType);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:url", ogUrl);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:locale", locale);
  upsertMeta("property", "og:locale:alternate", alternate);
  upsertMeta("property", "og:site_name", "Latvian Association of Darwin");
  if (description) upsertMeta("property", "og:description", description);

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:image", image);
  if (description) upsertMeta("name", "twitter:description", description);

  const robots = noIndex ? "noindex, nofollow" : "index, follow";
  upsertMeta("name", "robots", robots);
}
