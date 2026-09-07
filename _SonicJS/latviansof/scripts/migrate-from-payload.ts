/**
 * Migration Script: Migrate published content from Payload CMS to SonicJS
 *
 * Idempotently seeds the SonicJS D1 database (documents + media_asset rows) and
 * the SonicJS R2 bucket (MEDIA_BUCKET) with the published Latvians of Darwin
 * website content used by the evaluation site:
 *
 *   - Fixed pages: home, about, history, community, membership, culture,
 *     contact, donate, privacy, terms, eula (template per record)
 *   - Community events (published, incl. production date/image fallbacks)
 *   - Navigation, footer, site settings and donation settings globals
 *   - Referenced CMS media and production static images mirrored into R2
 *
 * Content sources (production Payload REST API):
 *   /api/pages, /api/special-pages, /api/events, /api/globals/*
 *
 * Usage:
 *   Local:  tsx scripts/migrate-from-payload.ts
 *   Remote: tsx scripts/migrate-from-payload.ts --remote
 */

import { createHash } from 'crypto'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { execSync } from 'child_process'
import type { D1Database, R2Bucket } from '@cloudflare/workers-types'
import { bootstrapDocumentTypes } from '@sonicjs-cms/core'
import { getPlatformProxy } from 'wrangler'

const PAYLOAD_BASE = 'https://latviansofdarwin.org.au'

// ---------------------------------------------------------------------------
// Payload API shapes (narrowed from the live REST API; unknown stays unknown
// until proven by the guard helpers below).
// ---------------------------------------------------------------------------

export interface PayloadLangText {
  title?: string | null
  excerpt?: string | null
  body?: string | null
  content?: string | null
}

/** Arbitrary language-keyed global object (site-settings, donation-settings…). */
type LangBag = Record<string, unknown>

export interface PayloadMedia {
  id?: number | null
  alt?: string | null
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
}

export interface PayloadButton {
  label?: string | null
  link?: string | null
}

export interface PayloadLayoutBlock {
  blockType?: string | null
  en?: Record<string, unknown> | null
  lv?: Record<string, unknown> | null
  image?: unknown
  imagePosition?: string | null
  alignment?: string | null
  tone?: string | null
}

export interface PayloadDoc {
  slug?: string | null
  adminTitle?: string | null
  order?: number | null
  _status?: string | null
  en?: PayloadLangText | null
  lv?: PayloadLangText | null
  meta?: unknown
  layout?: unknown
  image?: unknown
  eventDate?: string | null
  accentTone?: string | null
  facebookUrl?: unknown
}

interface DocsResponse {
  docs?: unknown
}

// ---------------------------------------------------------------------------
// Narrowing helpers: turn unvalidated JSON into the shapes above.
// ---------------------------------------------------------------------------

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function strOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function numOrNull(value: unknown): number | null {
  return typeof value === 'number' ? value : null
}

function bool(value: unknown): boolean {
  return value === true
}

function parseLangText(value: unknown): PayloadLangText {
  const rec = asRecord(value)
  return {
    title: strOrNull(rec.title),
    excerpt: strOrNull(rec.excerpt),
    body: strOrNull(rec.body),
    content: strOrNull(rec.content),
  }
}

function parseLangBag(value: unknown): LangBag {
  return asRecord(value)
}

/** Minimal D1 statement surface used by this script. */
type Db = {
  prepare(sql: string): {
    bind(...args: unknown[]): {
      first(): Promise<unknown>
      run(): Promise<unknown>
      all(): Promise<{ results?: unknown[] }>
    }
  }
}

function parseMedia(value: unknown): PayloadMedia | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') {
    return value.startsWith('/api/') ? { url: value, filename: value.split('/').pop() } : null
  }
  const rec = asRecord(value)
  return {
    id: numOrNull(rec.id),
    alt: strOrNull(rec.alt),
    url: strOrNull(rec.url),
    filename: strOrNull(rec.filename),
    mimeType: strOrNull(rec.mimeType),
    filesize: numOrNull(rec.filesize),
    width: numOrNull(rec.width),
    height: numOrNull(rec.height),
  }
}

function parseButton(value: unknown): PayloadButton {
  const rec = asRecord(value)
  return { label: strOrNull(rec.label), link: strOrNull(rec.link) }
}

function parseDoc(value: unknown): PayloadDoc {
  const rec = asRecord(value)
  return {
    slug: strOrNull(rec.slug),
    adminTitle: strOrNull(rec.adminTitle),
    order: numOrNull(rec.order),
    _status: strOrNull(rec._status),
    en: parseLangText(rec.en),
    lv: parseLangText(rec.lv),
    meta: rec.meta,
    layout: rec.layout,
    image: rec.image,
    eventDate: strOrNull(rec.eventDate),
    accentTone: strOrNull(rec.accentTone),
    facebookUrl: rec.facebookUrl,
  }
}

