/**
 * Donation Page Template for SonicJS
 *
 * Data-driven from the migrated site-settings document (features, priority
 * links, preset tiers, bank/PayID details) with bilingual chrome copy matching
 * the production donation widget. Preset cards scroll to the direct-payment
 * section; bank details carry copy-to-clipboard actions.
 */

import { html } from 'hono/html'
import type { DonationOption, FeatureBadge, PriorityLink, SiteSettingsData } from '../utils/content'

export interface DonatePageProps {
  lang: 'en' | 'lv'
  settings: SiteSettingsData
}

const isPlaceholder = (value: string | undefined): boolean => {
  if (!value) return true
  const lower = value.toLowerCase()
  return (
    lower === 'not configured' ||
    lower === 'nav konfigurēts' ||
    lower === 'dla@example.com' ||
    lower === '000-000' ||
    lower === '00000000' ||
    lower.startsWith('enter the verified')
  )
}

const DEFAULT_FEATURES: FeatureBadge[] = [
  { id: 'secure', enLabel: 'Secure checkout', lvLabel: 'Droši maksājumi' },
  { id: 'fees', enLabel: 'Zero fees via PayID', lvLabel: 'Bez komisijas maksas caur PayID' },
  { id: 'direct', enLabel: 'Direct to community', lvLabel: 'Tieši kopienai' },
]

const DEFAULT_PRIORITIES: PriorityLink[] = [
  {
    id: 'cultural-events',
    enTitle: 'Cultural Events',
    enBody:
      'Funding for continuity of language, heritage, and community celebrations like Jāņi and Lieldienas.',
    lvTitle: 'Kultūras pasākumi',
    lvBody:
      'Finansējums valodas, mantojuma un kopienas svētku, piemēram, Jāņu un Lieldienu, nepārtrauktībai.',
    url: null,
    newTab: false,
  },
  {
    id: 'community-stability',
    enTitle: 'Community Stability',
    enBody: 'Help with hall rentals, equipment, and resources for our regular gatherings.',
    lvTitle: 'Kopienas stabilitāte',
    lvBody:
      'Palīdzība ar telpu īri, aprīkojumu un resursiem mūsu regulārajām tikšanās reizēm.',
    url: null,
    newTab: false,
  },
  {
    id: 'emergency-relief',
    enTitle: 'Emergency relief',
    enBody: 'Immediate support for members of our community facing unexpected hardships.',
    lvTitle: 'Ārkārtas palīdzība',
    lvBody:
      'Tūlītējs atbalsts mūsu kopienas locekļiem, kuri saskaras ar neparedzētām grūtībām.',
    url: null,
    newTab: false,
  },
]

const DEFAULT_OPTIONS: DonationOption[] = [
  { id: 'amount-10', amount: 10, enBody: 'Helps with transport assistance or a community meal contribution.', lvBody: 'Palīdz ar transporta izdevumiem vai kopienas maltītes organizēšanu.' },
  { id: 'amount-25', amount: 25, enBody: 'Covers materials for one cultural workshop or language class.', lvBody: 'Nosedz materiālu izmaksas vienai kultūras darbnīcai vai valodas nodarbībai.' },
  { id: 'amount-50', amount: 50, enBody: 'Supports essential supplies for our major community events.', lvBody: 'Atbalsta nepieciešamos krājumus mūsu lielākajiem kopienas pasākumiem.' },
  { id: 'amount-100', amount: 100, enBody: 'Funds hall hire for a regular community gathering or choir practice.', lvBody: 'Finansē telpu īri regulārai kopienas sanāksmei vai kora mēģinājumam.' },
  { id: 'amount-250', amount: 250, enBody: 'Contributes significantly to our annual national day celebrations.', lvBody: 'Ievērojami veicina mūsu ikgadējo nacionālo svētku organizēšanu.' },
]

