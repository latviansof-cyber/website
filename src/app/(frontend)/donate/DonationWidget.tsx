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
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const baseId = useId()
  const frequencyGroupId = `${baseId}-frequency`
  const customInputId = `${baseId}-custom`
  const errorId = `${baseId}-error`

  const handleCustomChange = (raw: string) => {
    setCustomAmount(raw)
    setError(null)
  }

  const submitWithFrequency = (selectedFreq: Frequency, event?: FormEvent | React.MouseEvent) => {
    if (event) event.preventDefault()
    setFrequency(selectedFreq)
    const parsedCustom = Number.parseFloat(customAmount)

    if (customAmount.trim() === '' || isNaN(parsedCustom) || parsedCustom <= 0) {
      setError(donateCopy.errorInvalidAmount)
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Simulate brief processing delay for visual feedback
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 600)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    submitWithFrequency(frequency, event)
  }

  const handleCopy = useCallback(async (text: string, fieldKey: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldKey)
      setTimeout(() => setCopiedField(null), 2000)
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
              className="mt-4 rounded-full bg-sunset-orange px-6 py-2.5 font-bold text-white shadow-md transition hover:bg-sunset-gold hover:text-ink focus-visible:ring-2 focus-visible:ring-offset-2"
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
      {/* 1. Hero & Quick Donate Grid (Golden Area Above the Fold) */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-sunset-peach/20 via-white to-sunset-gold/20 py-12 lg:py-16">
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-sunset-red/10 blur-3xl"></div>
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-sunset-orange/10 blur-2xl"></div>
        <Container>
          <div className="flex flex-col gap-10">
            {/* Hero Top Row: Title, Subtitle & Trust Badges */}
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <span className="text-sunset-orange">{donateCopy.heroEyebrow}</span>
              </div>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                {donateCopy.heroTitle}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
                {donateCopy.heroSubtitle}
              </p>
              {/* Trust Badges */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {features.map((feature, i) => (
                  <span
                    key={`f-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-slate-200/80 px-3 py-1 text-xs font-bold text-slate-700 shadow-2xs backdrop-blur-xs"
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Main Action: Preset Amount Cards (Golden Area) */}
            <div>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-sunset-orange">
                    {donateCopy.quickLabel}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">
                    {donateCopy.quickTitle}
                  </h2>
                </div>
                <p className="text-sm text-slate-500">
                  {donateCopy.quickIntro}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {donationOptions.map((preset) => {
                  const targetUrl = preset.url || '#direct-payment'
                  const content = (
                    <>
                      <p className="text-2xl font-black text-sunset-orange sm:text-3xl">${preset.amount}</p>
                      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {preset.body}
                      </p>
                      <div className="mt-4 flex w-full items-center justify-between gap-2 border-t border-slate-100 pt-3">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-sunset-orange transition group-hover:text-sunset-red">
                          {donateCopy.quickDonateButton}
                        </span>
                        <span className="text-xs text-slate-400 group-hover:text-sunset-red transition">→</span>
                      </div>
                    </>
                  )
                  const className =
                    'group flex flex-col items-start rounded-2xl border-2 border-slate-200/90 bg-white p-5 text-left transition hover:border-sunset-orange hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus:outline-none'

                  return (
                    <a
                      key={`amount-${preset.amount}`}
                      href={localizeHref(targetUrl, lang)}
                      target={preset.newTab ? '_blank' : undefined}
                      rel={preset.newTab ? 'noopener noreferrer' : undefined}
                      className={className}
                    >
                      {content}
                    </a>
                  )
                })}
              </div>
              {/* Full Width Final Option: Custom Amount */}
              <div className="mt-4">
                <form
                  onSubmit={(e) => submitWithFrequency(frequency, e)}
                  className="rounded-2xl border-2 border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition hover:border-sunset-orange"
                >
                  <div className="flex flex-col gap-5">
                    {/* Top Row: Eyebrow, Large Input & Descriptive Text */}
                    <div className="grid gap-4 md:grid-cols-12 md:items-center">
                      <div className="md:col-span-5 lg:col-span-4">
                        <label
                          htmlFor={customInputId}
                          className="text-[11px] font-bold uppercase tracking-widest text-sunset-orange block mb-2"
                        >
                          {donateCopy.customOrLabel}
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-2xl font-black text-sunset-orange">
                            $
                          </span>
                          <input
                            id={customInputId}
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={customAmount}
                            onChange={(e) => handleCustomChange(e.target.value)}
                            className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-2xl font-black text-ink shadow-inner transition focus:border-sunset-orange focus:bg-white focus:outline-none"
                            aria-describedby={error ? errorId : undefined}
                            aria-invalid={!!error || undefined}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-7 lg:col-span-8 flex items-center">
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                          {lang === 'lv'
                            ? 'Ievadiet sev vēlamo ziedojuma summu DĀLA kultūras pasākumu, valodas nodarbību un kopienas atbalstam.'
                            : 'Specify any custom contribution amount to directly fund DLA events, language classes, and community support.'}
                        </p>
                      </div>
                    </div>

                    {error && (
                      <p id={errorId} role="alert" className="text-xs font-bold text-red-500">
                        {error}
                      </p>
                    )}

                    {/* Bottom Row: Divider + Frequency Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-4 mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {lang === 'lv' ? 'Ziedot:' : 'Donate:'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={(e) => submitWithFrequency('one-time', e)}
                          className="rounded-full bg-ink px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
                        >
                          {isSubmitting && frequency === 'one-time'
                            ? '...'
                            : lang === 'lv'
                            ? 'Vienreizējs'
                            : 'One-Time'}
                        </button>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={(e) => submitWithFrequency('monthly', e)}
                          className="rounded-full bg-sunset-orange px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-sunset-gold hover:text-ink focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
                        >
                          {isSubmitting && frequency === 'monthly'
                            ? '...'
                            : lang === 'lv'
                            ? 'Ikmēneša'
                            : 'Monthly'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
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

        {/* 6. Bank Transfer & PayID */}
        <section id="direct-payment">
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
                        {/* Bank Name */}
                        <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                              {lang === 'lv' ? 'Banka' : 'Bank'}
                            </p>
                            <p className="font-sans text-base font-bold text-ink">
                              {donationSettings?.[lang === 'lv' ? 'lv' : 'en'].bankName ?? 'Bendigo Bank'}
                            </p>
                          </div>
                        </div>

                        {/* Account Name */}
                        <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                              {lang === 'lv' ? 'Konta īpašnieks' : 'Account Name'}
                            </p>
                            <p className="font-sans text-base font-bold text-ink">
                              {donationSettings?.[lang === 'lv' ? 'lv' : 'en'].accountName ??
                                donateCopy.bankOrgName}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                donationSettings?.[lang === 'lv' ? 'lv' : 'en'].accountName ??
                                  donateCopy.bankOrgName,
                                'accName',
                              )
                            }
                            className={`rounded-lg px-4 py-2 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-offset-2 ${copiedField === 'accName' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-sunset-orange hover:text-white'}`}
                          >
                            {copiedField === 'accName' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        {/* BSB */}
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
                            type="button"
                            onClick={() =>
                              handleCopy(
                                donationSettings?.[lang === 'lv' ? 'lv' : 'en'].bsb ??
                                  donateCopy.bankBsb,
                                'bsb',
                              )
                            }
                            className={`rounded-lg px-4 py-2 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-offset-2 ${copiedField === 'bsb' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-sunset-orange hover:text-white'}`}
                          >
                            {copiedField === 'bsb' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        {/* Account Number */}
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
                            type="button"
                            onClick={() =>
                              handleCopy(
                                donationSettings?.[lang === 'lv' ? 'lv' : 'en'].accountNumber ??
                                  donateCopy.bankAccount,
                                'account',
                              )
                            }
                            className={`rounded-lg px-4 py-2 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-offset-2 ${copiedField === 'account' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-sunset-orange hover:text-white'}`}
                          >
                            {copiedField === 'account' ? 'Copied!' : 'Copy'}
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
                        'payid',
                      )
                    }
                    className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-offset-2 ${copiedField === 'payid' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-sunset-orange hover:text-white'}`}
                  >
                    {copiedField === 'payid' ? 'Copied!' : 'Copy'}
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
