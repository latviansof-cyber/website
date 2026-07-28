import { chromium } from 'playwright'
import { XMLParser } from 'fast-xml-parser'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.join(projectRoot, 'public', 'og-images')
const baseURL = (process.env.OG_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://latviansofdarwin.org.au')
  .replace(/\/+$/, '')

function toOgFilename(rawURL) {
  const { pathname } = new URL(rawURL)
  const segments = pathname.split('/').filter(Boolean)
  const baseName = segments.length > 0 ? segments.join('.') : 'home'
  const safeName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')

  return `${safeName}.jpg`
}

async function getSitemapURLs() {
  const sitemapURL = `${baseURL}/sitemap.xml`
  const response = await fetch(sitemapURL)

  if (!response.ok) {
    throw new Error(`Unable to load ${sitemapURL}: ${response.status} ${response.statusText}`)
  }

  const parsed = new XMLParser().parse(await response.text())
  const entries = parsed.urlset?.url

  if (!entries) return []

  return (Array.isArray(entries) ? entries : [entries])
    .map((entry) => entry.loc)
    .filter(Boolean)
    .map((url) => new URL(new URL(url).pathname, baseURL).toString())
}

async function generateOgImages() {
  await mkdir(outputDir, { recursive: true })

  const urls = await getSitemapURLs()
  if (urls.length === 0) {
    throw new Error(`No URLs found in ${baseURL}/sitemap.xml`)
  }

  console.log(`Generating ${urls.length} OG images from ${baseURL}`)
  console.log(`Output directory: ${outputDir}`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  let failures = 0

  try {
    for (const [index, url] of urls.entries()) {
      const filename = toOgFilename(url)
      const outputPath = path.join(outputDir, filename)
      console.log(`[${index + 1}/${urls.length}] ${url} -> ${filename}`)

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
        await page.screenshot({
          path: outputPath,
          type: 'jpeg',
          quality: 90,
        })
      } catch (error) {
        failures += 1
        console.error(`Failed to capture ${url}:`, error)
      }
    }
  } finally {
    await browser.close()
  }

  if (failures > 0) {
    throw new Error(`${failures} OG image${failures === 1 ? '' : 's'} failed to generate`)
  }
}

generateOgImages().catch((error) => {
  console.error(error)
  process.exit(1)
})