export function renderDonatePage({ lang, settings }: DonatePageProps) {
  const isLv = lang === 'lv'

  const copy = {
    heroEyebrow: isLv ? 'Atbalsti mūsu kopienu' : 'Support our community',
    heroTitle: isLv ? 'Ziedot' : 'Donate',
    heroSubtitle: isLv
      ? 'Atbalstiet mūsu kopienu Ziemeļu Teritorijā un palīdziet saglabāt latviešu mantojumu.'
      : 'Support our community in the Northern Territory and preserve our Latvian heritage.',
    quickLabel: isLv ? 'Ātrs ziedojums' : 'Quick Donate',
    quickTitle: isLv ? 'Izvēlieties summu' : 'Choose an Amount',
    quickIntro: isLv
      ? 'Izvēlieties norādīto summu, lai ziedotu nekavējoties, vai ritiniet uz leju, lai ievadītu jebkuru summu.'
      : 'Select a preset amount to donate instantly, or scroll down to enter any amount.',
    quickDonateButton: isLv ? 'Ziedot tagad' : 'Donate now',
    urgentLabel: isLv ? 'Aktuālās vajadzības' : 'Urgent Priority',
    urgentTitle: isLv ? 'Atbalsts nepieciešams tagad' : 'Support Needed Now',
    urgentIntro: isLv
      ? 'DLA novirza atbalstu mūsu vietējiem pasākumiem, kultūras saglabāšanai un cilvēkiem, kuriem tas nepieciešams. Ātri ziedojumi ļauj mums nekavējoties reaģēt.'
      : 'DLA directs support to our local community events, cultural preservation, and people in need. Fast donations let us respond quickly.',
    directLabel: isLv ? 'Tiešs maksājums' : 'Direct Payment',
    directTitle: isLv ? 'Bankas pārskaitījums un PayID' : 'Bank Transfer & PayID',
    directIntro: isLv
      ? 'Ieteicams lielākiem ziedojumiem. Tiešajiem pārskaitījumiem nav apstrādes maksas, un mēs varam izsniegt kvīti pēc pieprasījuma.'
      : 'Recommended for larger donations. Direct transfers carry no processing fees and we can issue a receipt on request.',
    bankLabel: isLv ? 'Banka' : 'Bank',
    accountNameLabel: isLv ? 'Konta īpašnieks' : 'Account Name',
    accountNumberLabel: isLv ? 'Konta numurs' : 'Account Number',
    referenceLabel: isLv ? 'Atsauce / Mērķis:' : 'Reference:',
    referenceHint: isLv
      ? 'Norādiet savu vārdu vai "Ziedojums", lai palīdzētu mums identificēt ziedojumu.'
      : 'Add your name or "Donation" to help us track your gift and issue a receipt.',
    payIdTitle: isLv ? 'PayID — ātrāks veids' : 'PayID — faster option',
    payIdBody: isLv
      ? 'Sūtiet tieši no jebkuras Austrālijas bankas lietotnes dažu sekunžu laikā. Meklējiet "Pay to PayID" un ielīmējiet tālāk norādīto e-pastu.'
      : 'Send directly from any Australian banking app in seconds. Look for "Pay to PayID" or "New PayID payment" and paste the email below.',
    payIdEmailLabel: isLv ? 'PayID E-pasts' : 'PayID Email',
    zeroFeesTitle: isLv ? 'Bez komisijas maksas' : 'Zero fees',
    zeroFeesBody: isLv
      ? 'PayID un bankas pārskaitījumi nosūta līdzekļus tieši DLA bez jebkādiem atvilkumiem. 100% ziedojumu nonāk mūsu programmās.'
      : 'PayID and bank transfers route funds directly to DLA with no deductions. 100% of donations go to our programs.',
    receiptFooter: isLv
      ? 'Nepieciešama kvīts? Nosūtiet mums e-pastu ar savu vārdu un pārskaitījuma detaļām, un mēs to apstiprināsim.'
      : "Need a receipt? Email us with your name and transfer details and we'll confirm promptly.",
    copyLabel: isLv ? 'Kopēt' : 'Copy',
  }

  const features = settings.features && settings.features.length > 0 ? settings.features : DEFAULT_FEATURES
  const priorities = settings.priorityLinks && settings.priorityLinks.length > 0 ? settings.priorityLinks : DEFAULT_PRIORITIES
  const options = settings.donationOptions && settings.donationOptions.length > 0 ? settings.donationOptions : DEFAULT_OPTIONS

  const bankName = isLv ? settings.bankName_lv : settings.bankName_en
  const accountName = isLv ? settings.accountName_lv : settings.accountName_en
  const payId = isLv ? settings.payId_lv : settings.payId_en
  const bsb = settings.bsb
  const accountNumber = settings.accountNumber
  const instructions = isLv ? settings.instructions_lv : settings.instructions_en

  const bankNameFallback = bankName || (isLv ? 'Bendigo Bank' : 'Bendigo Bank')
  const accountNameFallback = accountName || 'Latvian Association of Darwin'
  const bsbFallback = bsb || '633-000'
  const accountFallback = accountNumber || '210814547'
  const payIdFallback = payId || (isLv ? 'Nav konfigurēts' : 'Not configured')

  return html`
    <section class="relative isolate overflow-hidden bg-cream py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <!-- Top Banner / Header -->
        <div class="glass-panel flex flex-col gap-10 rounded-3xl p-6 sm:p-12 shadow-lg">
          <div class="space-y-4">
            <span class="inline-block rounded-full bg-sunset-orange/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-sunset-orange">
              ${copy.heroEyebrow}
            </span>
            <h1 class="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              ${copy.heroTitle}
            </h1>
            <p class="max-w-2xl text-base text-ink/75 sm:text-lg leading-relaxed font-medium">
              ${copy.heroSubtitle}
            </p>

            <!-- Feature Pills -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              ${features.map((feature) => {
                const label = isLv ? feature.lvLabel : feature.enLabel
                return html`
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-ink shadow-sm">
                    <span class="text-emerald-600 font-bold">✓</span> ${label}
                  </span>
                `
              })}
            </div>
          </div>

          <!-- Preset Amounts -->
          <div>
            <div class="mb-4">
              <p class="text-xs font-bold uppercase tracking-widest text-sunset-orange">
                ${copy.quickLabel}
              </p>
              <h2 class="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">
                ${copy.quickTitle}
              </h2>
              <p class="text-sm text-slate-500 mt-1">
                ${copy.quickIntro}
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              ${options.map((preset) => {
                const body = isLv ? preset.lvBody : preset.enBody
                return html`
                  <a
                    href="#direct-payment"
                    class="group flex flex-col items-start rounded-2xl border-2 border-slate-200/90 bg-white p-5 text-left transition hover:border-sunset-orange hover:shadow-lg"
                  >
                    <p class="text-2xl font-black text-sunset-orange sm:text-3xl">$${preset.amount}</p>
                    <p class="mt-2 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      ${body}
                    </p>
                    <div class="mt-4 flex w-full items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <span class="text-[11px] font-bold uppercase tracking-wide text-sunset-orange group-hover:text-sunset-red transition">
                        ${copy.quickDonateButton}
                      </span>
                      <span class="text-xs text-slate-400 group-hover:text-sunset-red transition">→</span>
                    </div>
                  </a>
                `
              })}
            </div>
          </div>
        </div>

        <!-- Priority Need Areas -->
        <div class="glass-panel rounded-3xl p-8 sm:p-10 shadow-lg">
          <p class="text-xs font-bold uppercase tracking-widest text-sunset-orange">
            ${copy.urgentLabel}
          </p>
          <h2 class="mt-1 font-serif text-2xl font-bold text-ink sm:text-3xl">
            ${copy.urgentTitle}
          </h2>
          <p class="mt-2 max-w-2xl text-sm text-slate-600 leading-relaxed">
            ${copy.urgentIntro}
          </p>

          <div class="mt-6 grid gap-6 sm:grid-cols-3">
            ${priorities.map((item) => {
              const title = isLv ? item.lvTitle : item.enTitle
              const body = isLv ? item.lvBody : item.enBody
              return html`
                <div class="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <h3 class="font-bold text-ink text-base">
                    ${title}
                  </h3>
                  <p class="mt-2 text-xs text-slate-600 leading-relaxed">
                    ${body}
                  </p>
                </div>
              `
            })}
          </div>
        </div>

        <!-- Direct Payment: Bank Transfer & PayID -->
        <div id="direct-payment" class="rounded-3xl border-2 border-slate-200/80 bg-white p-8 sm:p-12 shadow-xl">
          <p class="text-xs font-bold uppercase tracking-widest text-sunset-orange">
            ${copy.directLabel}
          </p>
          <h2 class="mt-1 font-serif text-3xl font-bold text-ink">
            ${copy.directTitle}
          </h2>
          <p class="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
            ${copy.directIntro}
          </p>

          ${instructions && !isPlaceholder(instructions)
            ? html`
                <p class="mt-3 rounded-xl bg-amber-50/80 p-3.5 border border-amber-200 text-xs text-amber-800 leading-relaxed max-w-2xl">
                  ${instructions}
                </p>
              `
            : ''}

          <div class="mt-8 grid gap-8 lg:grid-cols-2">
            <!-- Bank Details -->
            <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-4">
              <h3 class="font-bold text-ink text-lg flex items-center gap-2">
                <span>🏦</span> ${isLv ? 'Bankas informācija' : 'Bank Transfer Details'}
              </h3>

              <div class="space-y-3">
                <div class="flex items-center justify-between rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">${copy.bankLabel}</p>
                    <p class="text-base font-bold text-ink">${bankNameFallback}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">${copy.accountNameLabel}</p>
                    <p class="text-base font-bold text-ink">${accountNameFallback}</p>
                  </div>
                  ${!isPlaceholder(accountNameFallback)
                    ? html`
                        <button
                          type="button"
                          onclick="copyToClipboard('${accountNameFallback.replace(/'/g, "\\'")}', this)"
                          class="rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-sunset-orange hover:text-white transition"
                        >
                          ${copy.copyLabel}
                        </button>
                      `
                    : ''}
                </div>

                <div class="flex items-center justify-between rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">BSB</p>
                    <p class="font-mono text-lg font-bold text-ink">${bsbFallback}</p>
                  </div>
                  ${!isPlaceholder(bsbFallback)
                    ? html`
                        <button
                          type="button"
                          onclick="copyToClipboard('${bsbFallback.replace(/'/g, "\\'")}', this)"
                          class="rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-sunset-orange hover:text-white transition"
                        >
                          ${copy.copyLabel}
                        </button>
                      `
                    : ''}
                </div>

                <div class="flex items-center justify-between rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">${copy.accountNumberLabel}</p>
                    <p class="font-mono text-lg font-bold text-ink">${accountFallback}</p>
                  </div>
                  ${!isPlaceholder(accountFallback)
                    ? html`
                        <button
                          type="button"
                          onclick="copyToClipboard('${accountFallback.replace(/'/g, "\\'")}', this)"
                          class="rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-sunset-orange hover:text-white transition"
                        >
                          ${copy.copyLabel}
                        </button>
                      `
                    : ''}
                </div>

                <div class="rounded-xl bg-amber-50/80 p-3.5 border border-amber-200">
                  <p class="text-xs font-bold text-amber-900">${copy.referenceLabel}</p>
                  <p class="text-xs text-amber-800 mt-0.5">
                    ${copy.referenceHint}
                  </p>
                </div>
              </div>
            </div>

            <!-- PayID Details -->
            <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-4">
              <h3 class="font-bold text-ink text-lg flex items-center gap-2">
                <span>⚡</span> ${copy.payIdTitle}
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                ${copy.payIdBody}
              </p>

              <div class="flex items-center justify-between rounded-xl bg-white p-3.5 border border-slate-200 shadow-sm">
                <div class="overflow-hidden">
                  <p class="text-xs font-bold uppercase tracking-widest text-slate-400">${copy.payIdEmailLabel}</p>
                  <p class="truncate text-base font-bold text-ink">${payIdFallback}</p>
                </div>
                ${!isPlaceholder(payIdFallback)
                  ? html`
                      <button
                        type="button"
                        onclick="copyToClipboard('${payIdFallback.replace(/'/g, "\\'")}', this)"
                        class="shrink-0 rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-sunset-orange hover:text-white transition"
                      >
                        ${copy.copyLabel}
                      </button>
                    `
                  : ''}
              </div>

              <div class="rounded-xl bg-emerald-50/80 p-4 border border-emerald-200 space-y-2">
                <p class="text-xs font-bold text-emerald-900">
                  ${copy.zeroFeesTitle}
                </p>
                <p class="text-xs text-emerald-800 leading-relaxed">
                  ${copy.zeroFeesBody}
                </p>
              </div>
            </div>
          </div>

          <p class="mt-6 text-sm text-slate-500 italic text-center">
            ${copy.receiptFooter}
          </p>
        </div>
      </div>
    </section>
  `
}