function parseBlock(value: unknown): PayloadLayoutBlock {
  const rec = asRecord(value)
  return {
    blockType: strOrNull(rec.blockType),
    en: rec.en ? asRecord(rec.en) : null,
    lv: rec.lv ? asRecord(rec.lv) : null,
    image: rec.image,
    imagePosition: strOrNull(rec.imagePosition),
    alignment: strOrNull(rec.alignment),
    tone: strOrNull(rec.tone),
  }
}

function parseMetaDoc(value: unknown): Record<string, unknown> {
  return asRecord(value)
}

// ---------------------------------------------------------------------------
// Production visual-identity fallbacks (mirrors _Payload/src/lib/*)
// ---------------------------------------------------------------------------

/** Static production images mirrored into R2 and registered as media assets. */
const STATIC_IMAGES: string[] = [
  '/favicon.ico',
  '/images/logo.png',
  '/images/img1.webp',
  '/images/img2.webp',
  '/images/img3.webp',
  '/images/img4.webp',
  '/images/gathering1.jpg',
  '/images/gathering2.jpg',
  '/images/culture.png',
  '/images/may4.png',
  '/images/nov18.png',
  '/images/membership-welcome.webp',
  '/images/supporters/NT-goverment.webp',
  '/images/supporters/australain-red-cross.webp',
  '/images/supporters/australian-government.webp',
  '/images/supporters/melaluka.webp',
  '/images/supporters/uaant-logo.svg',
]

/** Per fixed content-page image used by production lib/pages.ts starters. */
const PAGE_IMAGE: Record<string, string> = {
  history: '/images/gathering2.jpg',
  community: '/images/img1.webp',
  membership: '/images/membership-welcome.webp',
  culture: '/images/culture.png',
}

/** Per-event fallback image/date/accent used by production lib/events.ts. */
const EVENT_FALLBACK_IMAGE: Record<string, string> = {
  lieldienas: '/images/img2.webp',
  may4: '/images/may4.png',
  jani: '/images/img3.webp',
  'baltijas-cels': '/images/img4.webp',
  nov18: '/images/nov18.png',
}

const EVENT_FALLBACK_DATE: Record<string, string> = {
  lieldienas: '2026-04-05',
  may4: '2026-05-04',
  jani: '2026-06-23',
  'baltijas-cels': '2026-08-23',
  nov18: '2026-11-18',
}

const EVENT_FALLBACK_ACCENT: Record<string, string> = {
  lieldienas: 'emerald',
  may4: 'sky',
  jani: 'amber',
  'baltijas-cels': 'rose',
  nov18: 'violet',
}

const isRemote = process.argv.includes('--remote')
const NOW = Math.floor(Date.now() / 1000)

function sqlEscape(val: unknown): string {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'number') return String(val)
  return `'${String(val).replace(/'/g, "''")}'`
}

async function fetchJson(endpoint: string): Promise<unknown> {
  const url = `${PAYLOAD_BASE}${endpoint}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`[migrate] Failed to fetch ${url}: ${res.status} ${res.statusText}`)
      return null
    }
    return (await res.json()) as unknown
  } catch (err) {
    console.error(`[migrate] Error fetching ${url}:`, err)
    return null
  }
}

async function fetchBytes(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`[migrate] Failed to fetch bytes ${url}: ${res.status} ${res.statusText}`)
      return null
    }
    const buf = await res.arrayBuffer()
    return Buffer.from(buf)
  } catch (err) {
    console.error(`[migrate] Error fetching bytes ${url}:`, err)
    return null
  }
}

function sha1Hex(input: string): string {
  return createHash('sha1').update(input).digest('hex')
}

function fileIdFor(key: string): string {
  return sha1Hex(key).substring(0, 21)
}

function extForUrl(url: string): string {
  const clean = url.split('?')[0]
  const ext = clean.split('.').pop() || ''
  return ext.length <= 6 && /^[A-Za-z0-9]+$/.test(ext) ? ext.toLowerCase() : 'bin'
}

function publicUrlFor(key: string): string {
  return `/files/${key}`
}

// ---------------------------------------------------------------------------
// Document + media SQL builders
// ---------------------------------------------------------------------------

interface DocItem {
  id: string
  typeId: string
  slug: string | null
  title: string
  sortOrder: number
  data: Record<string, unknown>
  publishedAt?: number
}

interface PendingMedia {
  key: string
  sourceUrl: string
  mimeType: string
  size: number
  alt: string
}

function buildUpsertSql(doc: DocItem): string {
  const dataJson = JSON.stringify(doc.data)
  const publishedAt = doc.publishedAt ?? NOW
  const dedupe = doc.slug
    ? `DELETE FROM documents WHERE type_id = ${sqlEscape(doc.typeId)} AND slug IS NOT NULL AND slug = ${sqlEscape(doc.slug)} AND is_current_draft = 1 AND id <> ${sqlEscape(doc.id)};\n`
    : ''
  return dedupe + `
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  ${sqlEscape(doc.id)}, ${sqlEscape(doc.id)}, ${sqlEscape(doc.typeId)}, 1, NULL, 1,
  1, 1, 'published', '', ${sqlEscape(doc.slug)}, NULL, ${sqlEscape(doc.title)}, NULL,
  ${doc.sortOrder}, 1, ${publishedAt}, NULL, NULL, NULL,
  'default', 'default', '', ${sqlEscape(dataJson)}, '{}',
  NULL, NULL, NULL, ${publishedAt}, ${publishedAt}
) ON CONFLICT(id) DO UPDATE SET
  type_id = excluded.type_id,
  slug = excluded.slug,
  title = excluded.title,
  sort_order = excluded.sort_order,
  data = excluded.data,
  is_published = 1,
  is_current_draft = 1,
  status = 'published',
  published_at = excluded.published_at,
  updated_at = unixepoch();
