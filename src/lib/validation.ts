import { z } from 'zod'

/**
 * Strict runtime schemas for the bilingual content map.
 * These run at module load against the hard-coded `en` / `lv` objects in
 * `i18n/content.ts` and (later) against anything Payload CMS returns from the
 * `pages` global / `events` collection. When validation fails the LanguageProvider
 * falls back to English so the UI is never broken.
 */

export const LangSchema = z.enum(['en', 'lv'])

export const NavSchema = z.object({
  about: z.string().min(1),
  history: z.string().min(1),
  events: z.string().min(1),
  skipToContent: z.string().min(1),
})

export const HeroSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  cta: z.string().min(1),
})

export const TextBlockSchema = z.object({
  title: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
})

export const EventItemSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'event id must be kebab-case'),
  title: z.string().min(1),
  body: z.string().min(1),
})

export const EventsSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  items: z.array(EventItemSchema).min(1),
})

export const FooterSchema = z.object({
  tagline: z.string().min(1),
  contact: z.string().min(1),
  rights: z.string().min(1),
  address: z.string().min(1),
  languageLabel: z.string().min(1),
})

export const SiteContentSchema = z.object({
  nav: NavSchema,
  hero: HeroSchema,
  about: TextBlockSchema,
  history: TextBlockSchema,
  events: EventsSchema,
  footer: FooterSchema,
})

export type SiteContentValidated = z.infer<typeof SiteContentSchema>

/**
 * Validate any object as a `SiteContent`. Returns a discriminated result so the
 * LanguageProvider can choose to log + fall back instead of throwing.
 */
export function validateSiteContent(input: unknown):
  | { ok: true; data: SiteContentValidated }
  | { ok: false; error: z.ZodError } {
  const result = SiteContentSchema.safeParse(input)
  return result.success
    ? { ok: true, data: result.data }
    : { ok: false, error: result.error }
}
