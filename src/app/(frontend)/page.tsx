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
      <main id="main" className="bg-white text-slate-900">
        <Hero />
        <TextSection id="about" tone="muted" />
        <TextSection id="history" />
        <Events />
      </main>
      <SiteFooter />
    </LanguageProvider>
  )
}
