/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/app/(frontend)/i18n/LanguageProvider'
import { LanguageSwitcher } from '@/app/(frontend)/components/LanguageSwitcher'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/donate',
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
}))

function renderSwitcher() {
  return render(
    <LanguageProvider initialLang="en">
      <LanguageSwitcher />
    </LanguageProvider>,
  )
}

describe('<LanguageSwitcher />', () => {
  beforeEach(() => push.mockClear())

  it('renders both EN and LV buttons with EN active by default', () => {
    renderSwitcher()
    const en = screen.getByRole('button', { name: /Language: EN/i })
    const lv = screen.getByRole('button', { name: /Language: LV/i })
    expect(en).toHaveAttribute('aria-pressed', 'true')
    expect(lv).toHaveAttribute('aria-pressed', 'false')
  })

  it('navigates to the equivalent Latvian URL when LV is clicked', () => {
    renderSwitcher()
    const lv = screen.getByRole('button', { name: /Language: LV/i })
    fireEvent.click(lv)
    expect(push).toHaveBeenCalledWith('/lv/donate')
  })
})
