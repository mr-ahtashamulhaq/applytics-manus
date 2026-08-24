import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] items-center justify-center px-6 py-20" style={{ background: 'var(--canvas)' }}>
      <div className="w-full max-w-xl border p-8 md:p-12" style={{ borderColor: 'var(--hairline)', background: 'var(--surface-soft)', borderRadius: 'var(--radius-lg)' }}>
        <p className="text-label mb-3" style={{ color: 'var(--brand-red)' }}>404</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>This page is not here</h1>
        <p className="mt-3 max-w-md text-base leading-7" style={{ color: 'var(--charcoal)' }}>The link may be old, or the page may have moved. Return to Applytics and continue your job search.</p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center gap-2 px-4 text-sm font-semibold" style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}><ArrowLeft size={17} aria-hidden="true" />Back to Applytics</Link>
      </div>
    </main>
  )
}
