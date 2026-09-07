/**
 * SonicJS Application - Latvian Association of Darwin
 *
 * Edge-rendered bilingual website and CMS powered by SonicJS on Cloudflare Workers.
 */

import { createSonicJSApp, registerCollections } from '@sonicjs-cms/core'
import type { SonicJSConfig } from '@sonicjs-cms/core'

import pagesCollection from './collections/pages.collection'
import eventsCollection from './collections/events.collection'
import navigationCollection from './collections/navigation.collection'
import footerCollection from './collections/footer.collection'
import siteSettingsCollection from './collections/site-settings.collection'
import { siteRouter } from './site'

// Register collections BEFORE creating the app.
registerCollections([
  pagesCollection,
  eventsCollection,
  navigationCollection,
  footerCollection,
  siteSettingsCollection,
])

// Application configuration
const config: SonicJSConfig = {
  middleware: {
    beforeAuth: [
      (async (c: any, next: any) => {
        if (c.req.path === '/' || c.req.path === '') {
          return c.redirect('/en', 302)
        }
        if (c.req.path === '/donate') {
          return c.redirect('/en/donate', 302)
        }
        if (c.req.path.startsWith('/events/')) {
          return c.redirect(`/en${c.req.path}`, 302)
        }
        return next()
      }) as any,
    ],
  },
  plugins: {
    register: [],
  },
}

// Create the application
const app = createSonicJSApp(config)

// Mount public website router
app.route('/', siteRouter as any)

export default app
