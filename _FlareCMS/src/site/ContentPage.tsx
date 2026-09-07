import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { SiteRecord } from "../contentTypes";
import {
  findRecord,
  isLang,
  mediaSrc,
  readBoolean,
  readString,
  useSiteRecords,
  type Lang,
} from "./api";
import { applyMetadata } from "./metadata";
import NotFoundPage from "./NotFoundPage";
import { SmartLink } from "./SiteLayout";

function contentOf(record: SiteRecord | undefined, lang: Lang) {
  if (!record) return {};
  const value = record[lang === "en" ? "contentEn" : "contentLv"];
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>; // language content from our own API
  }
  return {};
}

/** Static hero fallbacks per content slug (mirrors the production starter pages). */
const HERO_FALLBACKS: Record<string, string> = {
  history: "/images/gathering2.jpg",
  community: "/images/img1.webp",
  membership: "/images/membership-welcome.webp",
  culture: "/images/culture.png",
};

/**
 * `content` template renderer — history, community, membership, culture.
 * Mirrors the production content-page layout: hero band with title and
 * excerpt, prose body, optional call-to-action card.
 */
export function ContentPage() {
  const { lang: rawLang, slug } = useParams();
  const { records, error, loading, reload } = useSiteRecords();

  const lang = isLang(rawLang) ? (rawLang as Lang) : undefined;
  const record = records ? findRecord(records, slug) : undefined;

  useEffect(() => {
    if (!lang || !record) return;
    const content = contentOf(record, lang);
    const title = readString(content, "title") || "Page";
    const metaTitle = readString(content, "metaTitle");
    const metaDescription = readString(content, "metaDescription");
    applyMetadata({
      lang,
      title: metaTitle || `${title} | Latvian Association of Darwin`,
      description: metaDescription || readString(content, "excerpt") || undefined,
      canonicalPath: `/${lang}/${record.slug ?? ""}`,
      noIndex: readBoolean(record.settings, "noIndex"),
      ogType: "website",
    });
  }, [lang, record, slug]);

  if (!lang) return <NotFoundPage />;

  if (error || loading) {
    return (
      <main id="main" className="state-block">
        {error ? (
          <>
            <p>
              Could not load this page. <code>{error}</code>
            </p>
            <button type="button" className="btn btn-gold" onClick={reload}>
              Try again
            </button>
          </>
        ) : (
          <>
            <div className="spinner" aria-hidden="true" />
            <p>Loading…</p>
          </>
        )}
      </main>
    );
  }

  if (!record) return <NotFoundPage />;

  const content = contentOf(record, lang);
  const title = readString(content, "title") || "Untitled";
  const excerpt = readString(content, "excerpt");
  const body = readString(content, "body");
  const ctaLabel = readString(content, "ctaLabel");
  const ctaHref = readString(record.settings, "ctaHref");
  const imageId = record.settings;
  const imageValue =
    typeof imageId === "object" && imageId !== null && "imageId" in imageId
      ? imageId.imageId
      : null;
  const imageSrc = mediaSrc(
    typeof imageValue === "string" ? imageValue : null,
    HERO_FALLBACKS[record.slug ?? ""] ?? "/images/img1.webp"
  );
  const isLatvian = lang === "lv";

  return (
    <main id="main" className="bg-cream text-ink">
      <section className="content-hero">
        <div className="bg-image">
          <img src={imageSrc} alt="" loading="eager" />
        </div>
        <div className="container">
          <div className="content-hero-inner">
            <div className="eyebrow eyebrow-tone-amber">
              <span>{isLatvian ? "Dārvinas Latviešu Apvienība" : "Latvian Association of Darwin"}</span>
            </div>
            <h1>{title}</h1>
            {excerpt && <p>{excerpt}</p>}
          </div>
        </div>
      </section>

      {body && (
        <section className="content-section">
          <div className="container">
            <div className="prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {ctaLabel && ctaHref && (
        <section className="cta-band">
          <div className="container">
            <div className="cta-card">
              <div className="cta-inner">
                <div className="cta-text">
                  <span className="cta-kicker">
                    {isLatvian ? "Iesaisties kopienā" : "Get Involved"}
                  </span>
                  <h2>{title}</h2>
                </div>
                <div className="cta-actions">
                  <SmartLink href={ctaHref} lang={lang} className="btn btn-white">
                    {ctaLabel} →
                  </SmartLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
