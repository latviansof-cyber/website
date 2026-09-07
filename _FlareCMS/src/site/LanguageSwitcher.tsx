import { useLocation, useNavigate } from "react-router-dom";

import { isLang, type Lang } from "./api";

/**
 * Switches between English and Latvian while preserving the current URL —
 * /en/events/:slug becomes /lv/events/:slug and vice versa.
 */
export function LanguageSwitcher() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const segments = pathname.split("/");
  const current: Lang = isLang(segments[1] ?? "") ? (segments[1] as Lang) : "en";
  const languageLabel = current === "lv" ? "Valoda" : "Language";

  function setLang(lang: Lang) {
    if (lang === current) return;
    const next = segments.slice();
    next[1] = lang;
    navigate(next.join("/") + search);
  }

  return (
    <div role="group" aria-label={languageLabel} className="lang-switcher">
      {(["en", "lv"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          lang={lang}
          aria-pressed={lang === current}
          aria-label={`${languageLabel}: ${lang.toUpperCase()}`}
          onClick={() => setLang(lang)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
