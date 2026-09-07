import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { findRecord, isEventPast, isLang, mediaSrc, parseEventDate, readBoolean, readString, useSiteRecords, type Lang } from "./api";
import { applyMetadata } from "./metadata";
import NotFoundPage from "./NotFoundPage";
import { FacebookIcon, IconHeart, SmartLink } from "./SiteLayout";

function contentOf(record: { contentEn: unknown; contentLv: unknown } | undefined, lang: Lang) {
  if (!record) return {};
  const value = record[lang === "en" ? "contentEn" : "contentLv"];
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>; // language content from our own API
  }
  return {};
}

function EventPage() {
  const { lang: rawLang, slug } = useParams();
  const { records, error, loading, reload } = useSiteRecords();
  const lang = isLang(rawLang) ? (rawLang as Lang) : undefined;
  const event = records ? findRecord(records, slug) : undefined;

  useEffect(() => {
    if (!lang || !event) return;
    const content = contentOf(event, lang);
    const title = readString(content, "title");
    applyMetadata({
      lang,
      title: `${title || "Event"} | Latvian Association of Darwin`,
      description: readString(content, "body").slice(0, 160) || undefined,
      canonicalPath: `/${lang}/events/${event.slug ?? ""}`,
      noIndex: readBoolean(event.settings, "noIndex"),
      ogType: "article",
    });
  }, [lang, event, slug]);

  if (!lang) return <NotFoundPage />;
  if (error || loading) {
    return (
      <main id="main" className="state-block">
        {error ? (
          <>
            <p>
              Could not load this event. <code>{error}</code>
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
  if (!event) return <NotFoundPage />;

  const isLatvian = lang === "lv";
  const content = contentOf(event, lang);
  const title = readString(content, "title") || "(Untitled event)";
  const body = readString(content, "body");
  const settings = event.settings;
  const eventDateValue =
    typeof settings === "object" && settings !== null && "eventDate" in settings
      ? (settings as Record<string, unknown>).eventDate
      : undefined;
  const date = parseEventDate(eventDateValue);
  const dateText = date
    ? date.toLocaleDateString(isLatvian ? "lv-LV" : "en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const accentTone = readString(settings, "accentTone", "rose");
  const facebookUrl = readString(settings, "facebookUrl");
  const imageId = readString(settings, "imageId");
  const imageSrc = mediaSrc(imageId || null, "/images/img1.webp");
  const isPast = isEventPast(eventDateValue);
  const slugLabel = (event.slug ?? "").replace(/-/g, " ");

  return (
    <main id="main" className="detail-main detail">
      <div className="container" style={{ maxWidth: "56rem" }}>
        <nav aria-label="Breadcrumb" className="detail-breadcrumb">
          <SmartLink href="/" lang={lang}>
            {isLatvian ? "Sākums" : "Home"}
          </SmartLink>
          <span aria-hidden="true">/</span>
          <SmartLink href="/#events" lang={lang}>
            {isLatvian ? "Pasākumi" : "Events"}
          </SmartLink>
          <span aria-hidden="true">/</span>
          <span className="current">{title}</span>
        </nav>

        <div className="detail-tags">
          {slugLabel && <span className={`chip chip-${accentTone}`}>{slugLabel}</span>}
          <span className={`pill ${isPast ? "pill-past" : "pill-upcoming"}`}>
            {isPast
              ? isLatvian
                ? "Aizvadīts pasākums"
                : "Past Event"
              : isLatvian
              ? "Nākamais pasākums"
              : "Upcoming Event"}
          </span>
          {dateText && <span className="detail-date">{dateText}</span>}
          {facebookUrl && (
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="facebook-link">
              <FacebookIcon />
              <span>{isLatvian ? "Facebook pasākums" : "Facebook Event"}</span>
            </a>
          )}
        </div>

        <h1>{title}</h1>
        <div className="detail-rule" />

        <div className="detail-image">
          <img src={imageSrc} alt={title} loading="eager" />
        </div>

        <article className="prose">
          {body ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown> : <p>No description yet.</p>}
        </article>

        <div className="detail-actions">
          <SmartLink href="/#events" lang={lang} className="btn-back">
            ← {isLatvian ? "Atpakaļ uz pasākumiem" : "Back to events"}
          </SmartLink>
          <SmartLink href="/donate" lang={lang} className="btn btn-gold btn-gold-lg">
            <IconHeart />
            {isLatvian ? "Ziedot kopienai" : "Support our community"}
          </SmartLink>
        </div>
      </div>
    </main>
  );
}

export default EventPage;
