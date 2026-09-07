import React, { useEffect } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

import type { NavItem, SiteRecord } from "../contentTypes";
import {
  findRecord,
  isLang,
  localizeHref,
  readString,
  useSiteRecords,
  type Lang,
} from "./api";
import { LanguageSwitcher } from "./LanguageSwitcher";
import NotFoundPage from "./NotFoundPage";

/** Local icon: heart used across donation buttons. */
export function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true" focusable="false" className="heart">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/**
 * Renders an internal path with React Router and anything else (anchors,
 * mailto, external URLs) as a plain anchor. `href` values are localized.
 */
export function SmartLink({
  href,
  lang,
  className,
  children,
  newTab = false,
  ariaLabel,
}: {
  href: string;
  lang: Lang;
  className?: string;
  children: React.ReactNode;
  newTab?: boolean;
  ariaLabel?: string;
}) {
  const target = localizeHref(href, lang);
  const isPlain =
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    /^[a-z][a-z\d+.-]*:/i.test(href);
  const externalProps = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
  if (isPlain || newTab) {
    return (
      <a href={target} className={className} aria-label={ariaLabel} {...externalProps}>
        {children}
      </a>
    );
  }
  return (
    <Link to={target} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

/** Language-specific content object of a record, or null when absent. */
function langObject(record: SiteRecord | undefined, lang: Lang): Record<string, unknown> | null {
  if (!record) return null;
  const value = record[lang === "en" ? "contentEn" : "contentLv"];
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>; // language content object from our own API
  }
  return null;
}

function readNavItems(record: SiteRecord | undefined, lang: Lang): NavItem[] {
  const items = langObject(record, lang);
  if (!items) return [];
  const raw = items.items;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is NavItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).label === "string" &&
      typeof (item as Record<string, unknown>).href === "string"
  );
}

