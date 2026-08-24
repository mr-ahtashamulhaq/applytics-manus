'use client'

import Link from 'next/link'

export default function TrackerError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="w-full max-w-4xl rounded-lg p-8" style={{ border: '1px solid var(--hairline)', background: 'var(--surface)' }} role="alert">
      <h1 className="text-h3" style={{ color: 'var(--ink-deep)' }}>The tracker could not load.</h1>
      <p className="mt-2 max-w-[52ch] text-sm leading-6" style={{ color: 'var(--charcoal)' }}>Your applications were not changed. Try again, or return to the dashboard.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="min-h-11 px-4 text-sm font-semibold" style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}>Try again</button>
        <Link href="/app/dashboard" className="inline-flex min-h-11 items-center px-4 text-sm font-semibold" style={{ border: '1px solid var(--hairline-strong)', color: 'var(--ink)', borderRadius: 'var(--radius-md)' }}>Back to dashboard</Link>
      </div>
    </section>
  )
}
