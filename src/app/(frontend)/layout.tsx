import React from 'react'
import './globals.css'

export const metadata = {
  description:
    'Latvian Association of Darwin (Dārvinas Latviešu Apvienība) — a bilingual community website for Latvians in the Northern Territory, Australia.',
  title: 'Latvian Association of Darwin — Dārvinas Latviešu Apvienība',
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
      <body className="bg-cream text-ink antialiased">{children}</body>
    </html>
  )
}
