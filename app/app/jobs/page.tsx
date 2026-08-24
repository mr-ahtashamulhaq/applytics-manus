import { loadJobs } from '@/lib/actions/jobs'
import JobsCatalog from './JobsCatalog'
import { loadSavedJobMap } from '@/lib/actions/savedJobs'

export const metadata = {
  title: 'Jobs | Applytics',
  description: 'Browse verified job listings and find roles that fit your profile.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const pageValue = Number(firstValue(params.page) ?? '1')
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
  const sourceBoard = firstValue(params.source_board)
  const employmentType = firstValue(params.employment_type)

  const filters = {
    q: firstValue(params.q) || undefined,
    location: firstValue(params.location) || undefined,
    source_board: ['linkedin', 'indeed', 'rozee', 'mustakbil'].includes(sourceBoard ?? '')
      ? (sourceBoard as 'linkedin' | 'indeed' | 'rozee' | 'mustakbil')
      : undefined,
    employment_type: employmentType || undefined,
    page,
    page_size: 20,
  }

  const [result, savedState] = await Promise.all([loadJobs(filters), loadSavedJobMap()])

  return <JobsCatalog result={result} filters={filters} saved={savedState.saved} />
}
