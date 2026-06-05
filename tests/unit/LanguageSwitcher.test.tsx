/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/app/(frontend)/i18n/LanguageProvider'
import { LanguageSwitcher } from '@/app/(frontend)/components/LanguageSwitcher'

function renderSwitcher() {
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  )
}

describe('<LanguageSwitcher />', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders both EN and LV buttons with EN active by default', () => {
    renderSwitcher()
    const en = screen.getByRole('button', { name: /Language: EN/i })
    const lv = screen.getByRole('button', { name: /Language: LV/i })
    expect(en).toHaveAttribute('aria-pressed', 'true')
    expect(lv).toHaveAttribute('aria-pressed', 'false')
  })

  it('flips the active state when LV is clicked', () => {
    renderSwitcher()
    const lv = screen.getByRole('button', { name: /Language: LV/i })
    fireEvent.click(lv)
    expect(lv).toHaveAttribute('aria-pressed', 'true')
    const en = screen.getByRole('button', { name: /Language: EN/i })
    expect(en).toHaveAttribute('aria-pressed', 'false')
  })

  it('persists the chosen language to localStorage', () => {
    renderSwitcher()
    const lv = screen.getByRole('button', { name: /Language: LV/i })
    fireEvent.click(lv)
    expect(window.localStorage.getItem('dla.lang')).toBe('lv')
  })

  it('rejects an invalid localStorage value on mount', () => {
    window.localStorage.setItem('dla.lang', 'fr')
    renderSwitcher()
    const en = screen.getByRole('button', { name: /Language: EN/i })
    expect(en).toHaveAttribute('aria-pressed', 'true')
  })
})

