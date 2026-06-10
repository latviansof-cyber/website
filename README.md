# Payload Cloudflare Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/payloadcms/payload/tree/3.x/templates/with-cloudflare-d1)

**This can only be deployed on Paid Workers right now due to size limits.** This template comes configured with the bare minimum to get started on anything you need.

## Recent Improvements

The following website and CMS improvements were completed on June 9, 2026.

### Payload content management

- Added and registered a standard `pages` collection.
- Limited public reads to published pages while authenticated editors retain draft access.
- Enabled drafts, autosave, ordering, unique slugs, bilingual English/Latvian fields, and SEO controls.
- Expanded the content plan from two pages to About, History, Community, and Membership.
- Added fallback content for periods when Payload or the local D1 database is unavailable.

### Block-based page builder

- Replaced the fixed page body with an ordered Payload `layout` blocks field.
- Added reusable bilingual `Hero`, `Content`, and `CallToAction` blocks.
- Added optional block images, alignment, image position, and background tone controls.
- Added CTA support for up to two editor-managed primary or secondary buttons.
- Added frontend renderers shared by CMS and fallback content.
- Generated Payload types and a D1 migration containing block tables, nested CTA buttons, drafts, SEO fields, and four seeded published pages.

### Frontend content and design

- Replaced long homepage text sections with compact cards and `Read more` links.
- Added dynamic routes for all four editorial pages.
- Added expandable `Read more` and `Show less` controls to event cards.
- Updated desktop, mobile, and footer navigation for the expanded page plan.
- Corrected mobile navigation overflow.
- Added responsive Hero, Content, and CTA page layouts.

### Metadata and discoverability

- Added global defaults and page-specific metadata generated from Payload.
- Added canonical URLs, robots controls, Open Graph tags, Twitter cards, and a dedicated 1200 x 630 Open Graph image.
- Added Organization, WebSite, and WebPage JSON-LD.
- Added Organization and WebPage microdata.
- Added editable SEO title, description, social image, and `noIndex` page fields.

### Icons and web app metadata

- Extracted the supplied favicon assets directly into `public/`.
- Removed `favicon.zip` and confirmed that no `public/favicon/` directory exists.
- Added SVG, ICO, PNG, Apple touch, and web app manifest icon metadata.
- Updated `site.webmanifest` with the association identity and website theme colors.

### Verification and known limitations

- Verified Payload type generation and formatting.
- Browser-tested homepage cards, page blocks, CTA buttons, event disclosures, bilingual switching, and responsive layouts.
- Verified canonical, favicon, manifest, Open Graph, microdata, and JSON-LD output.
- Verified all favicon, manifest, and Open Graph assets return successful HTTP responses.
- Corrected optional migration seed values to emit SQL `NULL` and validated both migrations against SQLite.
- Applied both Payload migrations to the production D1 database and verified four published pages.
- Corrected the recursive OpenNext build script, switched the production build to Webpack, and isolated build-time Payload bindings from remote D1.
- Verified the complete Next.js and OpenNext build, including generation of `.open-next/worker.js`.
- The final Worker upload remains blocked because the configured Cloudflare API token lacks Workers service permissions (`API error 10000`; membership check `9106`).
- Existing unit-test and ESLint configuration failures remain outside the scope of these changes.

### Analytics

