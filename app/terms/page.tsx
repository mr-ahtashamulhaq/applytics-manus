import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using Applytics during the early-access period.',
}

const updated = 'August 24, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold" style={{ color: 'var(--ink-deep)' }}>{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh]" style={{ background: 'var(--canvas)' }}>
      <div className="mx-auto max-w-[720px] px-6 py-20 md:py-24">
        <Link href="/" className="mb-10 inline-flex min-h-11 items-center text-sm font-medium" style={{ color: 'var(--steel)' }}>Back to home</Link>
        <header className="mb-12 border-b pb-8" style={{ borderColor: 'var(--hairline)' }}>
          <p className="text-label mb-3" style={{ color: 'var(--brand-red)' }}>Legal draft</p>
          <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Terms of Use</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--stone)' }}>Last updated: {updated}</p>
          <p className="mt-4 text-sm leading-6" style={{ color: 'var(--charcoal)' }}>This draft describes the current Applytics early-access service. A qualified lawyer must review it before publication.</p>
        </header>

        <div className="flex flex-col gap-8 text-base leading-7" style={{ color: 'var(--charcoal)' }}>
          <Section title="1. About these terms">
            <p>These Terms of Use govern your use of Applytics, an early-access service for job seekers in Pakistan. By using the service, you agree to these terms. If you do not agree, do not use the service.</p>
          </Section>

          <Section title="2. Early access">
            <p>Applytics is under active development. Features, source coverage, availability, and stored data behavior can change. The early-access service is provided without a promise of continuous availability.</p>
            <p>Applytics is free during early access. These terms do not create a promise about future pricing, quotas, support, or feature availability.</p>
          </Section>

          <Section title="3. Your account">
            <p>You are responsible for the information that you provide and for activity under your account. Keep your authentication details private. Tell us if you believe that someone used your account without permission.</p>
            <p>You must provide information that you have the right to use. Do not upload or paste confidential information that you are not authorized to process.</p>
          </Section>

          <Section title="4. Acceptable use">
            <p>You must not use Applytics to break the law, impersonate another person, access another user&apos;s data, probe or attack the service, bypass access controls, overload the service, or submit malicious content.</p>
            <p>You must not use automated access against job boards or the Applytics application unless the applicable terms and documentation allow it. Job-source access is controlled by the private scraper and its source-specific rules.</p>
          </Section>

          <Section title="5. Job listings">
            <p>Applytics displays job listings collected from external source boards. Listing details can be incomplete, stale, removed, or inaccurate. Applytics does not employ the listed companies and does not guarantee that a role is open.</p>
            <p>Open the source listing before you apply. You are responsible for checking the employer, role, location, deadline, and application instructions.</p>
          </Section>

          <Section title="6. AI resumes and PDFs">
            <p>Applytics uses an AI provider to rewrite profile content for a selected job. The service uses validation checks, but AI output can still be wrong, incomplete, or unsuitable.</p>
            <p>You must review every resume statement, number, date, skill, and employer before use. Applytics does not guarantee ATS results, an interview, an offer, or employment.</p>
            <p>A generated PDF is a convenience output. You are responsible for its final content, format, accuracy, and submission.</p>
          </Section>

          <Section title="7. Your content and feedback">
            <p>You retain your rights in the profile, job descriptions, notes, and other content that you provide. You give Applytics the limited permission needed to store, process, and display that content to provide the requested service.</p>
            <p>If you send a suggestion, you allow Applytics to use it to operate and improve the service without identifying you publicly unless you agree separately.</p>
          </Section>

          <Section title="8. Third-party services">
            <p>Applytics depends on services such as Clerk, Supabase, the configured AI provider, Vercel, GitHub Actions, and external job boards. Their availability and terms can affect Applytics. Their terms apply to the services that they provide.</p>
          </Section>

          <Section title="9. Suspension and termination">
            <p>We can suspend or end access when necessary to protect users, the service, a provider, or a source board, or when you breach these terms. You can stop using the service at any time.</p>
            <p>Deletion requests and data retention follow the <Link href="/privacy" className="underline underline-offset-4" style={{ color: 'var(--brand-red)' }}>Privacy Policy</Link>. The final deletion and export process requires legal and operational review.</p>
          </Section>

          <Section title="10. Disclaimers and liability">
            <p>To the extent permitted by law, Applytics is provided as available and without warranties that the service will be uninterrupted, accurate, secure, or fit for a particular purpose.</p>
            <p>To the extent permitted by law, Applytics is not responsible for losses caused by external job boards, AI output, user-provided content, missed deadlines, application decisions, or service interruptions. The final liability limits and governing law require qualified legal review.</p>
          </Section>

          <Section title="11. Changes to these terms">
            <p>We can update these terms when the service changes. We will update the date on this page. Significant changes need a clear notice before they apply where the law requires one.</p>
          </Section>

          <Section title="12. Contact">
            <p>Send questions about these terms to <a href="mailto:hello@applytics.pk" className="underline underline-offset-4" style={{ color: 'var(--brand-red)' }}>hello@applytics.pk</a>.</p>
          </Section>
        </div>
      </div>
    </main>
  )
}
