import { LanguageProvider } from './i18n/LanguageProvider'
import { SiteHeader } from './components/SiteHeader'
import { Hero } from './components/Hero'
import { TextSection } from './components/TextSection'
import { Events } from './components/Events'
import { SiteFooter } from './components/SiteFooter'

export default function HomePage() {
  return (
    <LanguageProvider>
      <SiteHeader />
      <main id="main" className="bg-cream text-ink">
        <Hero />
        <TextSection id="about" tone="muted" />
        <TextSection id="history" />
        <Events />
      </main>
      <SiteFooter />
    </LanguageProvider>
  )
}

// TODO(DLA-302): when i18n routing lands, split this into /[locale]/page.tsx and
//   generate static metadata per locale (OpenGraph + hreflang). Also switch
//   `export default` to `generateStaticParams()` + `generateMetadata()`.