- Integrated Google Analytics (GA4) with measurement ID **G-54WF6RB2HX**
- Analytics managed through the **latviansof@gmail.com** Google account
- GA4 script loads asynchronously on all frontend pages using Next.js `Script` component with `strategy="afterInteractive"`
- Tracks pageviews, user engagement, and events across the website
- View analytics dashboard at [Google Analytics Console](https://analytics.google.com)

## Quick start

This template can be deployed directly to Cloudflare Workers by clicking the button to take you to the setup screen.

From there you can connect your code to a git provider such Github or Gitlab, name your Workers, D1 Database and R2 Bucket as well as attach any additional environment variables or services you need.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. Cloudflare will connect your app to a git provider such as Github and you can access your code from there.

### Local Development

## How it works

Out of the box, using [`Wrangler`](https://developers.cloudflare.com/workers/wrangler/) will automatically create local bindings for you to connect to the remote services and it can even create a local mock of the services you're using with Cloudflare.

We've pre-configured Payload for you with the following:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/3.x/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection.

### Image Storage (R2)

Images will be served from an R2 bucket which you can then further configure to use a CDN to serve for your frontend directly.

### D1 Database

The Worker will have direct access to a D1 SQLite database which Wrangler can connect locally to, just note that you won't have a connection string as you would typically with other providers.

You can enable read replicas by adding `readReplicas: 'first-primary'` in the DB adapter and then enabling it on your D1 Cloudflare dashboard. Read more about this feature on [our docs](https://payloadcms.com/docs/database/sqlite#d1-read-replicas).

## Working with Cloudflare

Firstly, after installing dependencies locally you need to authenticate with Wrangler by running:

```bash
pnpm wrangler login
```

This will take you to Cloudflare to login and then you can use the Wrangler CLI locally for anything, use `pnpm wrangler help` to see all available options.

Wrangler is pretty smart so it will automatically bind your services for local development just by running `pnpm dev`.

## Deployments

When you're ready to deploy, first make sure you have created your migrations:

```bash
pnpm payload migrate:create
```

Then run the following command:

```bash
pnpm run deploy
```

This will spin up Wrangler in `production` mode, run any created migrations, build the app and then deploy the bundle up to Cloudflare.

That's it! You can if you wish move these steps into your CI pipeline as well.

## Enabling logs

By default logs are not enabled for your API, we've made this decision because it does run against your quota so we've left it opt-in. But you can easily enable logs in one click in the Cloudflare panel, [see docs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/#enable-workers-logs).

### Logger Configuration

This template includes a custom console-based logger compatible with Cloudflare Workers. Payload's default logger uses `pino-pretty`, which relies on Node.js APIs not available in Workers and would cause `fs.write is not implemented` errors.

The custom logger in `payload.config.ts`:

- Routes logs through `console.*` methods which Workers handles correctly
- Outputs JSON-formatted logs for Cloudflare observability
- Only active in production (development uses the default `pino-pretty` for better DX)

You can control the log level via the `PAYLOAD_LOG_LEVEL` environment variable (e.g., `debug`, `info`, `warn`, `error`).

### Diagnostic Channel Errors

If you see "Failed to publish diagnostic channel message" errors in your observability logs, these typically come from the `undici` HTTP client library. The template includes `skipSafeFetch: true` in the Media collection to use native fetch instead of undici for file uploads, which helps reduce these errors.

Cloudflare Workers runs in an [isolated environment that cannot access private IP ranges](https://developers.cloudflare.com/workers-vpc/examples/route-across-private-services/) by default, providing built-in SSRF protection. This makes `skipSafeFetch` safe to use.

## Content Management with Payload Admin

The Payload CMS admin interface is accessible at **https://latviansofdarwin.org.au/admin** in production. Authenticated editors can manage website content through a user-friendly dashboard.

### What can be edited in the admin panel

#### Pages (Content group)
Create and edit the website's main editorial pages with full bilingual support:
- **Internal title**: Used only in the admin for organization
- **Slug**: URL path (lowercase letters, numbers, and hyphens only)
- **Order**: Display order in navigation (lower numbers appear first)
- **English & Latvian content**:
  - Page title and excerpt (excerpt appears on cards and listing pages)
  - Customizable layout built from reusable blocks:
    - **Hero block**: Large banner with optional image, alignment, and positioning controls
    - **Content block**: Text content with optional image, alignment, and background tone (light/dark)
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
- **Draft/Publish status**: Control visibility with autosave

#### Media (Content group)
Upload and manage images used throughout the site:
- **Alt text**: Accessibility and SEO text for images
- **File upload**: Add images to an R2 bucket (served via CDN)

#### Main Menu (Settings group)
Configure the website header navigation:
- **Menu items**: Add, remove, and reorder navigation links
- **URL/href**: Site paths (e.g., `/about`, `/#events`) or external URLs
- **English & Latvian labels**: Bilingual menu text
- **Open in new tab**: Optional checkbox to open external links in a new tab

### What cannot be edited in the admin panel

The following require code changes and cannot be modified through the admin interface:
- Website branding, logo, and site-wide styling (CSS, design system)
- Page layout templates and block types
- User accounts and permissions (admin-only)
- Site configuration (domain, environment variables, Cloudflare settings)
- API routes and backend logic
- Database schema and structure
- Third-party integrations and API keys

To make these changes, contact a developer to modify the codebase, run migrations, and redeploy the application.

## Known issues

### GraphQL

We are currently waiting on some issues with GraphQL to be [fixed upstream in Workers](https://github.com/cloudflare/workerd/issues/5175) so full support for GraphQL is not currently guaranteed when deployed.

### Worker size limits

We currently recommend deploying this template to the Paid Workers plan due to bundle [size limits](https://developers.cloudflare.com/workers/platform/limits/#worker-size) of 3mb. We're actively trying to reduce our bundle footprint over time to better meet this metric.

This also applies to your own code, in the case of importing a lot of libraries you may find yourself limited by the bundle.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
