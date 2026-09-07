// Content shapes for the FlareCMS site records. Each record in the `posts`
// table stores one JSON object per language (`contentEn`, `contentLv`) plus a
// language-independent `settings` object. These types are mirrored by the
// manual checks in `functions/api/content-validation.ts`.

export const postTemplates = [
  "content",
  "simple",
  "home",
  "event",
  "navigation",
  "footer",
  "site",
  "donate",
] as const;
export type PostTemplate = (typeof postTemplates)[number];

export type Lang = "en" | "lv";

// --- `content` template (history, community, membership, culture) ---

export type ContentPageLanguage = {
  title: string;
  excerpt: string;
  body: string;
  ctaLabel: string;
  metaTitle: string;
  metaDescription: string;
};

export type ContentPageSettings = {
  imageId: string | null;
  ctaHref: string;
  noIndex: boolean;
};

// --- `simple` template (about, contact, privacy, terms, eula) ---

export type SimplePageLanguage = {
  title: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
};

export type SimplePageSettings = {
  noIndex: boolean;
};

// --- `home` template ---

export type HomeLanguage = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  eventsTitle: string;
  eventsIntro: string;
  exploreEyebrow: string;
  exploreTitle: string;
  exploreIntro: string;
};

export type HomeSettings = {
  heroImageId: string | null;
  heroPrimaryHref: string;
  heroSecondaryHref: string;
};

// --- `event` template ---

export type AccentTone = "emerald" | "amber" | "sky" | "rose" | "violet" | "slate";

export type EventLanguage = {
  title: string;
  body: string;
};

export type EventSettings = {
  eventDate: string; // ISO date; past events are determined by comparing this value
  facebookUrl: string;
  imageId: string | null;
  accentTone: AccentTone;
};

// --- `navigation` template ---

export type NavItem = { label: string; href: string; newTab: boolean };

export type NavigationLanguage = {
  items: NavItem[];
};

// --- `footer` template ---

export type FooterLanguage = {
  tagline: string;
  address: string;
  rights: string;
  items: NavItem[];
};

// --- `site` template ---

export type SiteLanguage = {
  associationName: string;
  tagline: string;
  contactEmail: string;
};

export type SiteSettings = {
  socialLinks: Array<{ platform: string; url: string }>;
};

// --- `donate` template ---

export type DonateLanguage = {
  title: string;
  introduction: string;
  bankName: string;
  bsb: string;
  accountNumber: string;
  accountName: string;
  payId: string;
  instructions: string;
  features: string[];
  priorityCards: Array<{ title: string; body: string; url: string; newTab: boolean }>;
  donationCards: Array<{ amount: number; body: string; url: string; newTab: boolean }>;
};

// --- Record row + discriminated union over templates ---

export type RecordBase = {
  rowid: number;
  published: number;
  updated: number;
  type: "post" | "page";
  status: "publish" | "draft";
  slug: string | null;
  template: PostTemplate;
  sortOrder: number;
};

type LanguageShape<T> = {
  en: T;
  lv: T;
};

type TemplateShapes = {
  content: LanguageShape<ContentPageLanguage> & { settings: ContentPageSettings };
  simple: LanguageShape<SimplePageLanguage> & { settings: SimplePageSettings };
  home: LanguageShape<HomeLanguage> & { settings: HomeSettings };
  event: LanguageShape<EventLanguage> & { settings: EventSettings };
  navigation: LanguageShape<NavigationLanguage> & { settings: Record<string, never> };
  footer: LanguageShape<FooterLanguage> & { settings: Record<string, never> };
  site: LanguageShape<SiteLanguage> & { settings: SiteSettings };
  donate: LanguageShape<DonateLanguage> & { settings: Record<string, never> };
};

export type SiteRecord = {
  [K in PostTemplate]: RecordBase & {
    template: K;
    contentEn: TemplateShapes[K]["en"];
    contentLv: TemplateShapes[K]["lv"];
    settings: TemplateShapes[K]["settings"];
  };
}[PostTemplate];

// --- Empty values for the editors ---

export function emptyLanguage(template: PostTemplate, _lang: Lang): Record<string, unknown> {
  switch (template) {
    case "content":
      return { title: "", excerpt: "", body: "", ctaLabel: "", metaTitle: "", metaDescription: "" };
    case "simple":
      return { title: "", body: "", metaTitle: "", metaDescription: "" };
    case "home":
      return {
        heroEyebrow: "",
        heroTitle: "",
        heroSubtitle: "",
        heroPrimaryLabel: "",
        heroSecondaryLabel: "",
        eventsTitle: "",
        eventsIntro: "",
        exploreEyebrow: "",
        exploreTitle: "",
        exploreIntro: "",
      };
    case "event":
      return { title: "", body: "" };
    case "navigation":
      return { items: [] };
    case "footer":
      return { tagline: "", address: "", rights: "", items: [] };
    case "site":
      return { associationName: "", tagline: "", contactEmail: "" };
    case "donate":
      return {
        title: "",
        introduction: "",
        bankName: "",
        bsb: "",
        accountNumber: "",
        accountName: "",
        payId: "",
        instructions: "",
        features: [],
        priorityCards: [],
        donationCards: [],
      };
  }
}

export function emptySettings(template: PostTemplate): Record<string, unknown> {
  switch (template) {
    case "content":
      return { imageId: null, ctaHref: "", noIndex: false };
    case "simple":
      return { noIndex: false };
    case "home":
      return { heroImageId: null, heroPrimaryHref: "/about", heroSecondaryHref: "#events" };
    case "event":
      return { eventDate: "", facebookUrl: "", imageId: null, accentTone: "rose" };
    case "site":
      return { socialLinks: [] };
    default:
      return {};
  }
}
