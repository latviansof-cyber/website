'use client'

import { useCallback, useId, useState, type FormEvent } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'
import type { DonationSettingsContent } from '@/lib/donationSettings'
import { Container } from '../components/ui/Container'
import { localizeHref } from '@/lib/i18nRouting'

type Frequency = 'one-time' | 'monthly'

export function DonationWidget({
  donationSettings,
}: {
  donationSettings?: DonationSettingsContent
}) {
  const { t, lang } = useLanguage()
  const donateCopy = t.footer.donate
  const managedContent = donationSettings?.localized?.[lang === 'lv' ? 'lv' : 'en']
  const priorityLinks: Array<{
    title: string
    body: string
    url?: string | null
    newTab?: boolean | null
  }> = managedContent?.priorityLinks?.length ? managedContent.priorityLinks : donateCopy.urgentItems
  const features = managedContent?.features?.length ? managedContent.features : donateCopy.features
  const donationOptions: Array<{
    amount: number
    body: string
    url?: string | null
    newTab?: boolean | null
  }> = managedContent?.donationOptions?.length
    ? managedContent.donationOptions
    : donateCopy.presetAmounts

  const [frequency, setFrequency] = useState<Frequency>('one-time')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const baseId = useId()
  const frequencyGroupId = `${baseId}-frequency`
  const customInputId = `${baseId}-custom`
  const errorId = `${baseId}-error`

  const handleCustomChange = (raw: string) => {
    const sanitized = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
    setCustomAmount(sanitized)
    setError(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedCustom = Number.parseFloat(customAmount)

    if (!parsedCustom || parsedCustom <= 0) {
      setError(donateCopy.errorInvalidAmount)
      return
    }

    setIsSuccess(true)
    setError(null)
  }

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.warn('[donate] Failed to copy to clipboard:', error)
    }
  }, [])

  if (isSuccess) {
    return (
      <section className="relative isolate overflow-hidden bg-cream py-20 sm:py-28">
        <Container className="max-w-2xl">
          <div className="glass-panel flex flex-col items-center gap-6 rounded-3xl p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-8 w-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              {donateCopy.successHeading}
            </h2>
            <p className="text-lg text-ink-light">{donateCopy.successBody}</p>
            <button
              onClick={() => {
                setIsSuccess(false)
                setCustomAmount('')
              }}
              className="mt-4 rounded-full bg-sunset-orange px-6 py-2.5 font-bold text-white shadow-md transition hover:bg-sunset-gold hover:text-ink"
            >
              {donateCopy.successAnother}
            </button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-sunset-peach/20 via-white to-sunset-gold/20">
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-sunset-red/10 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-sunset-orange/10 blur-2xl"></div>
        <Container className="py-14">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <span className="text-sunset-orange">{donateCopy.heroEyebrow}</span>
          </div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {donateCopy.heroTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {donateCopy.heroSubtitle}
          </p>
        </Container>
      </section>

      <Container className="py-16 space-y-20">
        {/* 2. Urgent Priority */}
        <section>
          <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-sunset-orange">
              {donateCopy.urgentLabel}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">
              {donateCopy.urgentTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
              {donateCopy.urgentIntro}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {priorityLinks.map((item, i) => {
                const content = (
                  <>
                    <p className="text-lg font-bold text-sunset-orange">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                  </>
                )
                const className =
                  'rounded-2xl bg-white/60 p-6 shadow-sm border border-white/40 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-md'

                return item.url ? (
                  <a
                    key={`ui-${i}`}
                    href={localizeHref(item.url, lang)}
                    target={item.newTab ? '_blank' : undefined}
                    rel={item.newTab ? 'noopener noreferrer' : undefined}
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={`ui-${i}`} className={className}>
                    {content}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 3. Features Row */}
        <section>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 rounded-full bg-white/50 px-8 py-4 backdrop-blur-sm border border-slate-200">
            {features.map((feature, i) => (
              <p
                key={`f-${i}`}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </span>
                {feature}
              </p>
            ))}
          </div>
        </section>

        {/* 4. Quick Donate Grid */}
        <section>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-sunset-orange">
              {donateCopy.quickLabel}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink">{donateCopy.quickTitle}</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
              {donateCopy.quickIntro}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {donationOptions.map((preset) => {
              const content = (
                <>
                  <p className="text-3xl font-black text-sunset-orange">${preset.amount}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {preset.body}
                  </p>
                  <div className="mt-6 flex w-full items-center justify-between gap-2 border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold uppercase tracking-wide text-sunset-orange transition group-hover:text-sunset-red">
                      {donateCopy.quickDonateButton}
                    </span>
                    <span className="text-slate-400 group-hover:text-sunset-red transition">→</span>
                  </div>
                </>
              )
              const className =
                'group flex flex-col items-start rounded-3xl border-2 border-slate-200 bg-white p-6 text-left transition hover:border-sunset-orange hover:shadow-lg focus:outline-none'

              return preset.url ? (
                <a
                  key={`amount-${preset.amount}`}
                  href={localizeHref(preset.url, lang)}
                  target={preset.newTab ? '_blank' : undefined}
                  rel={preset.newTab ? 'noopener noreferrer' : undefined}
                  className={className}
                >
                  {content}
                </a>
              ) : (
                <button
                  key={`amount-${preset.amount}`}
                  type="button"
                  onClick={() => {
                    setCustomAmount(preset.amount.toString())
                  }}
                  className={className}
                >
                  {content}
                </button>
              )
            })}
          </div>
        </section>

        {/* 5. Custom Amount Form */}
        <section className="mx-auto max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-300"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {donateCopy.customOrLabel}
            </p>
            <div className="h-px flex-1 bg-slate-300"></div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="glass-panel rounded-3xl p-8 sm:p-10 shadow-xl border border-white/50"
          >
            <div className="flex flex-col gap-6">
              <fieldset>
                <legend className="text-sm font-bold uppercase tracking-widest text-ink/60 mb-3">
                  {donateCopy.frequencyLabel}
                </legend>
                <div
                  className="flex rounded-full bg-slate-100 p-1 shadow-inner"
                  id={frequencyGroupId}
                >
                  {(['one-time', 'monthly'] as Frequency[]).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFrequency(opt)}
                      className={`flex-1 rounded-full py-2.5 text-sm font-bold transition ${frequency === opt ? 'bg-sunset-orange text-white shadow-md' : 'text-slate-500 hover:text-ink'}`}
                    >
                      {opt === 'one-time'
                        ? donateCopy.frequencyOneTime
                        : donateCopy.frequencyMonthly}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <label
                  htmlFor={customInputId}
                  className="text-sm font-bold uppercase tracking-widest text-ink/60 mb-3 block"
                >
                  {donateCopy.amountLabel}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-xl font-bold text-slate-400">
                    $
                  </span>
                  <input
                    id={customInputId}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 pl-10 pr-4 text-xl font-bold text-ink shadow-inner focus:border-sunset-orange focus:outline-none focus:ring-0"
                  />
                </div>
              </fieldset>
              {error && (
                <p className="text-sm font-bold text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
              )}
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-ink py-4 text-lg font-bold text-white shadow-lg transition hover:bg-slate-800"
              >
                {donateCopy.submitButton}
              </button>
            </div>
          </form>
        </section>

        {/* 6. Bank Transfer & PayID */}
        <section>
          <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-lg border border-slate-200">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-sunset-orange">
                {donateCopy.directLabel}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
                {donateCopy.directTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                {donateCopy.directIntro}
              </p>
              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-xs">
                  ✓
                </span>
                <span className="font-bold text-ink">
                  {donationSettings?.[lang === 'lv' ? 'lv' : 'en'].bankName ??
                    donateCopy.bankOrgName}
                </span>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              {/* Bank Transfer Steps */}
              <div>
                <p className="mb-6 font-serif text-2xl font-bold text-ink">Bank Transfer</p>
                <ol className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sunset-orange font-bold text-white shadow-md">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-ink">{donateCopy.bankStep1Title}</p>
                      <p className="mt-1 text-sm text-slate-500">{donateCopy.bankStep1Body}</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sunset-orange font-bold text-white shadow-md">
                      2
                    </span>
                    <div className="w-full">
                      <p className="font-bold text-ink mb-3">{donateCopy.bankStep2Title}</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                              {donateCopy.bankBsbLabel}
                            </p>
                            <p className="font-mono text-lg font-bold text-ink">
                              {donationSettings?.[lang === 'lv' ? 'lv' : 'en'].bsb ??
                                donateCopy.bankBsb}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleCopy(
                                donationSettings?.[lang === 'lv' ? 'lv' : 'en'].bsb ??
                                  donateCopy.bankBsb,
                              )
                            }
                            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-sunset-orange hover:text-white"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                              {donateCopy.bankAccountLabel}
                            </p>
                            <p className="font-mono text-lg font-bold text-ink">
                              {donationSettings?.[lang === 'lv' ? 'lv' : 'en'].accountNumber ??
                                donateCopy.bankAccount}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleCopy(
                                donationSettings?.[lang === 'lv' ? 'lv' : 'en'].accountNumber ??
                                  donateCopy.bankAccount,
                              )
                            }
                            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-sunset-orange hover:text-white"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sunset-orange font-bold text-white shadow-md">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-ink">{donateCopy.bankStep3Title}</p>
                      <p className="mt-2 inline-block rounded-lg bg-amber-100 px-3 py-1 font-mono text-sm font-bold text-amber-900">
                        {donateCopy.bankStep3Ref}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">{donateCopy.bankStep3Body}</p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* PayID */}
              <div className="rounded-3xl bg-white/50 p-8 border border-slate-200 backdrop-blur-sm">
                <p className="font-serif text-2xl font-bold text-ink mb-4">
                  {donateCopy.payIdTitle}
                </p>
                <p className="text-sm leading-relaxed text-slate-600 mb-6">
                  {donateCopy.payIdBody}
                </p>

                <div className="flex items-center justify-between rounded-xl bg-white p-4 border border-slate-200 shadow-sm mb-6">
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {donateCopy.payIdEmailLabel}
                    </p>
                    <p className="truncate text-lg font-bold text-ink">
                      {donationSettings?.[lang === 'lv' ? 'lv' : 'en'].payId ??
                        donateCopy.payIdEmail}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCopy(
                        donationSettings?.[lang === 'lv' ? 'lv' : 'en'].payId ??
                          donateCopy.payIdEmail,
                      )
                    }
                    className="shrink-0 rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-sunset-orange hover:text-white"
                  >
                    Copy
                  </button>
                </div>

                <div className="rounded-2xl bg-amber-50 p-5 border border-amber-100">
                  <p className="text-sm font-bold uppercase tracking-widest text-amber-800">
                    {donateCopy.payIdZeroFeesTitle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
                    {donateCopy.payIdZeroFeesBody}
                  </p>
                </div>

                <p className="mt-6 text-sm text-slate-500 italic text-center">
                  {donateCopy.receiptFooterText}
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
}
