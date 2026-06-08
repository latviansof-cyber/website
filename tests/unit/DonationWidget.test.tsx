/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '@/app/(frontend)/i18n/LanguageProvider'
import { DonationWidget, type DonationPayload } from '@/app/(frontend)/donate/DonationWidget'

function renderWidget(props: { onSubmit?: (payload: DonationPayload) => void } = {}) {
  const onSubmit = props.onSubmit ?? jest.fn()
  const utils = render(
    <LanguageProvider>
      <DonationWidget onSubmit={onSubmit} />
    </LanguageProvider>,
  )
  const submitButton = screen.getByRole('button', { name: /donate now/i })
  const customInput = screen.getByLabelText(/custom donation amount in australian dollars/i)
  const oneTimeButton = screen.getByRole('radio', { name: /one-time/i })
  const monthlyButton = screen.getByRole('radio', { name: /monthly/i })
  const presetButtons = screen.getAllByRole('radio').filter((btn: HTMLElement) => btn.hasAttribute('data-amount'))
  const getPreset = (amount: number) =>
    presetButtons.find((btn: HTMLElement) => btn.getAttribute('data-amount') === String(amount)) as HTMLElement
  const getAlert = () => screen.queryByRole('alert') as HTMLElement | null
  return {
    onSubmit,
    submitButton,
    customInput,
    oneTimeButton,
    monthlyButton,
    presetButtons,
    getPreset,
    getAlert,
    ...utils,
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('<DonationWidget />', () => {
  it('renders the hero copy, frequency toggle, preset amounts, and custom input', () => {
    const { oneTimeButton, monthlyButton, presetButtons, customInput, submitButton, getAlert } =
      renderWidget()

    expect(screen.getByRole('heading', { name: /stand with the latvian community in darwin/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/donation frequency/i)).toBeInTheDocument()
    expect(oneTimeButton).toHaveAttribute('aria-checked', 'true')
    expect(monthlyButton).toHaveAttribute('aria-checked', 'false')
    expect(presetButtons).toHaveLength(5)
    expect(within(presetButtons[0]).getByText('$10')).toBeInTheDocument()
    expect(customInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
    expect(getAlert()).toBeNull()
  })

  it('toggles between one-time and monthly frequency', async () => {
    const user = userEvent.setup()
    const { oneTimeButton, monthlyButton } = renderWidget()

    expect(oneTimeButton).toHaveAttribute('aria-checked', 'true')
    expect(monthlyButton).toHaveAttribute('aria-checked', 'false')

    await user.click(monthlyButton)
    expect(monthlyButton).toHaveAttribute('aria-checked', 'true')
    expect(oneTimeButton).toHaveAttribute('aria-checked', 'false')

    await user.click(oneTimeButton)
    expect(oneTimeButton).toHaveAttribute('aria-checked', 'true')
    expect(monthlyButton).toHaveAttribute('aria-checked', 'false')
  })

  it('highlights a preset when clicked and clears any custom value', async () => {
    const user = userEvent.setup()
    const { getPreset, customInput, oneTimeButton, monthlyButton } = renderWidget()

    const preset50 = getPreset(50)
    await user.click(preset50)
    expect(preset50).toHaveAttribute('aria-checked', 'true')
    expect(preset50).toHaveClass('border-amber-400')
    expect(customInput).toHaveValue('')

    // Switching frequency does not clear the selection
    await user.click(monthlyButton)
    expect(preset50).toHaveAttribute('aria-checked', 'true')
    await user.click(oneTimeButton)
  })

  it('uses the custom amount and clears the preset when the user types', async () => {
    const user = userEvent.setup()
    const { customInput, getPreset, submitButton, onSubmit } = renderWidget()

    // First select a preset
    const preset25 = getPreset(25)
    await user.click(preset25)
    expect(preset25).toHaveAttribute('aria-checked', 'true')

    // Typing in the custom field deselects the preset
    await user.type(customInput, '42.50')
    expect(customInput).toHaveValue('42.50')
    expect(preset25).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByRole('alert')).toBeNull()

    // Submitting logs and calls onSubmit with the custom amount
    await user.click(submitButton)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        frequency: 'one-time',
        amount: 42.5,
        presetAmount: null,
        customAmount: '42.50',
        currency: 'AUD',
      }),
    )
  })

  it('strips non-numeric characters from the custom input', async () => {
    const user = userEvent.setup()
    const { customInput } = renderWidget()

    await user.type(customInput, 'a1b2c.5d')
    expect(customInput).toHaveValue('12.5')
  })

  it('shows an inline error when the user submits without selecting an amount', async () => {
    const user = userEvent.setup()
    const { submitButton, onSubmit, getAlert } = renderWidget()

    await user.click(submitButton)

    const alert = getAlert()
    expect(alert).not.toBeNull()
    expect(alert).toHaveTextContent(/please choose or enter a donation amount/i)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows an inline error when the custom amount is not a positive number', async () => {
    const user = userEvent.setup()
    const { customInput, submitButton, onSubmit, getAlert } = renderWidget()

    await user.type(customInput, '0')
    await user.click(submitButton)
    let alert = getAlert()
    expect(alert).not.toBeNull()
    expect(alert).toHaveTextContent(/enter a positive number greater than zero/i)
    expect(onSubmit).not.toHaveBeenCalled()

    // Clear and try a negative value (which is sanitised away, leaving empty)
    await user.clear(customInput)
    await user.type(customInput, '-5')
    // The minus sign is stripped, so the input is "5" — that should be valid.
    // Instead, test the "no digits" case:
    await user.clear(customInput)
    await user.type(customInput, 'abc')
    await user.click(submitButton)
    alert = getAlert()
    expect(alert).not.toBeNull()
    expect(alert).toHaveTextContent(/please choose or enter a donation amount/i)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a valid preset amount and renders the success state', async () => {
    const user = userEvent.setup()
    const { getPreset, submitButton, onSubmit } = renderWidget()

    await user.click(getPreset(100))
    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const payload = (onSubmit as jest.Mock).mock.calls[0][0] as DonationPayload
    expect(payload).toMatchObject({
      frequency: 'one-time',
      amount: 100,
      presetAmount: 100,
      customAmount: '',
      currency: 'AUD',
    })

    // Success view is rendered
    expect(await screen.findByRole('heading', { name: /thank you for your generosity/i })).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText(/one-time/i)).toBeInTheDocument()

    // The reset button restores the form
    const resetButton = screen.getByRole('button', { name: /make another donation/i })
    fireEvent.click(resetButton)
    expect(
      screen.getByRole('heading', { name: /stand with the latvian community in darwin/i }),
    ).toBeInTheDocument()
  })

  it('submits a monthly preset amount with the correct frequency', async () => {
    const user = userEvent.setup()
    const { getPreset, monthlyButton, submitButton, onSubmit } = renderWidget()

    await user.click(monthlyButton)
    await user.click(getPreset(50))
    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ frequency: 'monthly', amount: 50, presetAmount: 50 }),
    )
  })
})