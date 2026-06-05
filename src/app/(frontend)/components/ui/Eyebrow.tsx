import type { ReactNode } from 'react'

/** Small label rendered above headings to anchor a section. */
export function Eyebrow({ children, tone = 'forest' }: { children: ReactNode; tone?: 'forest' | 'amber' }) {
  const color = tone === 'forest' ? 'text-forest' : 'text-amber-700'
  return (
    <div className="mb-3 flex items-center gap-3">
      <span aria-hidden="true" className="h-px w-10 bg-amber-400" />
      <span className={['text-xs font-semibold uppercase tracking-[0.18em]', color].join(' ')}>
        {children}
      </span>
    </div>
  )
}
