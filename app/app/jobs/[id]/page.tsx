import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowSquareOut, Briefcase, MapPin } from '@phosphor-icons/react/dist/ssr'
import { loadJob } from '@/lib/actions/jobs'
import { loadSavedJobMap } from '@/lib/actions/savedJobs'
import SaveJobButton from '@/components/jobs/SaveJobButton'
import type { JobSourceBoard } from '@/lib/types/database'

export const metadata = {
  title: 'Job details | Applytics',
  description: 'Review a verified job listing before tailoring your resume.',
}

const sourceLabels: Record<JobSourceBoard, string> = {
  linkedin: 'LinkedIn',
  indeed: 'Indeed',
  rozee: 'Rozee',
  mustakbil: 'Mustakbil',
}

function formatDate(value: string | null) {
  if (!value) return 'Date not provided'
  return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium' }).format(new Date(value))
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await loadJob(id)
  if (!job) notFound()
  const savedState = await loadSavedJobMap()

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link href="/app/jobs" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium" style={{ color: 'var(--slate)' }}>
        <ArrowLeft size={17} aria-hidden="true" />
        Back to jobs
      </Link>

      <header className="border-b pb-7" style={{ borderColor: 'var(--hairline)' }}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-label" style={{ color: 'var(--steel)' }}>
          <span>{sourceLabels[job.source_board]}</span>
          <span aria-hidden="true">·</span>
          <span>{job.status === 'stale' ? 'Older listing' : 'Recently checked'}</span>
        </div>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>{job.title}</h1>
        <p className="mt-2 text-base font-medium" style={{ color: 'var(--charcoal)' }}>{job.company}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ color: 'var(--slate)' }}>
          <span className="inline-flex items-center gap-1.5"><MapPin size={17} aria-hidden="true" />{job.location || 'Location not provided'}</span>
          <span className="inline-flex items-center gap-1.5"><Briefcase size={17} aria-hidden="true" />{job.employment_type}</span>
          {job.salary_text && <span>{job.salary_text}</span>}
          <span>Checked {formatDate(job.last_checked_at)}</span>
        </div>
      </header>

      <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_240px]">
        <main>
          <section>
            <h2 className="text-h3" style={{ color: 'var(--ink-deep)' }}>Job description</h2>
            {job.description ? (
              <div className="mt-4 whitespace-pre-wrap text-sm leading-7" style={{ color: 'var(--charcoal)' }}>{job.description}</div>
            ) : (
              <p className="mt-4 text-sm" style={{ color: 'var(--steel)' }}>This listing does not include a full description.</p>
            )}
          </section>
          {job.skills_required.length > 0 && (
            <section className="mt-8 border-t pt-6" style={{ borderColor: 'var(--hairline)' }}>
              <h2 className="text-h3" style={{ color: 'var(--ink-deep)' }}>Skills mentioned</h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2" aria-label="Skills mentioned in this job">
                {job.skills_required.map((skill) => <li key={skill} className="border px-3 py-2 text-sm" style={{ borderColor: 'var(--hairline)', color: 'var(--charcoal)', background: 'var(--surface)' }}>{skill}</li>)}
              </ul>
            </section>
          )}
        </main>

        <aside className="h-fit border p-4" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)', borderRadius: 'var(--radius-lg)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--ink-deep)' }}>Next step</h2>
          <p className="mt-2 text-sm leading-6" style={{ color: 'var(--steel)' }}>
            Use this verified listing as the source context for a job-specific resume.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <SaveJobButton jobId={job.id} savedId={savedState.saved[job.id]} />
            <Link href={`/app/generate?jobId=${encodeURIComponent(job.id)}`} className="inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold" style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}>Tailor resume</Link>
            <Link href={`/app/tracker?jobId=${encodeURIComponent(job.id)}&title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`} className="inline-flex min-h-11 items-center justify-center border px-3 text-sm font-medium" style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}>Track application</Link>
            <a href={job.source_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1.5 text-sm font-medium" style={{ color: 'var(--slate)' }}>Open source <ArrowSquareOut size={15} aria-hidden="true" /></a>
          </div>
        </aside>
      </div>
    </div>
  )
}
