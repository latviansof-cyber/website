import { permanentRedirect } from 'next/navigation'

export default async function LegacyEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  permanentRedirect(`/en/events/${slug}`)
}
