import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { findRecord, isLang, readBoolean, readString, useSiteRecords, type Lang } from "./api";
import { applyMetadata } from "./metadata";
import NotFoundPage from "./NotFoundPage";
import { SmartLink } from "./SiteLayout";

function contentOf(record: { contentEn: unknown; contentLv: unknown } | undefined, lang: Lang) {
  if (!record) return {};
  const value = record[lang === "en" ? "contentEn" : "contentLv"];
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>; // language content from our own API
  }
  return {};
}

interface CardLike {
  title?: string;
  body?: string;
  amount?: number;
  url?: string;
  newTab?: boolean;
}

function asCards(value: unknown): CardLike[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is CardLike =>
      typeof item === "object" && item !== null && !Array.isArray(item)
  );
}

function DonatePage() {
  const { lang: rawLang } = useParams();
  const { records, error, loading, reload } = useSiteRecords();
  const lang = isLang(rawLang) ? (rawLang as Lang) : undefined;
  const donate = records ? findRecord(records, "donate") : undefined;

  useEffect(() => {
    if (!lang) return;
    const isLatvian = lang === "lv";
    applyMetadata({
      lang,
      title: `${isLatvian ? "Ziedot" : "Donate"} | Latvian Association of Darwin`,
      description: isLatvian
        ? "Atbalstiet Dārvinas Latviešu Apvienību, tās kultūras pasākumus, valodas programmas un kopienu."
        : "Support the Latvian Association of Darwin with a one-time or monthly donation. Your gift funds cultural events, language programs, and community gatherings across the Northern Territory.",
      canonicalPath: `/${lang}/donate`,
      ogType: "website",
    });
  }, [lang]);

  if (!lang) return <NotFoundPage />;
  if (error || loading) {
    return (
      <main id="main" className="state-block">
        {error ? (
          <>
            <p>
              Could not load the donation page. <code>{error}</code>
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

  const isLatvian = lang === "lv";
  const content = contentOf(donate, lang);
  const title = readString(content, "title") || (isLatvian ? "Ziedot" : "Donate");
  const introduction = readString(content, "introduction");
  const bankName = readString(content, "bankName");
  const bsb = readString(content, "bsb");
  const accountNumber = readString(content, "accountNumber");
  const accountName = readString(content, "accountName");
  const payId = readString(content, "payId");
  const instructions = readString(content, "instructions");
  const features = Array.isArray(content.features)
    ? content.features.filter((item): item is string => typeof item === "string")
    : [];
  const priorityCards = asCards(content.priorityCards);
  const donationCards = asCards(content.donationCards);
  const hasBankDetails = Boolean(bankName || bsb || accountNumber || payId);

  return (
    <main id="main" className="donate-main">
      <section className="donate-hero">
        <div className="container">
          <div className="eyebrow">
            <span>{isLatvian ? "Atbalsti mūsu kopienu" : "Support our community"}</span>
          </div>
          <h1>{title}</h1>
          {introduction && <p>{introduction}</p>}
        </div>
      </section>

      {priorityCards.length > 0 && (
        <section className="donate-section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <div className="donate-grid priority-grid">
              {priorityCards.map((card, index) => {
                const label = readString(card, "title");
                const body = readString(card, "body");
                const url = readString(card, "url");
                const newTab = readBoolean(card, "newTab");
                const inner = (
                  <>
                    <h3>{label}</h3>
                    <p>{body}</p>
                    {url && <span className="donate-url">{isLatvian ? "Ziedot →" : "Donate →"}</span>}
                  </>
                );
                if (!url) {
                  return (
                    <div key={index} className="donate-card">
                      {inner}
                    </div>
                  );
                }
                return (
                  <SmartLink key={index} href={url} lang={lang} newTab={newTab} className="donate-card">
                    {inner}
                  </SmartLink>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {donationCards.length > 0 && (
        <section className="donate-section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <h2 className="section-title" style={{ fontSize: "2.25rem" }}>
              {isLatvian ? "Izvēlies summu" : "Choose an Amount"}
            </h2>
            <div className="section-rule" />
            {features.length > 0 && (
              <ul className="donate-features">
                {features.map((feature, index) => (
                  <li key={index}>
                    <span className="tick">✓</span> {feature}
                  </li>
                ))}
              </ul>
            )}
            <div className="donate-amount-cards">
              {donationCards.map((card, index) => {
                const amount = card.amount;
                const body = readString(card, "body");
                const url = readString(card, "url");
                const newTab = readBoolean(card, "newTab");
                const inner = (
                  <>
                    <span className="amount">
                      {typeof amount === "number" && !Number.isNaN(amount)
                        ? `AU$${amount}`
                        : ""}
                    </span>
                    <p>{body}</p>
                  </>
                );
                if (!url) {
                  return (
                    <div key={index} className="amount-card">
                      {inner}
                    </div>
                  );
                }
                return (
                  <SmartLink key={index} href={url} lang={lang} newTab={newTab} className="amount-card">
                    {inner}
                  </SmartLink>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {hasBankDetails && (
        <section className="donate-section" style={{ paddingBottom: "3rem" }}>
          <div className="container" style={{ maxWidth: "56rem" }}>
            <h2 className="section-title" style={{ fontSize: "2.25rem" }}>
              {isLatvian ? "Bankas pārskaitījums un PayID" : "Bank Transfer & PayID"}
            </h2>
            <div className="section-rule" />
            <div className="bank-panel">
              <dl className="bank-grid">
                {bankName && (
                  <div className="bank-detail">
                    <dt>{isLatvian ? "Banka" : "Bank"}</dt>
                    <dd>{bankName}</dd>
                  </div>
                )}
                {bsb && (
                  <div className="bank-detail">
                    <dt>BSB</dt>
                    <dd>{bsb}</dd>
                  </div>
                )}
                {accountNumber && (
                  <div className="bank-detail">
                    <dt>{isLatvian ? "Konta numurs" : "Account number"}</dt>
                    <dd>{accountNumber}</dd>
                  </div>
                )}
                {accountName && (
                  <div className="bank-detail">
                    <dt>{isLatvian ? "Konta nosaukums" : "Account name"}</dt>
                    <dd>{accountName}</dd>
                  </div>
                )}
                {payId && (
                  <div className="bank-detail">
                    <dt>PayID</dt>
                    <dd>{payId}</dd>
                  </div>
                )}
              </dl>
              {instructions && (
                <div className="prose" style={{ marginTop: "1.5rem" }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{instructions}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default DonatePage;
