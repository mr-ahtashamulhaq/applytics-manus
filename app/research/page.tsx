import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Research notes',
  description: 'Research notes and validation status for Applytics.',
}

export default function ResearchPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col" style={{ background: 'var(--canvas)' }}>
      <Navbar />
      <section className="flex-1 px-6 py-32 md:py-40">
        <div className="mx-auto max-w-[760px]">
          <p className="text-label mb-4" style={{ color: 'var(--brand-red)' }}>Research notes</p>
          <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>We are validating the problem before publishing numbers.</h1>
          <div className="mt-6 flex max-w-[640px] flex-col gap-4 text-base leading-7" style={{ color: 'var(--charcoal)' }}>
            <p>Applytics has early research material about job discovery, resume tailoring, and application tracking for people in Pakistan.</p>
            <p>The current material contains figures that need source review and consistent methodology. We do not publish those figures as facts while that work is incomplete.</p>
            <p>For now, the product scope is based on observable workflow needs: compare current listings, tailor supported profile content, and keep application follow-ups visible.</p>
          </div>
          <Link href="/#pricing" className="mt-8 inline-flex min-h-11 items-center px-4 text-sm font-semibold" style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}>See early access</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
