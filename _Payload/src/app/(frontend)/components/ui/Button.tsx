import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400'

const variants: Record<Variant, string> = {
  primary: 'bg-amber-400 text-ink shadow-sm hover:bg-amber-300',
  secondary: 'bg-ink text-white shadow-sm hover:bg-slate-800',
  ghost: 'bg-transparent text-ink ring-1 ring-inset ring-slate-300 hover:bg-white',
}

type ButtonProps = ComponentProps<'button'> & { variant?: Variant }
export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button {...rest} className={[base, variants[variant], className].join(' ')}>
      {children}
    </button>
  )
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }
export function LinkButton({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link {...rest} className={[base, variants[variant], className].join(' ')}>
      {children}
    </Link>
  )
}
