import type { ReactNode } from 'react'

type Tone = 'plain' | 'muted' | 'dark'

const tones: Record<Tone, string> = {
  plain: 'bg-cream text-ink',
  muted: 'bg-white/60 text-ink',
  dark: 'bg-ink text-white',
}

export function Section({
  id,
  ariaLabel,
  tone = 'plain',
  className = '',
  children,
}: {
  id?: string
  ariaLabel?: string
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={['py-20 sm:py-24 lg:py-28', tones[tone], className].join(' ')}
    >
      {children}
    </section>
  )
}
