import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

export const metadata = {
  title: 'Create an Applytics account',
  description: 'Create a free early-access account to find listings, tailor resumes, and track applications.',
}

export default function SignUpPage() {
  return (
    <div
      className="min-h-dvh flex"
      style={{ background: 'var(--surface)' }}
    >
      {/* Left panel — branding */}
      <div
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

        {/* Value points */}
        <div>
          <h2
            className="text-h2 mb-5"
            style={{ color: 'var(--on-dark)', letterSpacing: '-0.5px' }}
          >
            Start with a clearer job search.
          </h2>
          <ul className="flex flex-col gap-3">
            {[
              'Browse the current verified job catalog',
              'Compare listings with your profile',
              'Review a job-specific resume draft',
              'Track applications and follow-ups',
            ].map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0"
                  style={{ background: 'var(--brand-red)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm" style={{ color: 'var(--on-dark-muted)' }}>
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

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

          <SignUp
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