`.trim()
}

async function upsertLocal(db: Db, doc: DocItem): Promise<void> {
  const publishedAt = doc.publishedAt ?? Math.floor(Date.now() / 1000)
  const dataJson = JSON.stringify(doc.data)
  if (doc.slug) {
    await db
      .prepare(
        `DELETE FROM documents WHERE type_id = ? AND slug IS NOT NULL AND slug = ? AND is_current_draft = 1 AND id <> ?`
      )
      .bind(doc.typeId, doc.slug, doc.id)
      .run()
  }
  const existing = await db.prepare('SELECT id FROM documents WHERE id = ?').bind(doc.id).first()
  if (existing) {
    await db
      .prepare(
        `UPDATE documents
         SET type_id = ?, slug = ?, title = ?, sort_order = ?, data = ?, is_published = 1,
             is_current_draft = 1, status = 'published', published_at = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(doc.typeId, doc.slug, doc.title, doc.sortOrder, dataJson, publishedAt, publishedAt, doc.id)
      .run()
    console.log(`  ✓ Updated ${doc.typeId}: "${doc.title}" (${doc.id})`)
  } else {
    await db
      .prepare(
        `INSERT INTO documents (
          id, root_id, type_id, type_version, version_of_id, version_number,
          is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
          sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
          tenant_id, locale, translation_group_id, data, metadata,
          owner_id, created_by, updated_by, created_at, updated_at
        ) VALUES (?, ?, ?, 1, NULL, 1, 1, 1, 'published', '', ?, NULL, ?, NULL,
          ?, 1, ?, NULL, NULL, NULL, 'default', 'default', '', ?, '{}',
          NULL, NULL, NULL, ?, ?)`
      )
      .bind(
        doc.id, doc.id, doc.typeId, doc.slug, doc.title, doc.sortOrder,
        publishedAt, dataJson, publishedAt, publishedAt
      )
      .run()
    console.log(`  + Inserted ${doc.typeId}: "${doc.title}" (${doc.id})`)
  }
}

function mediaAssetData(media: PendingMedia): Record<string, unknown> {
  return {
    filename: media.key.split('/').pop(),
    originalName: media.key.split('/').pop(),
    mimeType: media.mimeType,
    size: media.size,
    width: null,
    height: null,
    folder: 'uploads',
    r2Key: media.key,
    alt: media.alt || '',
    caption: '',
    tags: [],
  }
}

function buildMediaAssetSql(media: PendingMedia): string {
  const dataJson = JSON.stringify(mediaAssetData(media))
  const title = media.key.split('/').pop()!
  return `
INSERT INTO documents (
  id, root_id, type_id, type_version, version_of_id, version_number,
  is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
  sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
  tenant_id, locale, translation_group_id, data, metadata,
  owner_id, created_by, updated_by, created_at, updated_at
) VALUES (
  ${sqlEscape(media.key)}, ${sqlEscape(media.key)}, 'media_asset', 1, NULL, 1,
  1, 1, 'published', '', NULL, NULL, ${sqlEscape(title)}, NULL,
  0, 1, ${NOW}, NULL, NULL, NULL, 'default', 'default', '', ${sqlEscape(dataJson)}, '{}',
  NULL, NULL, NULL, ${NOW}, ${NOW}
) ON CONFLICT(id) DO UPDATE SET
  title = excluded.title, data = excluded.data, is_published = 1,
  is_current_draft = 1, status = 'published', updated_at = excluded.updated_at;
`.trim()
}

