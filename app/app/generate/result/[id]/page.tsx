import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { auth } from '@clerk/nextjs/server'
import type { AIResult } from '@/lib/actions/generate'
import MatchScoreRing from '@/components/generate/MatchScoreRing'
import ResumePreview from '@/components/generate/ResumePreview'
import DownloadPDFButton from '@/components/generate/DownloadPDFButton'

export const metadata = {
  title: 'Applytics',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) notFound()

  // Get user
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .single()

  if (!user) notFound()

  // Get resume record — verify ownership
  const { data: resume } = await supabaseAdmin
    .from('generated_resumes')
    .select('*, job_inputs(job_title, company_name)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!resume) notFound()

  const ai = resume.ai_output as AIResult
  const jobTitle = (resume.job_inputs as { job_title: string; company_name: string } | null)?.job_title ?? 'Role'
  const companyName = (resume.job_inputs as { job_title: string; company_name: string } | null)?.company_name ?? 'Company'

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-label mb-1">Resume Generated</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>
          {jobTitle} - {companyName}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--steel)' }}>
          Generated {new Date(resume.created_at).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
        </p>
      </div>

      {/* Score + keywords row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Match score */}
        <div
          className="flex flex-col items-center justify-center py-6 rounded-lg"
          style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
        >
          <MatchScoreRing score={resume.match_score ?? 0} />
          <p className="mt-2 text-xs font-medium" style={{ color: 'var(--steel)' }}>Match Score</p>
        </div>

        {/* Suggested keywords */}
        <div
          className="md:col-span-2 rounded-lg p-5"
          style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink-deep)' }}>
            Keywords to Add
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(ai.suggested_keywords ?? []).map((kw) => (
              <span
                key={kw}
                className="text-xs px-2 py-1 font-medium"
                style={{
                  background: 'rgba(222,13,18,0.08)',
                  color: 'var(--brand-red)',
                  border: '1px solid rgba(222,13,18,0.2)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                {kw}
              </span>
            ))}
          </div>

          {(ai.missing_keywords ?? []).length > 0 && (
            <>
              <p className="text-sm font-semibold mt-4 mb-2" style={{ color: 'var(--ink-deep)' }}>
                Missing from Profile
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ai.missing_keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2 py-1"
                    style={{
                      background: 'var(--surface)',
                      color: 'var(--steel)',
                      border: '1px solid var(--hairline)',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Full resume preview */}
      <ResumePreview ai={ai} jobTitle={jobTitle} company={companyName} resumeId={id} />

      {/* Actions */}
      <div className="flex items-center gap-3 mt-5 flex-wrap">
        <Link
          href="/app/generate"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
          style={{
            border: '1px solid var(--hairline-strong)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--ink)',
          }}
        >
          Generate another
        </Link>
        <DownloadPDFButton
          resumeId={id}
          filename={`${jobTitle.replace(/\s+/g,'_')}_${companyName.replace(/\s+/g,'_')}.pdf`}
        />
        <Link
          href={`/app/tracker?from=${id}&title=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(companyName)}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
          style={{
            background: 'var(--brand-red)',
            color: 'var(--on-dark)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Save to Tracker
        </Link>
      </div>
    </div>
  )
}
