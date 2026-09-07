import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { SiteRecord } from "../contentTypes";
import {
  findRecord,
  isEventPast,
  isLang,
  localizeHref,
  mediaSrc,
  parseEventDate,
  readString,
  useSiteRecords,
  type Lang,
} from "./api";
import { applyMetadata } from "./metadata";
import { FacebookIcon, SmartLink } from "./SiteLayout";

const SITE_NAME = "Latvian Association of Darwin";
const SITE_NAME_LV = "Dārvinas Latviešu Apvienība";
const SITE_DESCRIPTION =
  "A welcoming community for Latvians, Latvian descendants, and friends of Latvia in Darwin and across the Northern Territory.";

const ITEMS_PER_PAGE = 6;

const CARD_IMAGE_FALLBACKS: Record<string, string> = {
  history: "/images/gathering2.jpg",
  community: "/images/img1.webp",
  membership: "/images/membership-welcome.webp",
  culture: "/images/culture.png",
};

function contentOf(record: SiteRecord | undefined, lang: Lang) {
  if (!record) return {};
  const value = record[lang === "en" ? "contentEn" : "contentLv"];
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>; // language content from our own API
  }
  return {};
}

function settingsImageId(record: SiteRecord | undefined, key: string): string | null {
  if (!record) return null;
  const settings = record.settings;
  if (typeof settings !== "object" || settings === null) return null;
  if (!(key in settings)) return null;
  const value = (settings as Record<string, unknown>)[key]; // verified present above
  return typeof value === "string" && value ? value : null;
}

/* ------------------------------------------------------------ Hero */

function FeatureIcon({ type }: { type: "community" | "heritage" | "volunteer" }) {
  if (type === "community") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2.75 19a5.25 5.25 0 0 1 10.5 0M13 14.2A5.25 5.25 0 0 1 21.25 19" />
      </svg>
    );
  }
  if (type === "volunteer") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10m0 4c-4.25 0-7-2.75-7-7 4.25 0 7 2.75 7 7Zm0-4c0-4.25 2.75-7 7-7 0 4.25-2.75 7-7 7Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3.75v16.5M5 5h13l-2.3 3.5L18 12H5" />
    </svg>
  );
}

