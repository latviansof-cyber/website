export function mediaURL(
  value: unknown,
  size?: 'card' | 'thumbnail',
): string | undefined {
  if (value && typeof value === 'object') {
    const v = value as {
      url?: string | null
      sizes?: Record<string, { url?: string | null }>
    }
    if (size && v.sizes?.[size]?.url) {
      return v.sizes[size].url ?? undefined
    }
    return v.url ?? undefined
  }
  return undefined
}