async function insertMediaAssetLocal(db: Db, media: PendingMedia): Promise<void> {
  const dataJson = JSON.stringify(mediaAssetData(media))
  const title = media.key.split('/').pop()!
  await db
    .prepare(
      `INSERT INTO documents (
        id, root_id, type_id, type_version, version_of_id, version_number,
        is_current_draft, is_published, status, parent_root_id, slug, path, title, zone,
        sort_order, visible, published_at, scheduled_at, expires_at, deleted_at,
        tenant_id, locale, translation_group_id, data, metadata,
        owner_id, created_by, updated_by, created_at, updated_at
      ) VALUES (?, ?, 'media_asset', 1, NULL, 1, 1, 1, 'published', '', NULL, NULL, ?, NULL,
        0, 1, ?, NULL, NULL, NULL, 'default', 'default', '', ?, '{}',
        NULL, NULL, NULL, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title, data = excluded.data, is_published = 1,
        is_current_draft = 1, status = 'published', updated_at = excluded.updated_at`
    )
    .bind(media.key, media.key, title, NOW, dataJson, NOW, NOW)
    .run()
}

// ---------------------------------------------------------------------------
// Content mapping helpers (mirror _Payload/src/lib/{pages,events}.ts)
// ---------------------------------------------------------------------------

/** Extract the concatenated rich-text bodies of all `content` layout blocks. */
function contentBlockText(blocks: PayloadLayoutBlock[], lang: 'en' | 'lv'): string {
  const langObj = lang === 'en' ? 'en' : 'lv'
  return blocks
    .filter((b) => b.blockType === 'content')
    .map((b) => str(b[langObj]?.body))
    .filter((t) => t.length > 0)
    .join('\n\n')
}

/** Resolve the hero block image source (payload media) or the fallback image. */
function heroBlockImage(blocks: PayloadLayoutBlock[]): string | null {
  for (const b of blocks) {
    if (b.blockType !== 'hero') continue
    const media = parseMedia(b.image)
    if (media?.url) return media.url
  }
  return null
}

function ctaFromBlocks(blocks: PayloadLayoutBlock[]): {
  ctaLabel_en: string
  ctaLabel_lv: string
  ctaHref: string
} {
  const empty = { ctaLabel_en: '', ctaLabel_lv: '', ctaHref: '' }
  const cta = blocks.find((b) => b.blockType === 'cta')
  if (!cta) return empty
  const enButtons = asArray(cta.en?.buttons).map(parseButton)
  const lvButtons = asArray(cta.lv?.buttons).map(parseButton)
  const enBtn = enButtons[0]
  const lvBtn = lvButtons[0]
  return {
    ctaLabel_en: enBtn?.label ?? '',
    ctaLabel_lv: lvBtn?.label ?? '',
    ctaHref: enBtn?.link ?? lvBtn?.link ?? '',
  }
}

/** Absolute source URL for a payload media ref (string URL or media object). */
function mediaSourceUrl(value: unknown): string | null {
  if (typeof value === 'string') {
    if (value.length === 0) return null
    return value.startsWith('http') ? value : `${PAYLOAD_BASE}${value}`
  }
  const media = parseMedia(value)
  if (!media) return null
  const raw = media.url || media.filename
  if (!raw) return null
  return raw.startsWith('http') ? raw : `${PAYLOAD_BASE}${raw}`
}

