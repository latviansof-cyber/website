import type { ReactNode } from 'react'

/**
 * Centered max-width wrapper used by every section.
 * Keeps the reading width predictable across breakpoints.
 */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={['mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className].join(' ')}>{children}</div>
}
