'use client'

import { useId, useMemo, useState, type FormEvent } from 'react'
import { useLanguage } from '../i18n/LanguageProvider'
import { Container } from '../components/ui/Container'
import { Eyebrow } from '../components/ui/Eyebrow'

/** Suggested one-off amounts in AUD; rendered as chips on the form. */
const PRESET_AMOUNTS = [10, 25, 50, 100, 250] as const

type PresetAmount = (typeof PRESET_AMOUNTS)[number]
type Frequency = 'one-time' | 'monthly'

export interface DonationPayload {
  frequency: Frequency
  /** Always a positive integer or two-decimal number; null means "custom free-form". */
  presetAmount: number | null
  /** Raw user-entered string, sanitised to digits + a single decimal point. */
  customAmount: string
  /** Resolved amount in AUD used for the donation. */
  amount: number
  currency: 'AUD'
}

export interface DonationWidgetProps {
  /** Suggested amounts; defaults to a sensible ladder. Override for A/B tests. */
  presetAmounts?: readonly number[]
  /** Called with the validated payload after the user submits. */
  onSubmit?: (payload: DonationPayload) => void
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
})

/**
 * Parse a user-entered donation amount. Accepts digits and a single decimal point.
 * Returns `null` when the input is empty, negative, or not a finite positive number.
 */
function parseDonationAmount(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
  if (cleaned.length === 0) return null
  const value = Number.parseFloat(cleaned)
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(value * 100) / 100
}

function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value)
}

