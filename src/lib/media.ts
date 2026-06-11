export function mediaURL(
  value: unknown,
): string | undefined {
  if (value && typeof value === 'object' && 'url' in value) {
    const v = value as { url?: string | null }
    return v.url ?? undefined
  }
  return undefined
}
