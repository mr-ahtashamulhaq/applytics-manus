import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Applytics',
  description: 'How Applytics collects, stores, and uses your personal data.',
}

export default function PrivacyPage() {
  const updated = 'May 26, 2025'

  return (
    <main className="min-h-[100dvh]" style={{ background: 'var(--canvas)' }}>
      <div className="max-w-[720px] mx-auto px-6 py-24">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: 'var(--steel)' }}
        >
          &larr; Back to home
        </Link>

        {/* Header */}
        <div className="mb-12" style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: '32px' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
            Legal
          </p>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--ink-deep)', letterSpacing: '-0.75px' }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: 'var(--stone)' }}>Last updated: {updated}</p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8" style={{ color: 'var(--charcoal)', lineHeight: 1.7 }}>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>1. Who we are</h2>
            <p>Applytics (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a resume tailoring platform built for Pakistani students and fresh graduates. Our service is operated from Lahore, Pakistan. Contact: <a href="mailto:hello@applytics.pk" style={{ color: 'var(--brand-red)' }}>hello@applytics.pk</a></p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>2. Data we collect</h2>
            <p className="mb-3">When you create an account and use Applytics, we collect:</p>
            <ul className="flex flex-col gap-2" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
              <li><strong>Account information:</strong> Your name and email address, provided via Clerk (our authentication provider).</li>
              <li><strong>Profile information:</strong> Work experience, education, skills, and contact details you enter in your profile.</li>
              <li><strong>Usage data:</strong> Job descriptions you paste, resumes generated, match scores, and application tracker entries.</li>
              <li><strong>Suggestions:</strong> Optional feedback you submit through the suggestion form (name, email, and text).</li>
              <li><strong>Technical data:</strong> Browser type, device, and anonymized usage analytics for improving the service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>3. How we use your data</h2>
            <ul className="flex flex-col gap-2" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
              <li>To provide and improve the Applytics service.</li>
              <li>To generate tailored resumes using AI models (Groq).</li>
              <li>To store your application history and profile for your personal use.</li>
              <li>To communicate service updates if you have opted in.</li>
              <li>We do <strong>not</strong> sell your personal data to any third party.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>4. Third-party services</h2>
            <p className="mb-3">Applytics uses the following third-party services:</p>
            <ul className="flex flex-col gap-2" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
              <li><strong>Clerk</strong> - authentication and identity management.</li>
              <li><strong>Supabase</strong> - data storage (hosted on AWS EU region).</li>
              <li><strong>Groq</strong> - AI inference for resume tailoring.</li>
              <li><strong>Vercel</strong> - hosting and deployment infrastructure.</li>
            </ul>
            <p className="mt-3">Each of these services has its own privacy policy governing their use of your data.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>5. Data retention</h2>
            <p>We retain your data for as long as your account is active. You may request deletion of your account and all associated data at any time by emailing <a href="mailto:hello@applytics.pk" style={{ color: 'var(--brand-red)' }}>hello@applytics.pk</a>. Deletion will be completed within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>6. Security</h2>
            <p>We use industry-standard security measures including HTTPS, encrypted storage, and access controls. No method of transmission over the internet is completely secure; we cannot guarantee absolute security but take commercially reasonable steps to protect your data.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>7. Children&apos;s privacy</h2>
            <p>Applytics is intended for users aged 16 and above. We do not knowingly collect data from children under 16. If you believe a child has provided data to us, contact us for immediate removal.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>8. Your rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. Contact us at <a href="mailto:hello@applytics.pk" style={{ color: 'var(--brand-red)' }}>hello@applytics.pk</a> to exercise any of these rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>9. Changes to this policy</h2>
            <p>We may update this policy periodically. We will notify active users of significant changes via email or an in-app notice. Continued use of Applytics after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>10. Contact</h2>
            <p>Questions about this policy: <a href="mailto:hello@applytics.pk" style={{ color: 'var(--brand-red)' }}>hello@applytics.pk</a></p>
          </section>

        </div>
      </div>
    </main>
  )
}
