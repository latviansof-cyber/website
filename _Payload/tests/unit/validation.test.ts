import {
  EventItemSchema,
  LangSchema,
  SiteContentSchema,
  validateSiteContent,
  type SiteContentValidated,
} from '@/lib/validation'

const baseContent: SiteContentValidated = {
  nav: { about: 'A', history: 'H', events: 'E', skipToContent: 'S', donate: 'D' },
  hero: { eyebrow: 'e', title: 't', subtitle: 's', cta: 'c' },
  about: { title: 'About', body: ['paragraph 1'] },
  history: { title: 'History', body: ['paragraph 1'] },
  events: {
    title: 'Events',
    intro: 'intro',
    items: [{ id: 'lieldienas', title: 't', body: 'b' }],
  },
  footer: {
    tagline: 'tag',
    contact: 'c',
    contactTitle: 'Contact',
    quickLinks: 'Quick Links',
    rights: 'r',
    address: 'addr',
    languageLabel: 'Lang',
    donate: {
      heroEyebrow: 'e',
      heroTitle: 't',
      heroSubtitle: 's',
      urgentLabel: 'Urgent',
      urgentTitle: 'Support',
      urgentIntro: 'Help',
      urgentItems: [{ title: 'Cultural', body: 'Fund' }],
      features: ['100% to programs'],
      quickLabel: 'Quick',
      quickTitle: 'Quick donate',
      quickIntro: 'Pick an amount',
      presetAmounts: [{ amount: 10, body: 'Helps' }],
      quickDonateButton: 'Donate now',
      largeDonationTitle: 'AU$500 or more',
      largeDonationBody: 'Recommended',
      largeDonationButton: 'Donate',
      customOrLabel: 'or enter',
      customLoading: 'Loading',
      directLabel: 'Direct Payment',
      directTitle: 'Bank Transfer',
      directIntro: 'Use your bank',
      bankOrgName: 'DLA',
      bankStep1Title: 'Step 1',
      bankStep1Body: 'Open your bank app',
      bankStep2Title: 'Step 2',
      bankBsbLabel: 'BSB',
      bankBsb: '000-000',
      bankAccountLabel: 'Account',
      bankAccount: '00-000-0000',
      bankStep3Title: 'Step 3',
      bankStep3Ref: 'Reference',
      bankStep3Body: 'Use DLA as reference',
      payIdTitle: 'PayID',
      payIdBody: 'Send via PayID',
      payIdEmailLabel: 'Email',
      payIdEmail: 'donate@dla.org',
      payIdZeroFeesTitle: 'Zero fees',
      payIdZeroFeesBody: '100% goes to DLA',
      receiptFooterText: 'Receipt available',
      intro: 'Donate now',
      amountLabel: 'Amount',
      customPlaceholder: 'Other',
      customAriaLabel: 'Custom amount',
      frequencyLabel: 'Frequency',
      frequencyOneTime: 'One-time',
      frequencyMonthly: 'Monthly',
      submitButton: 'Donate',
      submitLoading: 'Processing',
      errorAmountRequired: 'Please choose',
      errorInvalidAmount: 'Enter a positive number',
      successHeading: 'Thanks',
      successBody: 'In production',
      successAnother: 'Donate again',
      trustBadges: ['Bank-grade security'],
    },
  },
}

describe('LangSchema', () => {
  it('accepts "en" and "lv"', () => {
    expect(LangSchema.parse('en')).toBe('en')
    expect(LangSchema.parse('lv')).toBe('lv')
  })

  it('rejects anything else', () => {
    expect(LangSchema.safeParse('fr').success).toBe(false)
    expect(LangSchema.safeParse(null).success).toBe(false)
  })
})

describe('EventItemSchema', () => {
  it('rejects ids that are not kebab-case', () => {
    const result = EventItemSchema.safeParse({ id: 'Not Kebab', title: 't', body: 'b' })
    expect(result.success).toBe(false)
  })

  it('accepts well-formed events', () => {
    const result = EventItemSchema.safeParse({ id: 'may4', title: 't', body: 'b' })
    expect(result.success).toBe(true)
  })
})

describe('SiteContentSchema', () => {
  it('accepts a complete bilingual payload', () => {
    const result = SiteContentSchema.safeParse(baseContent)
    expect(result.success).toBe(true)
  })

  it('rejects a payload with an empty event list', () => {
    const result = SiteContentSchema.safeParse({ ...baseContent, events: { ...baseContent.events, items: [] } })
    expect(result.success).toBe(false)
  })

  it('rejects a payload with an empty body array', () => {
    const result = SiteContentSchema.safeParse({ ...baseContent, about: { title: 'A', body: [] } })
    expect(result.success).toBe(false)
  })
})

describe('validateSiteContent', () => {
  it('returns ok:true with typed data on valid input', () => {
    const result = validateSiteContent(baseContent)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.events.items[0].id).toBe('lieldienas')
    }
  })

  it('returns ok:false with a zod error on invalid input', () => {
    const result = validateSiteContent({ nav: {} })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.issues.length).toBeGreaterThan(0)
    }
  })
})
