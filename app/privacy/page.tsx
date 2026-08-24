import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Applytics collects, uses, stores, and protects information during early access.',
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

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh]" style={{ background: 'var(--canvas)' }}>
      <div className="mx-auto max-w-[720px] px-6 py-20 md:py-24">
        <Link href="/" className="mb-10 inline-flex min-h-11 items-center text-sm font-medium" style={{ color: 'var(--steel)' }}>Back to home</Link>
        <header className="mb-12 border-b pb-8" style={{ borderColor: 'var(--hairline)' }}>
          <p className="text-label mb-3" style={{ color: 'var(--brand-red)' }}>Legal draft</p>
          <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Privacy Policy</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--stone)' }}>Last updated: {updated}</p>
          <p className="mt-4 text-sm leading-6" style={{ color: 'var(--charcoal)' }}>This draft describes the current Applytics early-access service. A qualified lawyer must review it before publication.</p>
        </header>

        <div className="flex flex-col gap-8 text-base leading-7" style={{ color: 'var(--charcoal)' }}>
          <Section title="1. Who operates Applytics">
            <p>Applytics is an early-access service for job seekers in Pakistan. For privacy questions or data requests, contact <a href="mailto:hello@applytics.pk" className="underline underline-offset-4" style={{ color: 'var(--brand-red)' }}>hello@applytics.pk</a>.</p>
          </Section>

          <Section title="2. Information you provide">
            <p>When you use Applytics, you can provide your name, email address, phone number, city, education, skills, LinkedIn URL, portfolio URL, work experience, projects, job descriptions, saved jobs, generated resumes, and application tracker entries.</p>
            <p>You can also send a product suggestion. A suggestion can include your name, email address, and message.</p>
          </Section>

          <Section title="3. Information created by the service">
            <p>Applytics creates job input records, resume result records, resume metadata, saved-job records, application records, and limited operational records for job ingestion.</p>
            <p>Applytics also records minimal internal usage events for recommendation views, saved-job changes, resume-generation starts, and PDF downloads. These events support reliability and capacity review. They do not include prompts, resume text, source-page content, or IP addresses.</p>
            <p>The job catalog contains listing information collected from source boards. It is separate from your private profile and workflow records.</p>
          </Section>

          <Section title="4. How we use information">
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide account access and protect your account.</li>
              <li>Store your profile and application workflow.</li>
              <li>Compare your profile with catalog job data for explainable recommendations.</li>
              <li>Send the profile and selected job context to the configured AI provider to generate a tailored resume.</li>
              <li>Create a resume preview and PDF when you request one.</li>
              <li>Maintain, secure, debug, and improve the service.</li>
              <li>Review minimal internal usage events for reliability and capacity.</li>
              <li>Respond to support, privacy, and deletion requests.</li>
            </ul>
            <p>Applytics does not sell your personal information. Applytics does not use your profile to publish a public resume.</p>
          </Section>

          <Section title="5. AI processing">
            <p>When you request resume tailoring, Applytics sends the profile and selected job context to the configured Groq-compatible AI provider. The provider processes that request to return structured resume content.</p>
            <p>AI output can contain errors. Review every statement before you send a resume to an employer. Do not submit information that you do not want processed for this purpose.</p>
          </Section>

          <Section title="6. Service providers">
            <p>Applytics uses Clerk for authentication, Supabase for database and storage services, a Groq-compatible provider for AI inference, and Vercel for application hosting. The private scraper uses GitHub Actions and Supabase for scheduled job ingestion.</p>
            <p>These providers process information under their own terms and privacy policies. The final provider list, processing locations, and contractual details require legal review before launch.</p>
          </Section>

          <Section title="7. Retention and deletion">
            <p>Applytics keeps account and workflow information while it is needed to provide the service or while your account remains active. Retention periods for backups and operational logs require a final documented policy.</p>
            <p>Signed-in users can download a JSON export from the Account privacy page. The export includes the account, profile, job inputs, generated resumes, saved jobs, and tracker entries that Applytics can read for that account.</p>
            <p>Signed-in users can also delete their account from the same page. The service removes the local account records and known generated files before it requests deletion from the authentication provider. A failed provider cleanup needs support follow-up.</p>
          </Section>

          <Section title="8. Security">
            <p>Applytics keeps service keys on the server or in private worker secrets. Server actions authenticate requests, check ownership, validate input, and return bounded errors. Supabase Row Level Security protects the database API roles.</p>
            <p>No internet service can guarantee complete security. Report suspected security issues through the contact address above.</p>
          </Section>

          <Section title="9. Your choices and rights">
            <p>Depending on applicable law, you can request access to, correction of, export of, or deletion of your personal information. The self-serve Account privacy page provides export and deletion controls for signed-in users. You can stop using the service at any time. A legal review must confirm the final rights process and response times for each user location.</p>
          </Section>

          <Section title="10. Children">
            <p>Applytics is intended for adults and older students who can use the service lawfully. Do not use the service to create an account for a child without the permissions required by applicable law.</p>
          </Section>

          <Section title="11. Changes">
            <p>We can update this policy when the service or its data practices change. We will update the date on this page. Significant changes need a clear notice before they apply to continued use where the law requires one.</p>
          </Section>

          <Section title="12. Contact">
            <p>Send privacy questions and data requests to <a href="mailto:hello@applytics.pk" className="underline underline-offset-4" style={{ color: 'var(--brand-red)' }}>hello@applytics.pk</a>.</p>
            <p><Link href="/terms" className="underline underline-offset-4" style={{ color: 'var(--brand-red)' }}>Read the Terms of Use</Link>.</p>
          </Section>
        </div>
      </div>
    </main>
  )
}
