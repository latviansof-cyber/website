# Latvian Association of Darwin Website

The public website and Payload CMS for the Latvian Association of Darwin
(`Dārvinas Latviešu Apvienība`).

## Project Overview

- **Frontend:** Next.js 16, React 19, and Tailwind CSS
- **CMS:** Payload 3 with a bilingual English/Latvian content model
- **Database:** Cloudflare D1 through Payload's D1 SQLite adapter
- **Media:** Cloudflare R2 through the Payload R2 storage adapter
- **Hosting:** Cloudflare Workers through OpenNext

### Editable Content

- **Pages:** About, History, Community, Membership, Culture, Contact, and future editorial pages
- **Page builder:** Hero, Content, and Call to Action blocks
- **Events:** Ordered bilingual event cards with images and accent colors
- **Homepage:** Hero content, Hero links/image, and Events section heading/introduction
- **Main Menu:** Ordered bilingual header links
- **Media:** Uploaded images with required alt text
- **Users:** Payload administrator accounts

Pages and Events support drafts, autosave, publishing, and version history. Homepage,
Main Menu, Media, and Users save directly.

### Frontend Behavior

- The homepage displays published Pages in their configured Page order.
- The Events section displays published Events in their configured Event order.
- Header navigation is controlled independently by the Main Menu global.
- Content loaders use built-in fallback content if Payload or D1 is temporarily unavailable.
- English and Latvian content is switched client-side.
- Page metadata includes canonical URLs, Open Graph/Twitter data, robots controls, and structured data.

### Analytics

Google Analytics 4 is loaded on frontend pages with measurement ID `G-54WF6RB2HX`.

## Infrastructure & Deployment

The website runs on Cloudflare Workers using:

- **D1** for Payload content and authentication data
- **R2** for uploaded media
- **OpenNext** to package the Next.js application for Workers
- **Wrangler** for bindings, migrations, observability, and deployment

### Deployment Process

Run:

```bash
pnpm deploy
```

This command:

1. Runs pending Payload migrations against the remote D1 database
2. Optimizes D1
3. Builds the Next.js application with Webpack and OpenNext
4. Deploys the Worker bundle with Wrangler

The repository does not assume a particular CI/CD provider. Any automated deployment must run the same migration and application deployment steps.

### Storage & Media

- **Images**: Uploaded through Payload and stored in the configured R2 bucket
- **Database**: Payload uses the D1 SQLite adapter
- **Image processing**: Crop and focal-point tools are disabled because Sharp is not supported in this Workers setup
- **Delivery**: No separate CDN or R2 custom domain is configured in this repository

### Database Migrations

Migrations are version-controlled as JSON schema snapshots and TypeScript files in `src/migrations/`. Create a migration after changing the Payload schema:

```bash
pnpm payload migrate:create
```

Review the generated SQL and seed logic before deploying. Migrations run through `pnpm deploy:database`; they do not run automatically on every application request.

### Cloudflare Usage

