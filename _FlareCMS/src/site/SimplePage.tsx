import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { SiteRecord } from "../contentTypes";
import {
  findRecord,
  isLang,
  readString,
  useSiteRecords,
  type Lang,
} from "./api";
import { applyMetadata } from "./metadata";
import NotFoundPage from "./NotFoundPage";

/** Language content object of a record. */
function contentOf(record: SiteRecord | undefined, lang: Lang) {
  if (!record) return {};
  const value = record[lang === "en" ? "contentEn" : "contentLv"];
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>; // language content from our own API
  }
  return {};
}

/**
 * `simple` template renderer — about, contact, privacy, terms, eula. Mirrors
 * the production special-page layout: title, divider, prose paragraphs.
 */
export function SimplePage() {
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
    const settings = record.settings;
    const noIndex =
      typeof settings === "object" &&
      settings !== null &&
      "noIndex" in settings &&
      typeof (settings as Record<string, unknown>).noIndex === "boolean"
        ? ((settings as Record<string, unknown>).noIndex as boolean)
        : false;
    applyMetadata({
      lang,
      title: metaTitle || `${title} | Latvian Association of Darwin`,
      description: metaDescription || undefined,
      canonicalPath: `/${lang}/${record.slug ?? ""}`,
      noIndex,
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
  const body = readString(content, "body");

  return (
    <main id="main" className="bg-cream text-ink">
      <section className="simple-section">
        <div className="container simple-inner">
          <h1>{title}</h1>
          <div className="section-rule" />
          <div className="prose">
            {body ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            ) : (
              <p>This page has no content yet.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
