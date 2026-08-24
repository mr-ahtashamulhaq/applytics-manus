import type { Metadata } from 'next'
import PrivacyControls from '@/components/account/PrivacyControls'

export const metadata: Metadata = {
  title: 'Account privacy',
  description: 'Export or delete your Applytics account data.',
}

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-8 border-b pb-6" style={{ borderColor: 'var(--hairline)' }}>
        <p className="text-label mb-1">Account</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Privacy and data</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: 'var(--steel)' }}>
          Download the information you have stored or remove your Applytics account.
        </p>
      </header>
      <PrivacyControls />
    </div>
  )
}