export function DonationWidget({ presetAmounts, onSubmit }: DonationWidgetProps = {}) {
  const { t } = useLanguage()
  const donateCopy = t.footer.donate

  const amountOptions = useMemo<readonly number[]>(
    () => (presetAmounts && presetAmounts.length > 0 ? presetAmounts : PRESET_AMOUNTS),
    [presetAmounts],
  )

  const [frequency, setFrequency] = useState<Frequency>('one-time')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [submittedPayload, setSubmittedPayload] = useState<DonationPayload | null>(null)

  const baseId = useId()
  const frequencyGroupId = `${baseId}-frequency`
  const amountGroupId = `${baseId}-amount`
  const customInputId = `${baseId}-custom`
  const errorId = `${baseId}-error`

  const parsedCustom = parseDonationAmount(customAmount)
  const hasCustomValue = parsedCustom !== null
  const resolvedAmount: number | null = hasCustomValue ? parsedCustom : selectedPreset

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount)
    setCustomAmount('')
    setError(null)
  }

  const handleCustomChange = (raw: string) => {
    // Allow only digits and a single decimal separator while typing.
    const sanitized = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
    setCustomAmount(sanitized)
    // Typing in the custom field deselects the preset chip.
    if (sanitized.length > 0) {
      setSelectedPreset(null)
    }
    setError(null)
  }

  const handleFrequencyChange = (next: Frequency) => {
    setFrequency(next)
    setError(null)
  }

  const buildPayload = (amount: number): DonationPayload => ({
    frequency,
    presetAmount: hasCustomValue ? null : selectedPreset,
    customAmount: hasCustomValue ? customAmount : '',
    amount,
    currency: 'AUD',
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!hasCustomValue && (selectedPreset === null || !Number.isFinite(selectedPreset))) {
      setError(donateCopy.errorAmountRequired)
      return
    }

    if (hasCustomValue && (parsedCustom === null || parsedCustom <= 0)) {
      setError(donateCopy.errorInvalidAmount)
      return
    }

    if (resolvedAmount === null) {
      setError(donateCopy.errorAmountRequired)
      return
    }

    const payload = buildPayload(resolvedAmount)
    // eslint-disable-next-line no-console
    console.log('[donate] submit', payload)
    onSubmit?.(payload)
    setSubmittedPayload(payload)
    setError(null)
  }

  const handleReset = () => {
    setSelectedPreset(null)
    setCustomAmount('')
    setError(null)
    setSubmittedPayload(null)
  }

  if (submittedPayload) {
    return (
      <section
        aria-labelledby="donate-success-title"
        className="relative isolate overflow-hidden bg-gradient-to-b from-cream via-white to-cream py-20 sm:py-28"
      >
        <Container className="max-w-2xl">
          <div className="glass-panel flex flex-col items-center gap-6 rounded-3xl p-10 text-center">
            <div
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-custom/10 text-emerald-custom"
            >
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
            <h2
              id="donate-success-title"
              className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              {donateCopy.successHeading}
            </h2>
            <p className="text-base leading-relaxed text-ink-light sm:text-lg">
              {donateCopy.successBody}
            </p>
            <dl className="grid w-full grid-cols-2 gap-4 rounded-2xl bg-white/80 p-5 text-left text-sm shadow-inner">
              <div>
                <dt className="font-semibold uppercase tracking-wide text-ink/60">Amount</dt>
                <dd className="mt-1 font-serif text-xl font-bold text-ink">
                  {formatCurrency(submittedPayload.amount)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-wide text-ink/60">Frequency</dt>
                <dd className="mt-1 font-serif text-xl font-bold text-ink">
                  {submittedPayload.frequency === 'monthly'
                    ? donateCopy.frequencyMonthly
                    : donateCopy.frequencyOneTime}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              {donateCopy.successAnother}
            </button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="donate-hero-title"
      className="relative isolate overflow-hidden bg-cream text-ink"
    >
      {/* Hero band */}
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-gradient-to-br from-ink via-sunset-red/90 to-sunset-orange/80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(251,191,36,0.5), transparent 55%), radial-gradient(circle at 80% 20%, rgba(255,237,213,0.4), transparent 55%)',
          }}
        />
        <Container className="relative z-10 py-20 sm:py-28">
          <div className="glass-panel-dark mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border-white/20 p-10 text-center text-white shadow-2xl sm:p-14">
            <div className="mb-0 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-gold">
                {donateCopy.heroEyebrow}
              </span>
            </div>
            <h1
              id="donate-hero-title"
              className="text-balance font-serif text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl text-glow-orange"
            >
              {donateCopy.heroTitle}
            </h1>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg">
              {donateCopy.heroSubtitle}
            </p>
            <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {donateCopy.intro}
            </p>
          </div>
        </Container>
      </div>

      {/* Widget */}
      <div className="relative py-20 sm:py-24">
        <Container className="max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
            <aside className="space-y-6 lg:sticky lg:top-28">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {donateCopy.heroTitle}
              </h2>
              <p className="text-pretty text-base leading-relaxed text-ink-light sm:text-lg">
                {donateCopy.intro}
              </p>
              <ul role="list" className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {donateCopy.trustBadges.map((badge: string) => (
                  <li
                    key={badge}
                    className="flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/60 px-4 py-3 text-sm font-semibold text-amber-900"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300 text-amber-900"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="h-4 w-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
                      </svg>
                    </span>
                    {badge}
                  </li>
                ))}
              </ul>
            </aside>

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-describedby={error ? errorId : undefined}
              className="glass-panel flex flex-col gap-7 rounded-3xl p-6 sm:p-8 lg:p-10"
            >
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                  {donateCopy.frequencyLabel}
                </legend>
                <div
                  id={frequencyGroupId}
                  role="radiogroup"
                  aria-label={donateCopy.frequencyLabel}
                  className="mt-3 inline-flex w-full rounded-full bg-white/80 p-1 shadow-inner sm:w-auto"
                >
                  {(
                    [
                      { value: 'one-time' as const, label: donateCopy.frequencyOneTime },
                      { value: 'monthly' as const, label: donateCopy.frequencyMonthly },
                    ]
                  ).map((option) => {
                    const active = option.value === frequency
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => handleFrequencyChange(option.value)}
                        className={
                          'flex-1 rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:flex-none ' +
                          (active
                            ? 'bg-ink text-white shadow-sm'
                            : 'text-ink/70 hover:text-ink')
                        }
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                  {donateCopy.amountLabel}
                </legend>
                <div
                  id={amountGroupId}
                  role="radiogroup"
                  aria-label={donateCopy.amountLabel}
                  className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5"
                >
                  {amountOptions.map((amount) => {
                    const active = selectedPreset === amount && !hasCustomValue
                    return (
                      <button
                        key={amount}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        data-amount={amount}
                        onClick={() => handlePresetClick(amount)}
                        className={
                          'rounded-2xl border px-4 py-3 text-center text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ' +
                          (active
                            ? 'border-amber-400 bg-amber-300 text-ink shadow-md ring-2 ring-amber-300'
                            : 'border-slate-200 bg-white text-ink hover:border-amber-300 hover:bg-amber-50')
                        }
                      >
                        {formatCurrency(amount)}
                      </button>
                    )
                  })}
                </div>

                <label
                  htmlFor={customInputId}
                  className="mt-5 flex flex-col gap-2 text-sm font-semibold text-ink/80"
                >
                  <span>{donateCopy.customPlaceholder}</span>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base font-semibold text-ink/50"
                    >
                      $
                    </span>
                    <input
                      id={customInputId}
                      name="customAmount"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="0.00"
                      aria-label={donateCopy.customAriaLabel}
                      value={customAmount}
                      onChange={(event) => handleCustomChange(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-base font-semibold text-ink shadow-inner focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                </label>
              </fieldset>

              {error ? (
                <p
                  id={errorId}
                  role="alert"
                  className="rounded-2xl border border-rose-custom/30 bg-rose-custom/10 px-4 py-3 text-sm font-semibold text-rose-custom"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sunset-orange px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-sunset-gold hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {donateCopy.submitButton}
                <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </button>
            </form>
          </div>
        </Container>
      </div>
    </section>
  )
}

export default DonationWidget