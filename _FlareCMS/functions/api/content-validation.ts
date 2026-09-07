// Manual TypeScript validation for site record content. Kept deliberately
// simple (no validation package) and mirrored against the client shapes in
// `src/contentTypes.ts`. Every function returns a plain-English error message
// or `null` when valid.

export const templates = [
  "content",
  "simple",
  "home",
  "event",
  "navigation",
  "footer",
  "site",
  "donate",
] as const;
export type Template = (typeof templates)[number];

type Obj = Record<string, unknown>;

const accentTones = ["emerald", "amber", "sky", "rose", "violet", "slate"] as const;

function isObject(value: unknown): value is Obj {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isString(value: unknown): value is string {
  return typeof value === "string";
}
function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}
function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}
function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function missingText(obj: Obj, key: string): boolean {
  const value = obj[key];
  return !isString(value) || value.trim() === "";
}
function badOptionalText(obj: Obj, key: string): boolean {
  const value = obj[key];
  return value !== undefined && !isString(value);
}
function badOptionalBool(obj: Obj, key: string): boolean {
  const value = obj[key];
  return value !== undefined && !isBoolean(value);
}

function requiredTextError(obj: Obj, keys: string[], label: string): string | null {
  for (const key of keys) {
    if (missingText(obj, key)) {
      return `"${key}" is required for the ${label} content and must be non-empty text`;
    }
  }
  for (const key of keys) {
    if (badOptionalText(obj, key)) return `"${key}" must be text for the ${label} content`;
  }
  return null;
}

function optionalTextError(obj: Obj, keys: string[], label: string): string | null {
  for (const key of keys) {
    if (badOptionalText(obj, key)) return `"${key}" must be text for the ${label} content`;
  }
  return null;
}

function validateNavItems(value: unknown, label: string): string | null {
  if (!Array.isArray(value)) return `"items" must be a list for the ${label} navigation content`;
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    if (!isObject(item)) return `navigation item ${i + 1} must be an object`;
    if (!isString(item.label) || item.label.trim() === "")
      return `navigation item ${i + 1} needs a "label"`;
    if (!isString(item.href)) return `navigation item ${i + 1} needs a "href"`;
    if (item.newTab !== undefined && !isBoolean(item.newTab))
      return `navigation item ${i + 1} "newTab" must be true or false`;
  }
  return null;
}

function languageError(template: Template, lang: "English" | "Latvian", value: unknown): string | null {
  if (!isObject(value)) return `${template} ${lang} content must be an object`;
  switch (template) {
    case "content": {
      const err =
        requiredTextError(value, ["title"], lang) ||
        optionalTextError(value, ["excerpt", "body", "ctaLabel", "metaTitle", "metaDescription"], lang);
      return err;
    }
    case "simple": {
      const err =
        requiredTextError(value, ["title"], lang) ||
        optionalTextError(value, ["body", "metaTitle", "metaDescription"], lang);
      return err;
    }
    case "home": {
      return requiredTextError(
        value,
        [
          "heroEyebrow",
          "heroTitle",
          "heroSubtitle",
          "heroPrimaryLabel",
          "heroSecondaryLabel",
          "eventsTitle",
          "eventsIntro",
          "exploreEyebrow",
          "exploreTitle",
          "exploreIntro",
        ],
        lang
      );
    }
    case "event": {
      const err =
        requiredTextError(value, ["title"], lang) || optionalTextError(value, ["body"], lang);
      return err;
    }
    case "navigation": {
      return validateNavItems(value.items, lang);
    }
    case "footer": {
      const err = optionalTextError(value, ["tagline", "address", "rights"], lang);
      return err || validateNavItems(value.items, lang);
    }
    case "site": {
      return requiredTextError(value, ["associationName"], lang) ||
        optionalTextError(value, ["tagline", "contactEmail"], lang);
    }
    case "donate": {
      const arrErr = (key: string) => {
        const arr = value[key];
        if (!Array.isArray(arr)) return `"${key}" must be a list for the ${lang} donation content`;
        for (let i = 0; i < arr.length; i++) {
          if (key === "features" && !isString(arr[i]))
            return `donation feature ${i + 1} must be text`;
          if (key === "priorityCards" || key === "donationCards") {
            const card = arr[i];
            if (!isObject(card)) return `${key} card ${i + 1} must be an object`;
            if (!isString(card.title) && key === "priorityCards")
              return `${key} card ${i + 1} needs a "title"`;
            if (key === "donationCards" && (!isNumber(card.amount) || card.amount <= 0))
              return `${key} card ${i + 1} needs a positive "amount"`;
            if (!isString(card.body)) return `${key} card ${i + 1} needs a "body"`;
            if (card.url !== undefined && !isString(card.url))
              return `${key} card ${i + 1} "url" must be text`;
            if (card.newTab !== undefined && !isBoolean(card.newTab))
              return `${key} card ${i + 1} "newTab" must be true or false`;
          }
        }
        return null;
      };
      const err =
        requiredTextError(value, ["title"], lang) ||
        optionalTextError(
          value,
          ["introduction", "bankName", "bsb", "accountNumber", "accountName", "payId", "instructions"],
          lang
        ) ||
        arrErr("features") ||
        arrErr("priorityCards") ||
        arrErr("donationCards");
      return err;
    }
  }
}

