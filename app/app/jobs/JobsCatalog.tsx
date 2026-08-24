'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useTransition } from 'react'
import { ArrowSquareOut, CaretLeft, CaretRight, Funnel, MapPin, MagnifyingGlass } from '@phosphor-icons/react'
import type { Job, JobSourceBoard } from '@/lib/types/database'
import type { JobCatalogResult } from '@/lib/actions/jobs'

interface JobsCatalogProps {
  result: JobCatalogResult
  filters: {
    q?: string
    location?: string
    source_board?: JobSourceBoard
    employment_type?: string
    page: number
    page_size: number
  }
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

function formatExperience(job: Job) {
  if (job.experience_required) return job.experience_required
  if (job.experience_min_years !== null && job.experience_max_years !== null) {
    return `${job.experience_min_years}–${job.experience_max_years} years`
  }
  if (job.experience_min_years !== null) return `${job.experience_min_years}+ years`
  return null
}

function JobCard({ job }: { job: Job }) {
  const experience = formatExperience(job)
  const visibleSkills = job.skills_required.slice(0, 4)

  return (
    <article className="border-b py-5 first:border-t" style={{ borderColor: 'var(--hairline)' }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-label" style={{ color: 'var(--steel)' }}>
            <span>{sourceLabels[job.source_board]}</span>
            <span aria-hidden="true">·</span>
            <span>{job.status === 'stale' ? 'Older listing' : 'Recently checked'}</span>
          </div>
          <h2 className="text-h3 truncate" style={{ color: 'var(--ink-deep)' }}>
            <Link href={`/app/jobs/${encodeURIComponent(job.id)}`} className="hover:underline underline-offset-4">{job.title}</Link>
          </h2>
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
            {job.company}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm" style={{ color: 'var(--slate)' }}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} aria-hidden="true" />
              {job.location || 'Location not provided'}
            </span>
            {job.employment_type !== 'other' && <span>{job.employment_type}</span>}
            {job.salary_text && <span>{job.salary_text}</span>}
            {experience && <span>{experience}</span>}
          </div>
          {visibleSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Required skills">
              {visibleSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs"
                  style={{ color: 'var(--charcoal)', background: 'var(--surface)', borderRadius: 'var(--radius-xs)' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-row gap-2 md:flex-col md:items-stretch">
          <Link
            href={`/app/generate?jobId=${encodeURIComponent(job.id)}`}
            className="inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold transition-colors"
            style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}
          >
            Tailor resume
          </Link>
          <a
            href={job.source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 border px-3 text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}
          >
            View source
            <ArrowSquareOut size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className="mt-3 text-xs" style={{ color: 'var(--stone)' }}>
        Last checked {formatDate(job.last_checked_at)}
      </p>
    </article>
  )
}

function buildHref(filters: JobsCatalogProps['filters'], page: number) {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.location) params.set('location', filters.location)
  if (filters.source_board) params.set('source_board', filters.source_board)
  if (filters.employment_type) params.set('employment_type', filters.employment_type)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/app/jobs?${query}` : '/app/jobs'
}

export default function JobsCatalog({ result, filters }: JobsCatalogProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const totalPages = Math.max(1, Math.ceil(result.total / result.page_size))

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const params = new URLSearchParams()
    for (const [key, value] of formData.entries()) {
      const cleanValue = String(value).trim()
      if (cleanValue) params.set(key, cleanValue)
    }
    const query = params.toString()
    startTransition(() => router.push(query ? `/app/jobs?${query}` : '/app/jobs'))
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-7">
        <p className="text-label mb-1">Job catalog</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Find your next role</h1>
            <p className="mt-2 max-w-2xl text-sm" style={{ color: 'var(--steel)' }}>
              Browse listings checked by Applytics and tailor a resume for the role you choose.
            </p>
          </div>
          <span className="text-xs" style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }}>
            {result.total} active {result.total === 1 ? 'listing' : 'listings'}
          </span>
        </div>
      </header>

      <div
        className="mb-6 flex gap-3 border px-4 py-3 text-sm"
        style={{ borderColor: 'rgba(222,13,18,0.2)', background: 'var(--brand-red-subtle)', color: 'var(--brand-red-deep)' }}
        role="status"
      >
        <Funnel size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          Mustakbil is the first verified live source. Other boards are being checked before they are added to the automatic feed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-7 border p-4" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)', borderRadius: 'var(--radius-lg)' }}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
            Search title
            <span className="relative">
              <MagnifyingGlass size={18} className="pointer-events-none absolute left-3 top-3" style={{ color: 'var(--steel)' }} aria-hidden="true" />
              <input
                name="q"
                defaultValue={filters.q}
                placeholder="Software engineer"
                className="min-h-11 w-full border bg-transparent pl-10 pr-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--hairline-strong)', borderRadius: 'var(--radius-sm)', color: 'var(--ink)' }}
              />
            </span>
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
            Location
            <input
              name="location"
              defaultValue={filters.location}
              placeholder="Lahore or remote"
              className="min-h-11 w-full border bg-transparent px-3 text-sm outline-none focus:ring-2"
              style={{ borderColor: 'var(--hairline-strong)', borderRadius: 'var(--radius-sm)', color: 'var(--ink)' }}
            />
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
            Source
            <select name="source_board" defaultValue={filters.source_board ?? ''} className="min-h-11 w-full border bg-transparent px-3 text-sm outline-none focus:ring-2" style={{ borderColor: 'var(--hairline-strong)', borderRadius: 'var(--radius-sm)', color: 'var(--ink)' }}>
              <option value="">All sources</option>
              {Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
            Type
            <select name="employment_type" defaultValue={filters.employment_type ?? ''} className="min-h-11 w-full border bg-transparent px-3 text-sm outline-none focus:ring-2" style={{ borderColor: 'var(--hairline-strong)', borderRadius: 'var(--radius-sm)', color: 'var(--ink)' }}>
              <option value="">Any type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </label>
          <button type="submit" disabled={isPending} className="min-h-11 px-4 text-sm font-semibold transition-opacity disabled:cursor-wait disabled:opacity-60" style={{ background: 'var(--brand-black)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}>
            {isPending ? 'Loading' : 'Apply filters'}
          </button>
        </div>
        <div className="mt-3 flex justify-end">
          <Link href="/app/jobs" className="text-xs font-medium underline underline-offset-4" style={{ color: 'var(--slate)' }}>Clear filters</Link>
        </div>
      </form>

      {result.error && (
        <div className="border px-4 py-3 text-sm" style={{ borderColor: 'rgba(222,13,18,0.25)', color: 'var(--brand-red-deep)', background: 'var(--brand-red-subtle)' }} role="alert">
          {result.error}
        </div>
      )}

      {!result.error && result.jobs.length === 0 && (
        <div className="border px-6 py-14 text-center" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)', borderRadius: 'var(--radius-lg)' }}>
          <h2 className="text-h3" style={{ color: 'var(--ink-deep)' }}>No matching roles yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: 'var(--steel)' }}>
            Try a broader title or location. New listings appear after the next verified source run.
          </p>
        </div>
      )}

      {!result.error && result.jobs.length > 0 && (
        <>
          <section aria-label="Job listings">
            {result.jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </section>
          <nav className="mt-6 flex items-center justify-between" aria-label="Job pages">
            <span className="text-xs" style={{ color: 'var(--stone)', fontFamily: 'var(--font-mono)' }}>Page {filters.page} of {totalPages}</span>
            <div className="flex gap-2">
              {filters.page > 1 ? (
                <Link href={buildHref(filters, filters.page - 1)} className="inline-flex min-h-11 items-center gap-1 border px-3 text-sm font-medium" style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}><CaretLeft size={16} aria-hidden="true" />Previous</Link>
              ) : <span className="inline-flex min-h-11 items-center gap-1 border px-3 text-sm" style={{ borderColor: 'var(--hairline)', color: 'var(--muted)', borderRadius: 'var(--radius-md)' }} aria-hidden="true"><CaretLeft size={16} />Previous</span>}
              {filters.page < totalPages ? (
                <Link href={buildHref(filters, filters.page + 1)} className="inline-flex min-h-11 items-center gap-1 border px-3 text-sm font-medium" style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}>Next<CaretRight size={16} aria-hidden="true" /></Link>
              ) : <span className="inline-flex min-h-11 items-center gap-1 border px-3 text-sm" style={{ borderColor: 'var(--hairline)', color: 'var(--muted)', borderRadius: 'var(--radius-md)' }} aria-hidden="true">Next<CaretRight size={16} /></span>}
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