function mimeForPath(p: string): string {
  if (p.endsWith('.svg')) return 'image/svg+xml'
  if (p.endsWith('.ico')) return 'image/x-icon'
  if (p.endsWith('.png')) return 'image/png'
  if (p.endsWith('.jpg') || p.endsWith('.jpeg')) return 'image/jpeg'
  if (p.endsWith('.gif')) return 'image/gif'
  return 'image/webp'
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

async function migrate(): Promise<void> {
  console.log(`[migrate] Starting migration (${isRemote ? 'REMOTE' : 'LOCAL'})...`)

  const remoteSqlList: string[] = []
  const docs: DocItem[] = []
  const pendingMedia: PendingMedia[] = []
  const remoteTempDir = isRemote
    ? fs.mkdtempSync(path.join(os.tmpdir(), 'sonic-migrate-'))
    : null

  // 0. Local platform proxy (DB + R2 bindings) -------------------------------
  let localDb: Db | null = null
  let localBucket: R2Bucket | null = null
  let localDispose: (() => Promise<void>) | null = null
  if (!isRemote) {
    const { env, dispose } = await getPlatformProxy({ configPath: 'wrangler.jsonc' })
    // Miniflare proxy bindings structurally match the workers-types contracts.
    localDb = env.DB as unknown as Db
    localBucket = env.MEDIA_BUCKET as unknown as R2Bucket
    localDispose = dispose
    console.log('[migrate] Ensuring document types registered in local D1...')
    await bootstrapDocumentTypes(env.DB as unknown as D1Database)
    console.log('[migrate] Bootstrapped document types.')
  }

  const documentTypes = [
    { id: 'pages', name: 'pages', display: 'Pages', desc: 'Bilingual Pages' },
    { id: 'events', name: 'events', display: 'Events', desc: 'Community Events' },
    { id: 'navigation', name: 'navigation', display: 'Navigation', desc: 'Header Menu' },
    { id: 'footer', name: 'footer', display: 'Footer', desc: 'Site Footer' },
    { id: 'site_settings', name: 'site_settings', display: 'Site Settings', desc: 'Global Site Settings' },
  ]

  if (isRemote) {
    remoteSqlList.push(
      documentTypes
        .map(
          (c) =>
            `INSERT INTO document_types (id, name, display_name, description, schema, source, is_active)
VALUES (${sqlEscape(c.id)}, ${sqlEscape(c.name)}, ${sqlEscape(c.display)}, ${sqlEscape(c.desc)}, '{}', 'code', 1)
ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, is_active = 1;`.trim()
        )
        .join('\n')
    )
  } else if (localDb) {
    for (const c of documentTypes) {
      await localDb
        .prepare(
          `INSERT INTO document_types (id, name, display_name, description, schema, source, is_active)
           VALUES (?, ?, ?, ?, '{}', 'code', 1)
           ON CONFLICT(id) DO UPDATE SET display_name = excluded.display_name, is_active = 1`
        )
        .bind(c.id, c.name, c.display, c.desc)
        .run()
    }
  }

  // 1. Static production images -----------------------------------------------
  console.log('\n[migrate] 1. Mirroring static production images...')
  const staticUrlToPublic = new Map<string, string>()
  for (const img of STATIC_IMAGES) {
    const key = `uploads/${fileIdFor(`static${img}`)}.${extForUrl(img)}`
    const publicUrl = publicUrlFor(key)
    staticUrlToPublic.set(img, publicUrl)
    staticUrlToPublic.set(`${PAYLOAD_BASE}${img}`, publicUrl)
    pendingMedia.push({
      key,
      sourceUrl: `${PAYLOAD_BASE}${img}`,
      mimeType: mimeForPath(img),
      size: 0,
      alt: '',
    })
  }

  // 2. Content pages (all published Payload pages: fixed + news) ------------
  console.log('\n[migrate] 2. Fetching Pages...')
  const pagesResponse = asRecord(await fetchJson('/api/pages?depth=1&limit=100&draft=false'))
  const payloadPages = asArray(pagesResponse.docs).map(parseDoc)
  const fixedOrder: Record<string, number> = {
    history: 20, community: 30, membership: 40, culture: 50,
  }
  const seenSlugs = new Set<string>()
  for (const p of payloadPages) {
    if (!p.slug || seenSlugs.has(p.slug)) continue
    seenSlugs.add(p.slug)
    const isFixed = p.slug in fixedOrder
    const order = p.order ?? fixedOrder[p.slug] ?? 10
    const blocks = asArray(p.layout).map(parseBlock)
    const en = p.en ?? {}
    const lv = p.lv ?? {}
    const meta = parseMetaDoc(p.meta)
    const cta = ctaFromBlocks(blocks)
    const heroMediaUrl = heroBlockImage(blocks) ?? mediaSourceUrl(meta.image)

    let heroImageUrl = ''
    if (heroMediaUrl) {
      const source = typeof heroMediaUrl === 'string' && heroMediaUrl.startsWith('http')
        ? heroMediaUrl
        : mediaSourceUrl(heroMediaUrl)
      if (source) {
        const key = `uploads/${fileIdFor(source)}.${extForUrl(source)}`
        heroImageUrl = publicUrlFor(key)
        pendingMedia.push({ key, sourceUrl: source, mimeType: mimeForPath(source), size: 0, alt: '' })
      }
    }
    if (!heroImageUrl) {
      const fb = isFixed ? (PAGE_IMAGE[p.slug] || '/images/img1.webp') : '/images/img1.webp'
      heroImageUrl = staticUrlToPublic.get(fb) || ''
    }

    const enBody = str(en.body) || contentBlockText(blocks, 'en')
    const lvBody = str(lv.body) || contentBlockText(blocks, 'lv')

    docs.push({
      id: `page-${p.slug}`,
      typeId: 'pages',
      slug: p.slug,
      title: str(en.title) || str(p.adminTitle) || p.slug,
      sortOrder: order,
      data: {
        slug: p.slug,
        template: 'content',
        sortOrder: order,
        title_en: str(en.title) || str(p.adminTitle) || p.slug,
        title_lv: str(lv.title) || str(p.adminTitle) || p.slug,
        excerpt_en: str(en.excerpt),
        excerpt_lv: str(lv.excerpt),
        body_en: enBody,
        body_lv: lvBody,
        heroImage: heroImageUrl || null,
        ctaLabel_en: cta.ctaLabel_en,
        ctaLabel_lv: cta.ctaLabel_lv,
        ctaHref: cta.ctaHref,
        metaTitle_en: str(meta.title) || str(en.title) || '',
        metaTitle_lv: str(meta.title) || str(lv.title) || '',
        metaDescription_en: str(meta.description) || str(en.excerpt) || '',
        metaDescription_lv: str(meta.description) || str(lv.excerpt) || '',
        noIndex: bool(meta.noIndex),
      },
    })
    console.log(`  → page ${p.slug} (order ${order})`)
  }

  // 3. Special (simple) pages -------------------------------------------------
  console.log('\n[migrate] 3. Fetching Special Pages...')
  const SPECIAL_SLUGS = ['about', 'contact', 'privacy', 'terms', 'eula']
  const specialOrder: Record<string, number> = {
    about: 60, contact: 70, privacy: 80, terms: 90, eula: 100,
  }
  const specialsResponse = asRecord(await fetchJson('/api/special-pages?depth=1&limit=100&draft=false'))
  const specialDocs = asArray(specialsResponse.docs).map(parseDoc)
  const specialBySlug = new Map<string, PayloadDoc>()
  for (const sp of specialDocs) {
    if (sp.slug && SPECIAL_SLUGS.includes(sp.slug)) specialBySlug.set(sp.slug, sp)
  }

  for (const slug of SPECIAL_SLUGS) {
    const sp = specialBySlug.get(slug)
    if (!sp) {
      console.warn(`[migrate] Special page "${slug}" not found; skipping.`)
      continue
    }
    const en = sp.en ?? {}
    const lv = sp.lv ?? {}
    const metaEn = parseMetaDoc(asRecord(sp.meta).en)
    const metaLv = parseMetaDoc(asRecord(sp.meta).lv)
    const order = specialOrder[slug]
    docs.push({
      id: `page-${slug}`,
      typeId: 'pages',
      slug,
      title: str(en.title) || str(sp.adminTitle) || slug,
      sortOrder: order,
      data: {
        slug,
        template: 'simple',
        sortOrder: order,
        title_en: str(en.title) || str(sp.adminTitle) || slug,
        title_lv: str(lv.title) || str(sp.adminTitle) || slug,
        body_en: str(en.content),
        body_lv: str(lv.content),
        heroImage: null,
        ctaLabel_en: '',
        ctaLabel_lv: '',
        ctaHref: '',
        metaTitle_en: str(metaEn.title) || str(en.title) || '',
        metaTitle_lv: str(metaLv.title) || str(lv.title) || '',
        metaDescription_en: str(metaEn.description) || '',
        metaDescription_lv: str(metaLv.description) || '',
        noIndex: bool(asRecord(sp.meta).noIndex),
      },
    })
    console.log(`  → special ${slug}`)
  }

  // 4. Synthetic fixed pages: home + donate -----------------------------------
  console.log('\n[migrate] 4. Adding fixed home/donate pages...')
  const homeHeroUrl = staticUrlToPublic.get('/images/img1.webp') || ''
  docs.push(
    {
      id: 'page-home',
      typeId: 'pages',
      slug: 'home',
      title: 'Home',
      sortOrder: 1,
      data: {
        slug: 'home',
        template: 'home',
        sortOrder: 1,
        title_en: 'Latvian Association of Darwin',
        title_lv: 'Dārvinas Latviešu Apvienība',
        excerpt_en: '',
        excerpt_lv: '',
        body_en: '',
        body_lv: '',
        heroImage: homeHeroUrl || null,
        ctaLabel_en: '',
        ctaLabel_lv: '',
        ctaHref: '',
        metaTitle_en: 'Latvian Association of Darwin | Top End Community',
        metaTitle_lv: 'Dārvinas Latviešu Apvienība | Ziemeļu Teritorijas latvieši',
        metaDescription_en: '',
        metaDescription_lv: '',
        noIndex: false,
      },
    },
    {
      id: 'page-donate',
      typeId: 'pages',
      slug: 'donate',
      title: 'Donate',
      sortOrder: 6,
      data: {
        slug: 'donate',
        template: 'donate',
        sortOrder: 6,
        title_en: 'Donate',
        title_lv: 'Ziedot',
        excerpt_en: '',
        excerpt_lv: '',
        body_en: '',
        body_lv: '',
        heroImage: null,
        ctaLabel_en: '',
        ctaLabel_lv: '',
        ctaHref: '',
        metaTitle_en: 'Donate | Latvian Association of Darwin',
        metaTitle_lv: 'Ziedot | Dārvinas Latviešu Apvienība',
        metaDescription_en: 'Support the Latvian Association of Darwin',
        metaDescription_lv: 'Atbalstiet Dārvinas Latviešu Apvienību',
        noIndex: false,
      },
    }
  )

  // 5. Events ------------------------------------------------------------------
  console.log('\n[migrate] 5. Fetching Events...')
  const eventsResponse = asRecord(await fetchJson('/api/events?depth=1&limit=100&draft=false'))
  const eventDocs = asArray(eventsResponse.docs).map(parseDoc)
  for (const e of eventDocs) {
    const en = e.en ?? {}
    const lv = e.lv ?? {}
    const fallbackImage = EVENT_FALLBACK_IMAGE[e.slug || ''] || '/images/img1.webp'
    let imageUrl = ''

    const source = mediaSourceUrl(e.image)
    if (source) {
      const key = `uploads/${fileIdFor(source)}.${extForUrl(source)}`
      imageUrl = publicUrlFor(key)
      const media = parseMedia(e.image)
      pendingMedia.push({
        key,
        sourceUrl: source,
        mimeType: media?.mimeType ?? mimeForPath(source),
        size: media?.filesize ?? 0,
        alt: media?.alt ?? str(en.title) ?? '',
      })
    } else {
      imageUrl = staticUrlToPublic.get(fallbackImage) || ''
    }

    const fbUrl = typeof e.facebookUrl === 'string' ? e.facebookUrl.trim() : ''
    const eventSlug = e.slug ?? ''
    docs.push({
      id: `event-${eventSlug}`,
      typeId: 'events',
      slug: eventSlug,
      title: str(en.title) || str(e.adminTitle) || eventSlug || 'Event',
      sortOrder: e.order ?? 10,
      data: {
        slug: e.slug,
        title_en: str(en.title) || str(e.adminTitle) || e.slug || '',
        title_lv: str(lv.title) || str(e.adminTitle) || e.slug || '',
        eventDate: e.eventDate || EVENT_FALLBACK_DATE[e.slug || ''] || null,
        body_en: str(en.body),
        body_lv: str(lv.body),
        image: imageUrl || null,
        facebookUrl: fbUrl.length > 0 ? fbUrl : undefined,
        accentTone: e.accentTone || EVENT_FALLBACK_ACCENT[e.slug || ''] || 'rose',
        sortOrder: e.order ?? 10,
      },
    })
    console.log(`  → event ${e.slug}`)
  }

  // 6. Navigation ---------------------------------------------------------------
  console.log('\n[migrate] 6. Fetching Navigation Menu...')
  const mainMenu = asRecord(await fetchJson('/api/globals/main-menu'))
  const menuItems = asArray(mainMenu.items).map((raw) => {
    const rec = asRecord(raw)
    return {
      href: str(rec.href),
      en: str(rec.en),
      lv: str(rec.lv),
      newTab: bool(rec.newTab),
    }
  })
  if (menuItems.length > 0) {
    docs.push({
      id: 'nav-main-menu',
      typeId: 'navigation',
      slug: 'main-menu',
      title: 'Main Navigation Menu',
      sortOrder: 0,
      data: { name: 'main-menu', items: menuItems },
    })
  }

  // 7. Footer -------------------------------------------------------------------
  console.log('\n[migrate] 7. Fetching Footer...')
  const footerData = asRecord(await fetchJson('/api/globals/footer'))
  const footerEn = parseLangBag(footerData.en)
  const footerLv = parseLangBag(footerData.lv)
  const footerItems = asArray(footerData.items).map((raw) => {
    const rec = asRecord(raw)
    return {
      href: str(rec.href),
      en: str(rec.en),
      lv: str(rec.lv),
      newTab: bool(rec.newTab),
    }
  })
  docs.push({
    id: 'footer-default',
    typeId: 'footer',
    slug: 'default-footer',
    title: 'Site Footer',
    sortOrder: 0,
    data: {
      name: 'default-footer',
      tagline_en: str(footerEn.tagline),
      tagline_lv: str(footerLv.tagline),
      address_en: str(footerEn.address),
      address_lv: str(footerLv.address),
      rights_en: str(footerEn.rights),
      rights_lv: str(footerLv.rights),
      items: footerItems,
    },
  })

  // 8. Site settings + donation settings ----------------------------------------
  console.log('\n[migrate] 8. Fetching Site Settings & Donation Settings...')
  const [siteSettingsRaw, donationRaw] = await Promise.all([
    fetchJson('/api/globals/site-settings'),
    fetchJson('/api/globals/donation-settings'),
  ])
  const siteSettings = asRecord(siteSettingsRaw)
  const siteEn = parseLangBag(siteSettings.en)
  const siteLv = parseLangBag(siteSettings.lv)
  const socialLinks = asArray(siteSettings.socialLinks).map((raw) => {
    const rec = asRecord(raw)
    return { platform: str(rec.platform), url: str(rec.url) }
  })

  const donationSettings = asRecord(donationRaw)
  const dsEn = parseLangBag(donationSettings.en)
  const dsLv = parseLangBag(donationSettings.lv)

  docs.push({
    id: 'settings-default',
    typeId: 'site_settings',
    slug: 'default-settings',
    title: 'Site Settings',
    sortOrder: 0,
    data: {
      key: 'default-settings',
      associationName_en: str(siteEn.associationName) || 'Latvian Association of Darwin',
      associationName_lv: str(siteLv.associationName) || 'Dārvinas Latviešu Apvienība',
      tagline_en: str(siteEn.tagline),
      tagline_lv: str(siteLv.tagline),
      contactEmail:
        str(siteEn.contactEmail) || str(siteLv.contactEmail) || 'support@latviansofdarwin.org.au',
      socialLinks,
      bankName_en: str(dsEn.bankName) || 'Not configured',
      bankName_lv: str(dsLv.bankName) || 'Not configured',
      bsb: str(dsEn.bsb) || 'Not configured',
      accountNumber: str(dsEn.accountNumber) || 'Not configured',
      accountName_en: str(dsEn.accountName) || 'Not configured',
      accountName_lv: str(dsLv.accountName) || 'Not configured',
      payId_en: str(dsEn.payId) || 'Not configured',
      payId_lv: str(dsLv.payId) || 'Not configured',
      instructions_en: str(dsEn.instructions),
      instructions_lv: str(dsLv.instructions),
      priorityLinks: donationSettings.priorityLinks ?? [],
      donationOptions: donationSettings.donationOptions ?? [],
      features: donationSettings.features ?? [],
    },
  })

  // 9. Upload media to R2 + register media_asset documents ----------------------
  console.log(`\n[migrate] 9. Uploading ${pendingMedia.length} media objects...`)
  for (const media of pendingMedia) {
    const bytes = await fetchBytes(media.sourceUrl)
    if (!bytes) continue
    media.size = bytes.length
    if (isRemote) {
      const tmpFile = path.join(remoteTempDir!, media.key.split('/').pop()!)
      fs.writeFileSync(tmpFile, bytes)
      execSync(
        `npx wrangler r2 object put latviansof-sonicjs-media/${media.key} --file="${tmpFile}" --content-type "${media.mimeType}" --remote -c wrangler.jsonc`,
        { stdio: 'inherit', env: process.env }
      )
      remoteSqlList.push(buildMediaAssetSql(media))
    } else if (localBucket && localDb) {
      await localBucket.put(media.key, bytes, {
        httpMetadata: { contentType: media.mimeType },
      })
      await insertMediaAssetLocal(localDb, media)
    }
  }

  // 10. Write content documents ---------------------------------------------------
  console.log(`\n[migrate] 10. Writing ${docs.length} documents...`)
  for (const doc of docs) {
    if (isRemote) {
      remoteSqlList.push(buildUpsertSql(doc))
    } else if (localDb) {
      await upsertLocal(localDb, doc)
    }
  }

  if (isRemote) {
    const sqlContent = remoteSqlList.join('\n\n')
    const sqlPath = path.join(process.cwd(), 'scripts', 'seed-data.sql')
    fs.writeFileSync(sqlPath, sqlContent)
    console.log(`\n[migrate] Executing ${remoteSqlList.length} statements on remote D1...`)
    execSync(`npx wrangler d1 execute DB --remote --file="${sqlPath}" -c wrangler.jsonc`, {
      stdio: 'inherit',
      env: process.env,
    })
    console.log('\n✓ Remote D1 seeded successfully with live Payload content!')
    if (remoteTempDir) fs.rmSync(remoteTempDir, { recursive: true, force: true })
  } else {
    console.log('\n✓ Content migration to local D1 completed successfully!')
    await localDispose?.()
  }
}

migrate().catch((err: unknown) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
