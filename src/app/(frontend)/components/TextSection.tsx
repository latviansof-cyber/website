'use client'

import { useLanguage } from '../i18n/LanguageProvider'

interface Props {
  id: 'about' | 'history'
  tone?: 'plain' | 'muted'
}

export function TextSection({ id, tone = 'plain' }: Props) {
  const { t } = useLanguage()
  const data = id === 'about' ? t.about : t.history
  const isMuted = tone === 'muted'
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={isMuted ? 'bg-slate-50 py-16 sm:py-20' : 'bg-white py-16 sm:py-20'}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-10 bg-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {id === 'about' ? '01' : '02'}
          </span>
        </div>
        <h2
          id={`${id}-title`}
          className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
        >
          {data.title}
        </h2>
        <div className="mt-6 space-y-5 text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
          {data.body.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
