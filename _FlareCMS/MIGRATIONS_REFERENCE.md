# Database Migrations Reference

## Overview

This document catalogs all database migrations from the latviansof project. There are two main migration systems:

1. **Payload CMS Migrations** (`/src/migrations/`) - D1 SQLite via Payload 3
2. **SonicJS Migrations** (`/_SonicJS/latviansof/migrations/`) - Better-Auth schema + content tables

---

## Payload CMS Migrations (Production Site)

**Location:** `/Users/vasilkoff/Projects/latviansof/src/migrations/`  
**Database:** Cloudflare D1 (SQLite)  
**Purpose:** Main website schema, pages, events, collections, globals

### Migration List (Chronological Order)

| Date | Name | Purpose |
|------|------|---------|
| 2025-09-29 | `20250929_111647` | Initial schema |
| 2026-06-09 | `20260609_053333_block_pages` | Add block-based page structure |
| 2026-06-09 | `20260609_122916` | Core collections setup |
| 2026-06-09 | `20260609_123744` | Versioning/drafts |
| 2026-06-09 | `20260609_152706_add_culture_contact_pages` | Culture & contact pages |
| 2026-06-09 | `20260609_153453_add_events_collection` | Events collection |
| 2026-06-10 | `20260610_073953` | Media collection |
| 2026-06-10 | `20260610_074744` | Users collection |
| 2026-06-10 | `20260610_103232_add_footer_and_special_pages` | Footer global + special pages |
| 2026-06-10 | `20260610_105121_move_about_to_special_pages` | Refactor: about → special pages |
| 2026-06-10 | `20260610_112000_backfill_event_versions` | Backfill versioned event data |
| 2026-06-10 | `20260610_113750_move_contact_to_special_pages` | Refactor: contact → special pages |
| 2026-06-11 | `20260611_105341` | Final schema adjustments |
| 2026-06-11 | `20260611_194132_backfill_special_page_versions` | Backfill special page versions |
| 2026-06-11 | `20260611_201944_repair_page_versions` | Repair orphaned version rows |
| 2026-07-28 | `20260728_041536` | Payload version update |
| 2026-07-28 | `20260728_042055` | Schema validation |
| 2026-07-28 | `20260728_074335` | Final cleanup |
| 2026-08-25 | `20260825_143000_add_body_to_pages` | Add body field to pages |

### Key Collections

- **Pages** - Main content pages with versioning/drafts
- **SpecialPages** - About, Contact, etc. (refactored into collection)
- **Events** - Upcoming events with dates and images
- **Media** - Images and file uploads
- **Users** - Admin users
- **Globals:**
  - `Homepage` - Hero section, featured content
  - `MainMenu` - Primary navigation
  - `Footer` - Footer links and info
  - `SiteSettings` - Global config
  - `DonationSettings` - Donation CTA config

### Running Migrations

```bash
# In the Payload project
pnpm payload migrate:create --name "descriptive_name"
pnpm payload migrate:up
pnpm run deploy:database  # Deploys to remote D1
```

**Important:** After schema changes:
1. Create migration
2. Generate types: `pnpm run generate:types:payload`
3. Deploy database first
4. Deploy app (Worker)

---

## SonicJS Migrations (Alternative CMS)

**Location:** `/Users/vasilkoff/Projects/latviansof/_SonicJS/latviansof/migrations/`  
**Database:** SQLite (local or better-auth cloud)  
**Purpose:** Alternative CMS schema with Better-Auth + document management

### Migration List

| File | Purpose |
|------|---------|
| `0001_core.sql` | Auth tables (auth_user, auth_session, auth_account, auth_verification) |
| `0002_documents.sql` | Document/content tables (document_*) |
| `0003_session_org.sql` | Session & organization tables |
| `0004_forms.sql` | Form submission tables |
| `README.md` | Setup instructions |

### 0001_core.sql - Authentication Schema

**Tables:**
- `auth_user` - User profile + SonicJS fields (first_name, last_name, role, avatar, timezone, language, etc.)
- `auth_session` - Session management (token, expires_at)
- `auth_account` - OAuth/provider integration
- `auth_verification` - Email verification

**Indexes:** email, role, invitation_token, locked_until

### 0002_documents.sql - Content Schema

Content table structure for CMS documents (dynamically created per document type)

### 0003_session_org.sql - Multi-tenancy

Organization & session tables for multi-tenant support

### 0004_forms.sql - Form Submissions

Form builder & submission tracking tables

---

## _FlareCMS (This Project)

**Current Status:** Frontend-only blog CMS interface  
**Database:** None (needs backend integration)

### Recommended Next Steps

To make _FlareCMS functional, choose one:

#### Option A: Mock Backend (For Dev)
Create mock API endpoints that simulate `/api/posts` and `/api/labels`:
```typescript
// _FlareCMS/src/api/mock.ts
export const mockPosts = [
  { rowid: 1, title: "Welcome", content: "# Hello", status: "publish", published: Date.now(), ... }
];
```

#### Option B: Payload CMS Integration
Connect _FlareCMS to the production Payload API:
```typescript
const baseUrl = "https://latviansofdarwin.org.au/api";
// Or locally: http://localhost:3000/api (after deploying Payload Worker)
```

#### Option C: SonicJS Integration
Use SonicJS as backend with `/api/documents` endpoints

---

## File Structure Reference

```
latviansof/
├── src/migrations/              # Payload migrations (19 files)
│   ├── index.ts                 # Migration registry
│   ├── 20250929_111647.*        # Initial schema
│   ├── 20260609_*.* to 20260825 # Progressive updates
│   └── [others]
├── _SonicJS/latviansof/
│   ├── migrations/              # SonicJS SQL migrations (4 files)
│   ├── src/                     # SonicJS source
│   └── package.json
└── _FlareCMS/                   # This project
    ├── src/
    │   ├── theme.ts             # Payload-inspired theme
    │   ├── App.tsx              # Layout with sidebar
    │   ├── Sidebar.tsx          # Navigation
    │   ├── PostDetail.tsx       # Post view
    │   └── api/                 # [Needs implementation]
    └── package.json
```

---

## How to Copy/Use Migrations

### For Payload Migrations:

```bash
# View migration history
cd /Users/vasilkoff/Projects/latviansof
ls src/migrations/

# Copy specific migration to another project
cp src/migrations/20260609_053333_block_pages.ts ../other-project/migrations/

# Run migrations against D1
pnpm run deploy:database
```

### For SonicJS Migrations:

```bash
# View SQL schema
cd /Users/vasilkoff/Projects/latviansof/_SonicJS/latviansof
cat migrations/0001_core.sql

# Apply to SQLite database
sqlite3 database.db < migrations/0001_core.sql
```

---

## Key Takeaways

✅ **Payload** = Production site (latviansofdarwin.org.au)  
✅ **SonicJS** = Alternative CMS framework with Better-Auth  
⏳ **_FlareCMS** = Blog UI frontend (needs API backend)  

To make _FlareCMS work:
1. Mock API endpoints, OR
2. Connect to Payload/SonicJS backend, OR
3. Implement minimal blog server with SQLite + migrations

See `/Users/vasilkoff/Projects/latviansof/AGENTS.md` for Payload CMS workflow details.