function StateBlock({ error, reload }: { error: string; reload: () => void }) {
  return (
    <div className="state-block">
      {error ? (
        <>
          <p>
            Could not load the website content. <code>{error}</code>
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

export function SiteFooter({
  footer,
  site,
  lang,
}: {
  footer: SiteRecord | undefined;
  site: SiteRecord | undefined;
  lang: Lang;
}) {
  const content = langObject(footer, lang) ?? {};
  const tagline = readString(content, "tagline");
  const address = readString(content, "address");
  const rights = readString(content, "rights");
  const items = readNavItems(footer, lang);
  const year = new Date().getFullYear();
  const siteEn = langObject(site, "en") ?? {};
  const siteLv = langObject(site, "lv") ?? {};
  const associationName =
    lang === "en"
      ? readString(siteEn, "associationName") || "Latvian Association of Darwin"
      : readString(siteLv, "associationName") || "Dārvinas Latviešu Apvienība";
  const contactEmail =
    readString(siteEn, "contactEmail") || "hello@latviansofdarwin.org.au";

  const isLv = lang === "lv";
  const quickLinks = items.length > 0 ? items.slice(0, 4) : [
    { label: isLv ? "Par mums" : "About", href: "/about", newTab: false },
    { label: isLv ? "Vēsture" : "History", href: "/history", newTab: false },
    { label: isLv ? "Pasākumi" : "Events", href: "/#events", newTab: false },
    { label: isLv ? "Ziedot" : "Donate", href: "/donate", newTab: false },
  ];
  const resourceLinks = items.length > 4 ? items.slice(4) : [
    { label: isLv ? "Privātuma politika" : "Privacy Policy", href: "/privacy", newTab: false },
    { label: isLv ? "Lietošanas noteikumi" : "Terms & Conditions", href: "/terms", newTab: false },
    { label: "EULA", href: "/eula", newTab: false },
  ];

  const settings =
    site && typeof site.settings === "object"
      ? (site.settings as unknown as Record<string, unknown>)
      : {};
  const socialLinksRaw = settings.socialLinks;
  const socialLinks = Array.isArray(socialLinksRaw)
    ? socialLinksRaw.filter(
        (link): link is { platform: string; url: string } =>
          typeof link === "object" &&
          link !== null &&
          typeof (link as Record<string, unknown>).platform === "string" &&
          typeof (link as Record<string, unknown>).url === "string"
      )
    : [];

  return (
    <footer
      className="site-footer-section"
      itemScope
      itemType="https://schema.org/Organization"
      style={{ background: "var(--ink)", color: "#fff" }}
    >
      <meta itemProp="name" content={associationName} />
      <div
        className="footer-accent"
        style={{ height: 6, background: "linear-gradient(to right, var(--latvian-red), var(--sunset-gold), var(--latvian-red))" }}
      />
      <div className="container footer-grid">
        {/* Brand column */}
        <div className="footer-brand">
          <SmartLink href="/" lang={lang} className="footer-logo-row">
            <span className="footer-logo-circle">
              <img src="/images/logo.png" alt="Latvian Association of Darwin logo" loading="lazy" />
            </span>
            <span>
              <span className="footer-dla">DLA</span>
              <span className="footer-dla-sub">Darwin · NT</span>
            </span>
          </SmartLink>
          <p className="footer-tagline">{tagline}</p>
          {address && <p className="footer-address">{address}</p>}
          {socialLinks.length > 0 && (
            <div className="footer-social">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="footer-social-btn"
                >
                  {link.platform.toLowerCase().includes("facebook") ? (
                    <FacebookIcon />
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h2 className="footer-heading">{isLv ? "Ātrās saites" : "Quick Links"}</h2>
          <ul className="footer-list">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href} lang={lang} newTab={item.newTab}>
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="footer-heading">{isLv ? "Resursi" : "Resources"}</h2>
          <ul className="footer-list">
            {resourceLinks.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href} lang={lang} newTab={item.newTab}>
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Get involved */}
        <div>
          <h2 className="footer-heading">{isLv ? "Iesaisties" : "Get Involved"}</h2>
          <p className="footer-involved">
            {isLv
              ? "Neatkarīgi no tā, vai jums ir latviešu izcelsme, vai vēlaties pievienoties mūsu kopienai, jūs vienmēr esat laipni gaidīti."
              : "Whether you have Latvian heritage or want to connect with a vibrant community, there is always a place for you."}
          </p>
          <a href={`mailto:${contactEmail}`} className="footer-email">
            {contactEmail}
          </a>
          <SmartLink href="/donate" lang={lang} className="btn btn-gold footer-donate">
            <IconHeart />
            {isLv ? "Ziedot" : "Donate"}
          </SmartLink>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <div className="footer-legal">
            <p>
              © 2023–{year} {associationName}. {rights}
            </p>
            <p className="footer-incorporated">
              {isLv
                ? "Reģistrēta asociācija no 2023. gada 22. oktobra"
                : "Incorporated Entity from 22 October 2023"}
            </p>
          </div>
          <div className="footer-links">
            <SmartLink href="/privacy" lang={lang}>
              {isLv ? "Privātuma politika" : "Privacy Policy"}
            </SmartLink>
            <SmartLink href="/terms" lang={lang}>
              {isLv ? "Lietošanas noteikumi" : "Terms & Conditions"}
            </SmartLink>
            <SmartLink href="/eula" lang={lang}>
              EULA
            </SmartLink>
            <a href="https://abr.business.gov.au/ABN/View?abn=25545712911" target="_blank" rel="noopener noreferrer">
              ABN 25 545 712 911
            </a>
            <span aria-hidden="true">·</span>
            <a href="https://vasilkoff.com/contact-us#report" target="_blank" rel="noreferrer">
              {isLv ? "Ziņot par kļūdu" : "Report a bug"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Language-scoped layout: loads the navigation, footer and site records and
 * renders the shared header/footer around the routed page.
 */
export function SiteLayout() {
  const params = useParams();
  const langRaw = params.lang;
  const { records, error, loading, reload } = useSiteRecords();

  useEffect(() => {
    if (isLang(langRaw)) {
      document.documentElement.lang = langRaw === "lv" ? "lv" : "en-AU";
    }
  }, [langRaw]);

  if (!isLang(langRaw)) {
    return <NotFoundPage />;
  }
  const lang: Lang = langRaw;

  if (error || loading) {
    return <StateBlock error={error} reload={reload} />;
  }
  const all = records ?? [];
  const navigation =
    findRecord(all, "navigation") ??
    findRecord(all, "main-menu") ??
    all.find((r) => r.template === "navigation");
  const footer =
    findRecord(all, "footer") ??
    all.find((r) => r.template === "footer");
  const site =
    findRecord(all, "site") ??
    findRecord(all, "site-settings") ??
    all.find((r) => r.template === "site");
  const navItems = readNavItems(navigation, lang);
  const isLv = lang === "lv";
  const defaultNavItems: NavItem[] = [
    { label: isLv ? "Vēsture" : "History", href: "/history", newTab: false },
    { label: isLv ? "Pievienoties" : "Join", href: "/membership", newTab: false },
    { label: isLv ? "Pasākumi" : "Events", href: "/#events", newTab: false },
  ];
  const effectiveNavItems = navItems.length > 0 ? navItems : defaultNavItems;

  const siteEn = site && typeof site.contentEn === "object" ? site.contentEn : undefined;
  const siteLv = site && typeof site.contentLv === "object" ? site.contentLv : undefined;
  const primaryName =
    lang === "en"
      ? readString(siteEn, "associationName") || "Latvian Association of Darwin"
      : readString(siteLv, "associationName") || "Dārvinas Latviešu Apvienība";
  const secondaryName =
    lang === "en"
      ? readString(siteLv, "associationName") || "Dārvinas Latviešu Apvienība"
      : readString(siteEn, "associationName") || "Latvian Association of Darwin";
  const donateLabel = lang === "lv" ? "Ziedot" : "Donate";
  const skipLabel = lang === "lv" ? "Pāriet uz saturu" : "Skip to content";

  return (
    <div className="site-page">
      <a href="#main" className="skip-link">
        {skipLabel}
      </a>
      <header className="site-header">
        <div className="container">
          <SmartLink href="/#top" lang={lang} className="brand">
            <img src="/images/logo.png" alt={primaryName} />
            <span className="brand-names">
              <span className="brand-name-primary">{primaryName}</span>
              <span className="brand-name-secondary">{secondaryName}</span>
            </span>
          </SmartLink>
          <nav aria-label={lang === "lv" ? "Galvenā navigācija" : "Primary"} className="site-nav-desktop">
            <ul className="nav-list">
              {effectiveNavItems.map((item) => (
                <li key={item.href}>
                  <SmartLink href={item.href} lang={lang} className="nav-link" newTab={item.newTab}>
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
            <SmartLink href="/donate" lang={lang} className="btn-donate" ariaLabel={donateLabel}>
              <IconHeart />
              <span className="btn-label">{donateLabel}</span>
            </SmartLink>
            <div className="lang-switch-wrap">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
        <nav
          aria-label={lang === "lv" ? "Galvenā navigācija (mobilā)" : "Primary mobile"}
          className="nav-mobile"
        >
          <ul>
            {effectiveNavItems.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href} lang={lang} newTab={item.newTab}>
                  {item.label}
                </SmartLink>
              </li>
            ))}
            <li>
              <SmartLink href="/donate" lang={lang} className="nav-link">
                {donateLabel}
              </SmartLink>
            </li>
            <li>
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter footer={footer} site={site} lang={lang} />
    </div>
  );
}
