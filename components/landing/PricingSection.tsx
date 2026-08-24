import Link from 'next/link'
import { CheckCircle } from '@phosphor-icons/react/dist/ssr'

const EARLY_ACCESS_FEATURES = [
  'Browse the current verified job catalog',
  'See profile-based recommendation signals',
  'Save listings and revisit them later',
  'Tailor a resume to a selected job',
  'Track applications, deadlines, and follow-ups',
]

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full" style={{ background: 'var(--canvas)', padding: 'clamp(64px, 8vw, 120px) 0' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-12 flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}>Early access</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <h2 className="text-4xl font-bold lg:text-5xl" style={{ color: 'var(--ink-deep)', letterSpacing: '-1.5px', lineHeight: 1.1 }}>Free while we build with early users</h2>
            <p className="mt-4 max-w-[520px] text-lg" style={{ color: 'var(--slate)' }}>Use the current Applytics workflow at no cost. Tell us what helps, what is missing, and what needs to work better.</p>
          </div>

          <div className="border p-7" style={{ borderColor: 'var(--brand-black)', background: 'var(--brand-black)' }}>
            <p className="text-label" style={{ color: 'var(--on-dark-muted)' }}>Current access</p>
            <h3 className="mt-3 text-2xl font-bold" style={{ color: 'var(--on-dark)' }}>Applytics early access</h3>
            <p className="mt-2 text-sm leading-6" style={{ color: 'var(--on-dark-muted)' }}>The available workflow can change as we verify sources and improve the product.</p>
            <ul className="mt-6 flex flex-col gap-3">
              {EARLY_ACCESS_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--on-dark)' }}>
                  <CheckCircle size={16} weight="fill" style={{ color: 'var(--brand-red)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="mt-7 flex h-12 items-center justify-center px-6 text-sm font-semibold uppercase tracking-wider" style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 0, letterSpacing: '1px' }}>Start free</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
