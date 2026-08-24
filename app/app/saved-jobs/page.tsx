import Link from 'next/link'
import { ArrowSquareOut, MapPin } from '@phosphor-icons/react/dist/ssr'
import SaveJobButton from '@/components/jobs/SaveJobButton'
import { loadSavedJobs } from '@/lib/actions/savedJobs'
import type { JobSourceBoard } from '@/lib/types/database'

export const metadata = {
  title: 'Saved jobs | Applytics',
  description: 'Keep a short list of job listings you want to review or apply to.',
}

const sourceLabels: Record<JobSourceBoard, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  rozee: 'Rozee',
  mustakbil: 'Mustakbil',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium' }).format(new Date(value))
}

export default async function SavedJobsPage() {
  const result = await loadSavedJobs()

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-7">
        <p className="text-label mb-1">Saved jobs</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Roles you want to revisit</h1>
        <p className="mt-2 max-w-2xl text-sm" style={{ color: 'var(--steel)' }}>Save a listing from the catalog, then return here when you are ready to tailor a resume or track the application.</p>
      </header>

      {result.error && <div className="border px-4 py-3 text-sm" style={{ borderColor: 'rgba(222,13,18,0.25)', color: 'var(--brand-red-deep)', background: 'var(--brand-red-subtle)' }} role="alert">{result.error}</div>}

      {!result.error && result.savedJobs.length === 0 && (
        <div className="border px-6 py-14 text-center" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)', borderRadius: 'var(--radius-lg)' }}>
          <h2 className="text-h3" style={{ color: 'var(--ink-deep)' }}>Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: 'var(--steel)' }}>Save roles from the catalog to keep their current source link and listing context together.</p>
          <Link href="/app/jobs" className="mt-5 inline-flex min-h-11 items-center justify-center px-4 text-sm font-semibold" style={{ background: 'var(--brand-black)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}>Browse jobs</Link>
        </div>
      )}

      {!result.error && result.savedJobs.length > 0 && (
        <section aria-label="Saved jobs">
          {result.savedJobs.map(({ id, job, created_at }) => (
            <article key={id} className="border-b py-5 first:border-t" style={{ borderColor: 'var(--hairline)' }}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-label" style={{ color: 'var(--steel)' }}>
                    <span>{sourceLabels[job.source_board]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.status === 'stale' ? 'Older listing' : 'Recently checked'}</span>
                  </div>
                  <h2 className="text-h3 truncate" style={{ color: 'var(--ink-deep)' }}><Link href={`/app/jobs/${encodeURIComponent(job.id)}`} className="underline-offset-4 hover:underline">{job.title}</Link></h2>
                  <p className="mt-1 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{job.company}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--slate)' }}><MapPin size={16} aria-hidden="true" />{job.location || 'Location not provided'}</p>
                  <p className="mt-3 text-xs" style={{ color: 'var(--stone)' }}>Saved {formatDate(created_at)}</p>
                </div>
                <div className="flex shrink-0 flex-row flex-wrap gap-2 md:flex-col md:items-stretch">
                  <SaveJobButton jobId={job.id} savedId={id} variant="compact" />
                  <Link href={`/app/generate?jobId=${encodeURIComponent(job.id)}`} className="inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold" style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}>Tailor resume</Link>
                  <a href={job.source_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1.5 border px-3 text-sm font-medium" style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}>View source <ArrowSquareOut size={15} aria-hidden="true" /></a>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
