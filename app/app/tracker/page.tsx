import { loadApplications } from '@/lib/actions/tracker'
import TrackerTable from '@/components/tracker/TrackerTable'

export const metadata = {
  title: 'Applytics',
  description: 'Track every job application - status, dates, and notes in one place.',
}

interface Props {
  searchParams: Promise<{ from?: string; title?: string; company?: string }>
}

export default async function TrackerPage({ searchParams }: Props) {
  const params = await searchParams
  const applications = await loadApplications()

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-label mb-1">Applications</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Tracker</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--steel)', maxWidth: '52ch' }}>
          Every application you send, tracked in one place. Update status as you progress.
        </p>
      </div>

      <TrackerTable
        initialApplications={applications}
        defaultCompany={params.company}
        defaultRole={params.title}
      />
    </div>
  )
}