function settingsError(template: Template, value: unknown): string | null {
  if (!isObject(value)) return `${template} settings must be an object`;
  switch (template) {
    case "content":
      if (!isNullableString(value.imageId)) return 'settings "imageId" must be a media ID or null';
      if (!isString(value.ctaHref)) return 'settings "ctaHref" must be text';
      if (value.noIndex !== undefined && !isBoolean(value.noIndex))
        return 'settings "noIndex" must be true or false';
      return null;
    case "simple":
      if (value.noIndex !== undefined && !isBoolean(value.noIndex))
        return 'settings "noIndex" must be true or false';
      return null;
    case "home":
      if (!isNullableString(value.heroImageId)) return 'settings "heroImageId" must be a media ID or null';
      if (!isString(value.heroPrimaryHref)) return 'settings "heroPrimaryHref" must be text';
      if (!isString(value.heroSecondaryHref)) return 'settings "heroSecondaryHref" must be text';
      return null;
    case "event":
      if (!isString(value.eventDate)) return 'settings "eventDate" must be an ISO date string';
      if (!isString(value.facebookUrl)) return 'settings "facebookUrl" must be text';
      if (!isNullableString(value.imageId)) return 'settings "imageId" must be a media ID or null';
      if (!accentTones.includes(value.accentTone))
        return `settings "accentTone" must be one of ${accentTones.join(", ")}`;
      return null;
    case "site":
      if (value.socialLinks !== undefined) {
        if (!Array.isArray(value.socialLinks)) return 'settings "socialLinks" must be a list';
        for (let i = 0; i < value.socialLinks.length; i++) {
          const link = value.socialLinks[i];
          if (!isObject(link) || !isString(link.platform) || !isString(link.url))
            return `social link ${i + 1} needs "platform" and "url" text fields`;
        }
      }
      return null;
    default:
      // navigation, footer and donate records keep no language-independent settings
      return null;
  }
}

/** Validates both language objects for a template. Returns an error message or null. */
export function validateContent(template: Template, contentEn: unknown, contentLv: unknown): string | null {
  const en = languageError(template, "English", contentEn);
  if (en) return en;
  const lv = languageError(template, "Latvian", contentLv);
  if (lv) return lv;
  if (template === "navigation" || template === "footer") {
    const enItems = (contentEn as Obj).items as unknown[];
    const lvItems = (contentLv as Obj).items as unknown[];
    if (enItems.length !== lvItems.length)
      return "English and Latvian items must have the same length and order";
  }
  return null;
}

/** Validates the language-independent settings object. Returns an error message or null. */
export function validateSettings(template: Template, settings: unknown): string | null {
  return settingsError(template, settings);
}

/**
 * Slugify for event URLs: lowercase kebab-case with diacritics folded away.
 * Kept conservative because it only ever runs against English event titles.
 */
export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "event";
}

/** Parses the stored JSON columns of a row into objects (frontend contract). */
export function parseJsonObject(value: string | null | undefined): Obj {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    return isObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
