/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LanguageProvider } from '@/app/(frontend)/i18n/LanguageProvider'
import { DonationWidget } from '@/app/(frontend)/donate/DonationWidget'

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/donate',
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

function renderWidget() {
  return render(
    <LanguageProvider initialLang="en">
      <DonationWidget />
    </LanguageProvider>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('<DonationWidget />', () => {
  it('renders form with One-Time and Monthly donation buttons', () => {
    renderWidget()
    expect(screen.getByRole('button', { name: /One-Time/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Monthly/i })).toBeInTheDocument()
  })

  it('renders preset amount buttons and urgent items', () => {
    renderWidget()
    // An amount button with a dollar sign in the content
    const amountButtons = screen.getAllByText(/^\$10|\$25|\$50|\$100|\$250/)
    expect(amountButtons.length).toBeGreaterThanOrEqual(5)
    expect(screen.getByText(/urgent priority/i)).toBeInTheDocument()
  })

  it('has custom amount input with label', () => {
    renderWidget()
    // The input is labelled by a <label htmlFor=...> element
    const input = screen.getByLabelText(/enter any amount/i)
    expect(input).toBeInTheDocument()
    fireEvent.change(input, { target: { value: '50' } })
    expect(input).toHaveValue('50')
  })

  it('validates amount > 0 on submit', () => {
    renderWidget()
    const submitBtn = screen.getByRole('button', { name: /One-Time/i })
    fireEvent.click(submitBtn)
    expect(screen.getByText(/positive number greater than zero/i)).toBeInTheDocument()
  })

  it('shows success screen on valid submission', async () => {
    renderWidget()
    const amountInput = screen.getByLabelText(/enter any amount/i)
    fireEvent.change(amountInput, { target: { value: '50' } })
    const submitBtn = screen.getByRole('button', { name: /One-Time/i })
    fireEvent.click(submitBtn)
    await waitFor(() => {
      expect(screen.getByText(/Thank you for your generosity/i)).toBeInTheDocument()
    })
  })
})