Plan limits and pricing can change and are not encoded in this repository. Check the [Cloudflare Dashboard](https://dash.cloudflare.com) and current Cloudflare documentation for the account's actual plan, usage, and limits.

### Observability & Logs

Workers Logs are enabled in `wrangler.jsonc` with full head sampling, persistence, and invocation logs. Traces are disabled. Payload uses a production-only JSON console logger, and its level can be set with `PAYLOAD_LOG_LEVEL`.

## Available Commands

All project commands use `pnpm`. Here are the most commonly used:

### Development

- **`pnpm dev`** — Start the Next.js development server on `http://localhost:3000`
- **`pnpm devsafe`** — Clean build artifacts and start dev server (use if experiencing build issues)

### Building & Type Generation

- **`pnpm build`** — Build the Next.js app with Webpack (8GB memory limit to prevent OOM)
- **`pnpm generate:types`** — Regenerate all TypeScript types from Payload schema and Cloudflare
- **`pnpm generate:types:payload`** — Regenerate Payload collection and field types to `payload-types.ts`
- **`pnpm generate:types:cloudflare`** — Regenerate Cloudflare environment types
- **`pnpm generate:importmap`** — Regenerate Payload admin import map

### Deployment

- **`pnpm deploy`** — Full deployment: runs migrations, builds the app, and deploys to Cloudflare Workers (production)
- **`pnpm deploy:database`** — Run pending migrations and optimize the D1 database (database schema updates only)
- **`pnpm deploy:app`** — Build with OpenNext and deploy the Worker bundle to Cloudflare (app code only)
- **`pnpm preview`** — Build and preview the application locally before deploying

### Testing

- **`pnpm test`** — Run all tests: unit tests, integration tests, and end-to-end tests
- **`pnpm test:unit`** — Run Jest unit tests (React components, utilities)
- **`pnpm test:int`** — Run Vitest integration tests (API endpoints, database queries)
- **`pnpm test:e2e`** — Run Playwright end-to-end tests (user flows, admin panel interactions)

### Content Management

- **`pnpm payload`** — Access Payload CLI for:
  - `pnpm payload migrate:create` — Create a new database migration
  - See [Payload CLI docs](https://payloadcms.com/docs/cli) for more commands
- **`pnpm dev`** — Start the application and open `/admin` to use Payload locally

### Code Quality & Maintenance

- **`pnpm lint`** — Run ESLint to check code quality and find style issues
- **`pnpm start`** — Start the Next.js production server (for testing production builds locally)
- **`pnpm ii`** — Install dependencies while ignoring the pnpm workspace
- **`pnpm genog-local`** — Generate Open Graph images locally for testing

### Example Workflow

**Creating and deploying content changes:**

```bash
# 1. Make edits in the Payload admin panel at https://latviansofdarwin.org.au/admin
# 2. Or programmatically via API

# 3. When database schema changes are needed:
pnpm payload migrate:create

# 4. Deploy everything:
pnpm deploy

# 5. Verify the deployment succeeded:
# Visit the production website and /admin
```

**Local development:**

```bash
pnpm dev              # Start dev server
pnpm test:unit        # Test changes
pnpm lint             # Check code
pnpm build && pnpm preview  # Test production build
```

## How It Works

### Architecture Overview

The website is built on Next.js deployed to Cloudflare Workers. Payload CMS manages content in a D1 SQLite database, images are stored in R2, and the frontend uses React with Tailwind CSS.

**Request flow:**

1. User visits **latviansofdarwin.org.au**
2. Cloudflare Workers routes to the Next.js application
3. Authenticated requests to **/admin** route to Payload CMS admin panel
4. Public requests to **/** route to the frontend
5. Content is fetched from D1 and rendered server-side
6. Uploaded images are read from the configured R2 storage adapter

### Logger Configuration

This template includes a custom console-based logger compatible with Cloudflare Workers. Payload's default logger uses `pino-pretty`, which relies on Node.js APIs not available in Workers and would cause `fs.write is not implemented` errors.

The custom logger in [src/payload.config.ts](src/payload.config.ts):

- Routes logs through `console.*` methods which Workers handles correctly
- Outputs JSON-formatted logs for Cloudflare observability
- Only active in production (development uses the default `pino-pretty` for better DX)

Control the log level via the `PAYLOAD_LOG_LEVEL` environment variable (e.g., `debug`, `info`, `warn`, `error`).

## Content Management with Payload Admin

The Payload CMS admin interface is accessible at **https://latviansofdarwin.org.au/admin** in production. Authenticated editors can manage website content through a user-friendly dashboard.

### What can be edited in the admin panel

#### Pages (Content group)

Create and edit the website's main editorial pages with full bilingual support:

- **Internal title**: Used only in the admin for organization
- **Slug**: URL path (lowercase letters, numbers, and hyphens only)
- **Order**: Display order of page cards on the homepage (lower numbers appear first)
- **English & Latvian content**:
  - Page title and excerpt (excerpt appears on cards and listing pages)
  - Customizable layout built from reusable blocks:
    - **Hero block**: Bilingual eyebrow, heading, text, optional image, and left/center alignment
    - **Content block**: Bilingual heading/body, optional left/right image, and plain/muted tone
    - **Call to Action block**: One or two buttons (primary/secondary) with customizable text and links
- **SEO & social sharing**:
  - Custom meta title and description for search engines
  - Social image (Open Graph; recommended: 1200 × 630 pixels)
  - `noIndex` checkbox to exclude pages from search engines
- **Draft/Publish status**: Save as draft with autosave enabled, or publish to make live
- **Version history**: Track and restore previous versions

#### Events (Content group)

Manage event listings with bilingual descriptions and visual styling:

- **Internal title**: Admin-only reference
- **Slug**: URL path identifier
- **Order**: Display order
- **Accent tone**: Color scheme for the event card (Emerald, Amber, Sky, Rose, Violet, or Slate)
- **Event image**: Landscape image (recommended: at least 1200 × 800 pixels)
- **English & Latvian content**:
  - Event title and detailed description (textarea)
- **Draft/Publish status**: Save drafts with autosave, then publish to make an event publicly visible

#### Media

Upload and manage images used throughout the site:

- **Alt text**: Accessibility and SEO text for images
- **File upload**: Store images in the configured Cloudflare R2 bucket

Media changes save directly and do not use drafts.

#### Homepage (Settings group)

Configure homepage content:

- **English & Latvian hero content**: Eyebrow, title, subtitle, and both button labels
- **Hero image**: Optional background image
- **Button URLs**: Destinations for the primary and secondary hero buttons
- **Events section copy**: Bilingual heading and introduction

Homepage changes save directly and do not use drafts.

#### Main Menu (Settings group)

Configure the website header navigation:

- **Menu items**: Add, remove, and reorder navigation links
- **URL/href**: Site paths (e.g., `/about`, `/#events`) or external URLs
- **English & Latvian labels**: Bilingual menu text
- **Open in new tab**: Optional checkbox to open external links in a new tab

Main Menu changes save directly. Its item order controls header navigation; Page order does not.

#### Users

Administrators can manage Payload user accounts from the Users collection. The project currently has one authenticated user type and does not define separate editor roles or granular permissions.

## 📖 Quick Access to Admin Panel

Direct links to collections and globals in the **Payload admin panel** (requires authentication at **https://latviansofdarwin.org.au/admin**):

### Collections

**Users**
- [List users](https://latviansofdarwin.org.au/admin/collections/users)
- [Create user](https://latviansofdarwin.org.au/admin/collections/users/create)

**Media**
- [View media library](https://latviansofdarwin.org.au/admin/collections/media)
- [Upload media](https://latviansofdarwin.org.au/admin/collections/media/create)

### Content

**Pages**
- [View all pages](https://latviansofdarwin.org.au/admin/collections/pages)
- [Create page](https://latviansofdarwin.org.au/admin/collections/pages/create)

**Events**
- [View all events](https://latviansofdarwin.org.au/admin/collections/events)
- [Create event](https://latviansofdarwin.org.au/admin/collections/events/create)

### Settings

**Homepage**
- [Edit homepage](https://latviansofdarwin.org.au/admin/globals/homepage)

**Main Menu**
- [Edit navigation](https://latviansofdarwin.org.au/admin/globals/main-menu)

### What cannot be edited in the admin panel

The following require code changes and cannot be modified through the admin interface:

- Website branding, site-wide styling (CSS, design system), and logo
- Page layout templates and block types
- User roles and granular permission rules
- Site configuration (domain, environment variables, Cloudflare settings)
- API routes and backend logic
- Database schema and structure
- Third-party integrations and API keys

To make these changes, contact a developer to modify the codebase, run migrations, and redeploy the application.

**Note on the logo**: The website logo appears in the footer (`/public/images/logo.png`). To update the logo, replace the image file or modify the footer component and redeploy.

## Operational Notes

- Run `pnpm generate:types` after changing Payload fields, collections, globals, or Cloudflare bindings.
- Run `pnpm generate:importmap` after adding or changing custom Payload admin components.
- Create and review a migration after every database-backed Payload schema change.
- Content-only edits in `/admin` do not require a code deployment.
- Schema, styling, integration, and application-code changes require a deployment.
- Confirm current Cloudflare plan limits and Payload/Workers compatibility against their official documentation before infrastructure changes.
