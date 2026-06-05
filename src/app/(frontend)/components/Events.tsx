'use client'

import { useLanguage } from '../i18n/LanguageProvider'

const eventAccents: Record<string, string> = {
  lieldienas: 'from-emerald-100 to-emerald-50 text-emerald-800',
  jani: 'from-amber-100 to-amber-50 text-amber-800',
  may4: 'from-sky-100 to-sky-50 text-sky-800',
  'baltijas-cels': 'from-rose-100 to-rose-50 text-rose-800',
  nov18: 'from-violet-100 to-violet-50 text-violet-800',
}

export function Events() {
  const { t } = useLanguage()
  return (
    <section
      id="events"
      aria-labelledby="events-title"
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-10 bg-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            03
          </span>
        </div>
        <div className="max-w-3xl">
          <h2
            id="events-title"
            className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            {t.events.title}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-slate-700 sm:text-lg">
            {t.events.intro}
          </p>
        </div>
        <ul
          role="list"
          className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {t.events.items.map((event) => {
            const accent = eventAccents[event.id] ?? 'from-slate-100 to-slate-50 text-slate-800'
            return (
              <li
                key={event.id}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  className={`inline-flex w-fit items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-wide ${accent}`}
                >
                  {event.id.replace('-', ' ')}
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-slate-900">
                  {event.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                  {event.body}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
