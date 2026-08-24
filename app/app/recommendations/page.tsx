import Link from 'next/link'
import { ArrowSquareOut, MapPin, Sparkle } from '@phosphor-icons/react/dist/ssr'
import { loadRecommendations } from '@/lib/actions/recommendations'
import type { JobRecommendation } from '@/lib/actions/recommendations'
import type { JobSourceBoard } from '@/lib/types/database'

export const metadata = {
  title: 'Recommendations | Applytics',
  description: 'See job listings that match the skills and location in your Applytics profile.',
}

const sourceLabels: Record<JobSourceBoard, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  rozee: 'Rozee',
  mustakbil: 'Mustakbil',
}

function RecommendationCard({ recommendation }: { recommendation: JobRecommendation }) {
  const { job, matchedSkills, reasons } = recommendation
  return (
    <article className="border-b py-5 first:border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-label" style={{ color: 'var(--steel)' }}>
            <span>{sourceLabels[job.source_board]}</span>
            <span aria-hidden="true">·</span>
            <span>{matchedSkills.length > 0 ? `${matchedSkills.length} skill ${matchedSkills.length === 1 ? 'match' : 'matches'}` : 'Profile review needed'}</span>
          </div>
          <h2 className="text-h3 truncate" style={{ color: 'var(--ink-deep)' }}>
            <Link href={`/app/jobs/${encodeURIComponent(job.id)}`} className="underline-offset-4 hover:underline">{job.title}</Link>
          </h2>
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{job.company}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--slate)' }}><MapPin size={16} aria-hidden="true" />{job.location || 'Location not provided'}</p>
          <ul className="mt-3 space-y-1 text-sm" style={{ color: 'var(--slate)' }} aria-label="Recommendation reasons">
            {reasons.map((reason) => <li key={reason} className="flex gap-2"><span aria-hidden="true" style={{ color: 'var(--brand-red)' }}>+</span>{reason}</li>)}
          </ul>
        </div>
        <div className="flex shrink-0 flex-row gap-2 md:flex-col md:items-stretch">
          <Link href={`/app/generate?jobId=${encodeURIComponent(job.id)}`} className="inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold" style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}>Tailor resume</Link>
          <a href={job.source_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1.5 border px-3 text-sm font-medium" style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}>View source <ArrowSquareOut size={15} aria-hidden="true" /></a>
        </div>
      </div>
    </article>
  )
}

export default async function RecommendationsPage() {
  const result = await loadRecommendations()

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-7">
        <p className="text-label mb-1">Recommendations</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Roles worth a closer look</h1>
        <p className="mt-2 max-w-2xl text-sm" style={{ color: 'var(--steel)' }}>
          These suggestions use the skills and city in your profile. Each reason is shown so you can decide whether the role fits.
        </p>
      </header>

      {result.profileMissing && (
        <div className="mb-6 flex items-start gap-3 border px-4 py-3 text-sm" style={{ borderColor: 'rgba(222,13,18,0.2)', background: 'var(--brand-red-subtle)', color: 'var(--brand-red-deep)' }} role="status">
          <Sparkle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p><Link href="/app/profile" className="font-semibold underline underline-offset-4">Add skills or your city</Link> to make these suggestions more useful.</p>
        </div>
      )}

      {result.error && <div className="border px-4 py-3 text-sm" style={{ borderColor: 'rgba(222,13,18,0.25)', color: 'var(--brand-red-deep)', background: 'var(--brand-red-subtle)' }} role="alert">{result.error}</div>}

      {!result.error && result.recommendations.length === 0 && (
        <div className="border px-6 py-14 text-center" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)', borderRadius: 'var(--radius-lg)' }}>
          <h2 className="text-h3" style={{ color: 'var(--ink-deep)' }}>No recommendation signals yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: 'var(--steel)' }}>Browse the catalog or add more profile details. Applytics will not invent a match when the data is missing.</p>
          <Link href="/app/jobs" className="mt-5 inline-flex min-h-11 items-center justify-center px-4 text-sm font-semibold" style={{ background: 'var(--brand-black)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}>Browse jobs</Link>
        </div>
      )}

      {!result.error && result.recommendations.length > 0 && (
        <section aria-label="Recommended jobs">
          {result.recommendations.map((recommendation) => <RecommendationCard key={recommendation.job.id} recommendation={recommendation} />)}
        </section>
      )}
    </div>
  )
}
