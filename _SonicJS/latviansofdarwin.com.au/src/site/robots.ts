/**
 * `/robots.txt` body builder.
 *
 * Shared by the KV snapshot writer (canonical, published once) and the public
 * route fallback (built from the incoming request origin).
 */

export function buildRobotsTxt(origin: string): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n')
}
