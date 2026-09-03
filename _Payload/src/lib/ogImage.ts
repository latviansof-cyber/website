import { absoluteURL } from '@/lib/site'

export function toOgFilename(pathOrUrl: string): string {
  let pathname = pathOrUrl

  if (/^https?:\/\//i.test(pathOrUrl)) {
    pathname = new URL(pathOrUrl).pathname
  }

  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const segments = normalizedPath.split('/').filter(Boolean)
  const baseName = segments.length > 0 ? segments.join('.') : 'home'
  const safeName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')

  return `${safeName}.jpg`
}

export function getOgImageUrlByPath(pathOrUrl: string): string {
  return absoluteURL(`/og-images/${toOgFilename(pathOrUrl)}`)
}
