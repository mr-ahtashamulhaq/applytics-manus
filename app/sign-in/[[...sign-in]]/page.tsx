import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export const metadata = {
  title: 'Applytics',
  description: 'Sign in to your Applytics account.',
}

export default function SignInPage() {
  return (
    <div
      className="min-h-dvh flex"
      style={{ background: 'var(--surface)' }}
    >
      {/* Left panel — branding */}
      <div
        data-testid="dark-panel"
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12"
        style={{
          background: 'var(--brand-black)',
          color: 'var(--on-dark)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/applytics-logo.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--on-dark)' }}>Applytics</span>
        </div>

        {/* Tagline */}
        <div>
          <h2
            className="text-h2 mb-3"
            style={{ color: 'var(--on-dark)', letterSpacing: '-0.5px' }}
          >
            Bring context to every application.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--on-dark-muted)' }}>
            Choose a current listing or enter job details. Review a job-specific resume draft and keep the application record connected.
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-xs" style={{ color: 'var(--steel)' }}>
          © {new Date().getFullYear()} Applytics. All rights reserved.
        </p>
      </div>

      {/* Right panel — Clerk form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/applytics-logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" aria-hidden="true" />
              <span className="text-base font-semibold tracking-tight" style={{ color: 'var(--ink-deep)' }}>Applytics</span>
            </div>
          </div>

          <SignIn
            fallbackRedirectUrl="/app/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#de0d12',
                colorBackground: '#ffffff',
                borderRadius: '6px',
                fontFamily: 'var(--font-geist-sans)',
              },
              elements: {
                card: 'shadow-none border border-[--hairline] rounded-lg',
                headerTitle: 'text-h3',
                formButtonPrimary:
                  'bg-[--brand-red] hover:bg-[--brand-red-deep] text-white rounded-md font-medium transition-colors',
                footerActionLink: 'text-[--brand-red] font-medium',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
