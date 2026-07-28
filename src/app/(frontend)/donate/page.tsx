import { permanentRedirect } from 'next/navigation'

export default function LegacyDonatePage() {
  permanentRedirect('/en/donate')
}
