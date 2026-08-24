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
        <div className="flex items-center gap-2">
          <Image src="/chrome-shiny-wordmark.png" alt="Applytics" width={100} height={32} className="object-contain" />
        </div>

        {/* Tagline */}
        <div>
          <h2
            className="text-h2 mb-3"
            style={{ color: 'var(--on-dark)', letterSpacing: '-0.5px' }}
          >
            Tailored resumes for every job.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--on-dark-muted)' }}>
            Paste a job description. Get an ATS-optimized resume in seconds. Built for Pakistani students and graduates.
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
              <Image src="/chrome-shiny-wordmark.png" alt="Applytics" width={100} height={32} className="object-contain" />
            </div>
          </div>

          <SignIn
            fallbackRedirectUrl="/app/dashboard"
            appearance={{
              variables: {
                colorPrimary: '#de0d12',
                colorBackground: '#ffffff',
                colorText: '#1a1a1a',
                colorTextSecondary: '#787671',
                colorInputBackground: '#ffffff',
                colorInputText: '#1a1a1a',
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
