import React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { JsonLd } from './components/JsonLd'
import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_LV,
  SITE_URL,
  absoluteURL,
} from '@/lib/site'
import { getOgImageUrlByPath } from '@/lib/ogImage'

const defaultOgImage = getOgImageUrlByPath('/')

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: `${SITE_NAME} — ${SITE_NAME_LV}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    alternateLocale: 'lv_LV',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_NAME_LV}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} community gathering`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_NAME_LV}`,
    description: SITE_DESCRIPTION,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-cream text-ink antialiased">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${SITE_URL}#organization`,
            name: SITE_NAME,
            alternateName: SITE_NAME_LV,
            url: SITE_URL.toString(),
            logo: absoluteURL('/images/logo.png'),
            email: CONTACT_EMAIL,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Darwin',
              addressRegion: 'Northern Territory',
              addressCountry: 'AU',
            },
          }}
        />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${SITE_URL}#website`,
            name: SITE_NAME,
            alternateName: SITE_NAME_LV,
            url: SITE_URL.toString(),
            publisher: {
              '@id': `${SITE_URL}#organization`,
            },
            inLanguage: ['en-AU', 'lv-LV'],
          }}
        />
        {children}
      </body>
    </html>
  )
}