function HeroSection({ home, lang }: { home: SiteRecord | undefined; lang: Lang }) {
  const content = contentOf(home, lang);
  const isLatvian = lang === "lv";
  const imageSrc = mediaSrc(settingsImageId(home, "heroImageId"), "/images/img1.webp");
  const heroPrimaryHref = readString(home?.settings, "heroPrimaryHref", "#events");
  const heroSecondaryHref = readString(home?.settings, "heroSecondaryHref", "/about");

  return (
    <section id="top" aria-labelledby="hero-title" className="hero">
      <div className="hero-bg">
        <img src={imageSrc} alt="Latvian Association of Darwin Community" />
      </div>
      <div className="hero-glow" aria-hidden="true" />
      <div className="container">
        <div className="hero-content">
          <p className="hero-eyebrow">{readString(content, "heroEyebrow")}</p>
          <h1 id="hero-title">{readString(content, "heroTitle")}</h1>
          <p className="hero-subtitle">{readString(content, "heroSubtitle")}</p>
          <div className="hero-actions">
            <SmartLink href={heroPrimaryHref} lang={lang} className="btn btn-gold">
              {readString(content, "heroPrimaryLabel")}
              <span className="arrow" aria-hidden="true">→</span>
            </SmartLink>
            <SmartLink href={heroSecondaryHref} lang={lang} className="btn btn-ghost">
              {readString(content, "heroSecondaryLabel")}
            </SmartLink>
            <SmartLink href="/membership" lang={lang} className="btn btn-gold btn-gold-lg">
              <svg className="join-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {isLatvian ? "Pievienoties" : "Join"}
            </SmartLink>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <span>
                <FeatureIcon type="community" />
              </span>
              <span>{isLatvian ? "Visiem atvērta kopiena" : "Open & Welcoming to All"}</span>
            </div>
            <div className="hero-feature">
              <span>
                <FeatureIcon type="volunteer" />
              </span>
              <span>{isLatvian ? "Brīvprātīgo vadīta" : "Volunteer Driven"}</span>
            </div>
            <div className="hero-feature">
              <span>
                <FeatureIcon type="heritage" />
              </span>
              <span>{isLatvian ? "Kultūras mantojums" : "Preserving Latvian Heritage"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Cards */

function PageCardsSection({
  pages,
  home,
  lang,
}: {
  pages: SiteRecord[];
  home: SiteRecord | undefined;
  lang: Lang;
}) {
  const content = contentOf(home, lang);
  const isLatvian = lang === "lv";
  const seeFullInfo = isLatvian ? "Skatīt pilnu informāciju" : "See full info";

  return (
    <section id="about" aria-label={readString(content, "exploreTitle")} className="section-muted">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">
            <span>{readString(content, "exploreEyebrow")}</span>
          </div>
          <h2 className="section-title">{readString(content, "exploreTitle")}</h2>
          <div className="section-rule" />
          <p className="section-intro">{readString(content, "exploreIntro")}</p>
        </div>
        <div className="card-grid">
          {pages.map((page) => {
            const pageContent = contentOf(page, lang);
            const isHistory = page.slug === "history";
            const imageSrc = mediaSrc(
              settingsImageId(page, "imageId"),
              CARD_IMAGE_FALLBACKS[page.slug ?? ""] ?? "/images/img1.webp"
            );
            return (
              <article key={page.rowid} className="card">
                <SmartLink href={`/${page.slug ?? ""}`} lang={lang} className="card-image" ariaLabel={readString(pageContent, "title")}>
                  <img src={imageSrc} alt={readString(pageContent, "title")} loading="lazy" className={isHistory ? "contain" : ""} />
                </SmartLink>
                <div className="card-body">
                  <div>
                    <h3>
                      <SmartLink href={`/${page.slug ?? ""}`} lang={lang}>
                        {readString(pageContent, "title")}
                      </SmartLink>
                    </h3>
                    <div className="card-accent" />
                    <p className="card-excerpt">{readString(pageContent, "excerpt")}</p>
                  </div>
                  <div className="card-footer">
                    <SmartLink
                      href={`/${page.slug ?? ""}`}
                      lang={lang}
                      className="card-link"
                      ariaLabel={`${seeFullInfo}: ${readString(pageContent, "title")}`}
                    >
                      {seeFullInfo} →
                    </SmartLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Events */

function EventCard({
  event,
  lang,
  isLatvian,
}: {
  event: SiteRecord;
  lang: Lang;
  isLatvian: boolean;
}) {
  const content = contentOf(event, lang);
  const title = readString(content, "title");
  const body = readString(content, "body");
  const settings = event.settings;
  const eventDateValue =
    typeof settings === "object" && settings !== null && "eventDate" in settings
      ? (settings as Record<string, unknown>).eventDate
      : undefined;
  const date = parseEventDate(eventDateValue);
  const month = date
    ? date.toLocaleDateString(isLatvian ? "lv-LV" : "en-US", { month: "short" }).toUpperCase()
    : null;
  const day = date ? date.getDate() : null;
  const year = date ? date.getFullYear() : null;
  const accentTone = readString(settings, "accentTone", "rose");
  const facebookUrl = readString(settings, "facebookUrl");
  const imageSrc = mediaSrc(settingsImageId(event, "imageId"), "/images/img1.webp");
  const isPast = isEventPast(eventDateValue);
  const slugLabel = (event.slug ?? "").replace(/-/g, " ");

  return (
    <li className="card">
      <SmartLink href={`/events/${event.slug ?? ""}`} lang={lang} className="event-image" ariaLabel={title}>
        <img src={imageSrc} alt={title} loading="lazy" />
        <div className="event-badges">
          <span className={`pill ${isPast ? "pill-past" : "pill-upcoming"}`}>
            {isPast ? (isLatvian ? "Aizvadīts" : "Past event") : isLatvian ? "Nākamais" : "Upcoming"}
          </span>
          {slugLabel && <span className={`chip chip-${accentTone} event-slug-chip`}>{slugLabel}</span>}
        </div>
        {date && (
          <div className="date-badge">
            <span className="month">{month}</span>
            <span className="day">{day}</span>
            <span className="year">{year}</span>
          </div>
        )}
      </SmartLink>
      <div className="card-body">
        <div>
          <h3>
            <SmartLink href={`/events/${event.slug ?? ""}`} lang={lang}>
              {title}
            </SmartLink>
          </h3>
          <div className="card-accent" />
          {body && (
            <div className="card-excerpt prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className="card-footer">
          <SmartLink
            href={`/events/${event.slug ?? ""}`}
            lang={lang}
            className="card-link"
            ariaLabel={`${isLatvian ? "Skatīt pilnu informāciju" : "See full info"}: ${title}`}
          >
            {isLatvian ? "Skatīt pilnu informāciju" : "See full info"} →
          </SmartLink>
          {facebookUrl && (
            <a
              href={localizeHref(facebookUrl, lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="facebook-link"
            >
              <FacebookIcon />
              <span>Facebook</span>
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

function EventsSection({
  events,
  home,
  lang,
}: {
  events: SiteRecord[];
  home: SiteRecord | undefined;
  lang: Lang;
}) {
  const content = contentOf(home, lang);
  const isLatvian = lang === "lv";
  const [currentPage, setCurrentPage] = useState(1);

  const sorted = useMemo(() => {
    const timeOf = (e: SiteRecord): number => {
      const settings = e.settings;
      const value =
        typeof settings === "object" && settings !== null && "eventDate" in settings
          ? (settings as Record<string, unknown>).eventDate
          : undefined;
      const date = parseEventDate(value);
      return date ? date.getTime() : Number.MAX_SAFE_INTEGER;
    };
    return [...events].sort((a, b) => {
      const aPast = isEventPast(
        typeof a.settings === "object" && a.settings !== null ? (a.settings as Record<string, unknown>).eventDate : undefined
      );
      const bPast = isEventPast(
        typeof b.settings === "object" && b.settings !== null ? (b.settings as Record<string, unknown>).eventDate : undefined
      );
      if (aPast !== bPast) return aPast ? 1 : -1;
      return timeOf(a) - timeOf(b);
    });
  }, [events]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const displayed = sorted.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [lang]);

  return (
    <section id="events" aria-label={readString(content, "eventsTitle")} className="section-events">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">
            <span>{isLatvian ? "Pasākumi" : "Events"}</span>
          </div>
          <h2 id="events-title" className="section-title">
            {readString(content, "eventsTitle")}
          </h2>
          <div className="section-rule" />
          <p className="section-intro">{readString(content, "eventsIntro")}</p>
        </div>

        {displayed.length === 0 ? (
          <div className="events-empty">
            <p>{isLatvian ? "Pašlaik nav pieejamu pasākumu." : "No events currently available."}</p>
          </div>
        ) : (
          <ul role="list" className="event-list">
            {displayed.map((event) => (
              <EventCard key={event.rowid} event={event} lang={lang} isLatvian={isLatvian} />
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav aria-label="Events pagination" className="pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="page-btn"
            >
              ← {isLatvian ? "Iepriekšējā" : "Previous"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                aria-current={pageNum === safePage}
                className="page-num"
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages}
              className="page-btn"
            >
              {isLatvian ? "Nākamā" : "Next"} →
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Support band */

function SupportSection({ site, lang }: { site: SiteRecord | undefined; lang: Lang }) {
  const isLatvian = lang === "lv";
  const siteEn =
    site && typeof site.contentEn === "object" && site.contentEn !== null
      ? (site.contentEn as Record<string, unknown>)
      : {};
  const payIdEmail = readString(siteEn, "contactEmail") || "hello@latviansofdarwin.org.au";

  return (
    <section id="donate-mission" className="support-band">
      <div className="container">
        <div className="support-card">
          <span className="eyebrow" style={{ justifyContent: "center" }}>
            <span>{isLatvian ? "Atbalstīt DLA" : "Support DLA"}</span>
          </span>
          <h2>{isLatvian ? "Palīdziet mūsu misijai plaukt" : "Help Our Mission Thrive"}</h2>
          <p className="support-intro">
            {isLatvian
              ? "Ikkatrs ziedojums — neatkarīgi no apjoma — palīdz mums atbalstīt ģimenes, saglabāt latviešu kultūras mantojumu un uzturēt kopienas tradīcijas dzīvas Ziemeļu Teritorijā."
              : "Every contribution — no matter the size — helps us welcome newcomers, support families, preserve Latvian heritage, and keep our community traditions alive in the Northern Territory."}
          </p>
          <div className="support-reassure">
            <span>
              <span className="tick">✓</span> {isLatvian ? "Bez komisijas caur PayID" : "Zero fees via PayID"}
            </span>
            <span>
              <span className="tick">✓</span> {isLatvian ? "Kvīts pēc pieprasījuma" : "Tax receipt available"}
            </span>
            <span>
              <span className="tick">✓</span> {isLatvian ? "Tieši kopienas vajadzībām" : "Direct to community"}
            </span>
          </div>
          <ul className="support-amounts" aria-label={isLatvian ? "Ātrās ziedošanas summas" : "Quick donation amounts"}>
            {[25, 50, 100].map((amount) => (
              <li key={amount}>
                <SmartLink href="/donate" lang={lang} className="amount-pill" ariaLabel={isLatvian ? `Ziedot AU$${amount}` : `Donate AU$${amount}`}>
                  AU${amount}
                </SmartLink>
              </li>
            ))}
            <li>
              <SmartLink href="/donate" lang={lang} className="amount-pill amount-pill-gold" ariaLabel={isLatvian ? "Ziedot AU$500 vai vairāk" : "Donate AU$500 or more"}>
                AU$500+
              </SmartLink>
            </li>
          </ul>
          <p className="support-payid">
            {isLatvian ? "Tiešais pārskaitījums caur PayID:" : "Direct bank transfer via PayID:"}{" "}
            <strong>{payIdEmail}</strong> · {isLatvian ? "bez komisijas maksas" : "zero fees"}
          </p>
          <div style={{ marginTop: "1.5rem" }}>
            <SmartLink href="/donate" lang={lang} className="btn btn-back">
              {isLatvian ? "Visas ziedošanas iespējas →" : "All donation options →"}
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Partners */

const SUPPORTERS = [
  {
    url: "/images/supporters/australian-government.webp",
    alt: "Australian Government",
    link: "https://my.gov.au/",
    enHelpText:
      "Access federal services, visa information, Medicare, Centrelink, and national support resources.",
    lvHelpText:
      "Piekļūstiet federālajiem pakalpojumiem, vīzu informācijai, Medicare un valsts atbalsta resursiem.",
  },
  {
    url: "/images/supporters/NT-goverment.webp",
    alt: "NT Government",
    link: "https://nt.gov.au/",
    enHelpText:
      "Northern Territory government services including housing, health information, and community programs.",
    lvHelpText:
      "Ziemeļu Teritorijas pakalpojumi, tostarp mājokļi, veselības aprūpe un vietējās kopienas programmas.",
  },
  {
    url: "/images/supporters/australain-red-cross.webp",
    alt: "Australian Red Cross",
    link: "https://www.redcross.org.au/places/offices/darwin/",
    enHelpText:
      "Emergency relief, humanitarian assistance, and practical help for individuals and families.",
    lvHelpText:
      "Ārkārtas atbalsts, humānā palīdzība un praktisks atbalsts ģimenēm un indivīdiem.",
  },
  {
    url: "/images/supporters/melaluka.webp",
    alt: "Melaleuca Australia",
    link: "https://melaleuca.org.au/",
    enHelpText:
      "Settlement support, casework, referrals, and guidance for building a stable life in the NT.",
    lvHelpText:
      "Apmetnes atbalsts, sociālais darbs un norādes stabilas dzīves veidošanai Ziemeļu Teritorijā.",
  },
  {
    url: "/images/supporters/uaant-logo.svg",
    alt: "UAANT (Ukrainian Association of NT)",
    link: "https://uaant.org.au/",
    enHelpText:
      "Partner multicultural association in Darwin collaborating on joint community events and initiatives.",
    lvHelpText:
      "Sadarbības partneru asociācija Dārvinā, kas kopīgi rīko kopienas pasākumus un iniciatīvas.",
  },
];

function PartnerCard({
  supporter,
  lang,
}: {
  supporter: (typeof SUPPORTERS)[number];
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const helpText = lang === "lv" ? supporter.lvHelpText : supporter.enHelpText;
  return (
    <div className="partner-card">
      <a
        href={supporter.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${supporter.alt} logo`}
      >
        <img src={supporter.url} alt="" loading="lazy" />
      </a>
      <button
        type="button"
        aria-label={`${lang === "lv" ? "Kā var palīdzēt" : "How"} ${supporter.alt} ${lang === "lv" ? "var palīdzēt" : "can help"}`}
        aria-expanded={open}
        className="info-btn"
        onClick={() => setOpen((value) => !value)}
      >
        i
      </button>
      {open && (
        <div role="tooltip" className="tooltip">
          <strong>{supporter.alt}</strong>
          {helpText}
        </div>
      )}
    </div>
  );
}

function PartnersSection({ lang }: { lang: Lang }) {
  const isLatvian = lang === "lv";
  return (
    <section id="trusted-partners" className="partners-section">
      <div className="container">
        <div className="partners-head">
          <div>
            <span className="partners-eyebrow">
              {isLatvian ? "Sadarbība & Kopiena" : "Collaboration & Community"}
            </span>
            <h2>{isLatvian ? "Uzticamie partneri" : "Trusted Partners"}</h2>
          </div>
          <p>
            {isLatvian
              ? "Mēs sadarbojamies ar vietējām un nacionālajām organizācijām, lai sniegtu praktisku atbalstu mūsu kopienai."
              : "We collaborate with local and national organizations to deliver practical support for our community."}
          </p>
        </div>
        <div className="partner-grid">
          {SUPPORTERS.map((supporter) => (
            <PartnerCard key={supporter.alt} supporter={supporter} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Homepage */

function HomePage() {
  const { lang: rawLang } = useParams();
  const { records, error, loading, reload } = useSiteRecords();
  const lang = isLang(rawLang) ? (rawLang as Lang) : undefined;

  useEffect(() => {
    if (!lang) return;
    applyMetadata({
      lang,
      title: `${SITE_NAME} — ${SITE_NAME_LV}`,
      description: SITE_DESCRIPTION,
      canonicalPath: `/${lang}`,
      ogType: "website",
    });
  }, [lang]);

  if (!lang) return null;
  if (error || loading) {
    return (
      <div className="state-block">
        {error ? (
          <>
            <p>
              Could not load the homepage. <code>{error}</code>
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
      </div>
    );
  }

  const all = records ?? [];
  const home = findRecord(all, "home");
  const site = findRecord(all, "site");
  const pages = all
    .filter((record) => record.template === "content")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const events = all.filter((record) => record.template === "event");

  return (
    <main id="main" className="bg-cream text-ink">
      <HeroSection home={home} lang={lang} />
      {pages.length > 0 && <PageCardsSection pages={pages} home={home} lang={lang} />}
      <EventsSection events={events} home={home} lang={lang} />
      <SupportSection site={site} lang={lang} />
      <PartnersSection lang={lang} />
    </main>
  );
}

export default HomePage;
