import type { ReactNode } from 'react'

const tones: Record<string, string> = {
  emerald: 'from-emerald-100 to-emerald-50 text-emerald-800',
  amber: 'from-amber-100 to-amber-50 text-amber-800',
  sky: 'from-sky-100 to-sky-50 text-sky-800',
  rose: 'from-rose-100 to-rose-50 text-rose-800',
  violet: 'from-violet-100 to-violet-50 text-violet-800',
  slate: 'from-slate-100 to-slate-50 text-slate-800',
}

/** Small pill-shaped label used for event categories / tags. */
export function Chip({
  tone = 'slate',
  className = '',
  children,
}: {
  tone?: keyof typeof tones
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={[
        'inline-flex w-fit items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        tones[tone] ?? tones.slate,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
