'use server'

import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Job, JobSourceBoard } from '@/lib/types/database'
import { z } from 'zod'

const jobFields = [
  'id',
  'source_job_id',
  'job_fingerprint',
  'title',
  'company',
  'location',
  'source_url',
  'source_board',
  'description',
  'skills_required',
  'experience_required',
  'experience_min_years',
  'experience_max_years',
  'education_required',
  'employment_type',
  'industry',
  'salary_text',
  'salary_currency',
  'salary_min',
  'salary_max',
  'salary_period',
  'posted_at',
  'first_seen_at',
  'last_seen_at',
  'last_checked_at',
  'parser_version',
  'enricher_version',
  'enrichment_confidence',
  'status',
  'created_at',
  'updated_at',
].join(',')

export const jobCatalogFiltersSchema = z.object({
  q: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  source_board: z.enum(['linkedin', 'indeed', 'rozee', 'mustakbil']).optional(),
  employment_type: z.string().trim().max(40).optional(),
  page: z.number().int().min(1).max(1000).optional(),
  page_size: z.number().int().min(1).max(50).optional(),
})

export type JobCatalogFilters = z.infer<typeof jobCatalogFiltersSchema>

export interface JobCatalogResult {
  jobs: Job[]
  total: number
  page: number
  page_size: number
  error?: string
}

export async function loadJobs(input: unknown = {}): Promise<JobCatalogResult> {
  const parsed = jobCatalogFiltersSchema.safeParse(input)
  if (!parsed.success) {
    return { jobs: [], total: 0, page: 1, page_size: 20, error: 'Invalid job filters.' }
  }

  const { userId } = await auth()
  if (!userId) {
    return { jobs: [], total: 0, page: 1, page_size: 20, error: 'Not authenticated.' }
  }

  const page = parsed.data.page ?? 1
  const pageSize = parsed.data.page_size ?? 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let query = supabaseAdmin
    .from('jobs')
    .select(jobFields, { count: 'exact' })
    .eq('status', 'active')
    .order('last_seen_at', { ascending: false })
    .range(from, to)

  const filters = parsed.data
  if (filters.q) query = query.ilike('title', `%${filters.q}%`)
  if (filters.location) query = query.ilike('location', `%${filters.location}%`)
  if (filters.source_board) query = query.eq('source_board', filters.source_board)
  if (filters.employment_type) query = query.eq('employment_type', filters.employment_type)

  const { data, count, error } = await query
  if (error) return { jobs: [], total: 0, page, page_size: pageSize, error: 'Could not load jobs.' }

  return {
    jobs: (data ?? []) as unknown as Job[],
    total: count ?? 0,
    page,
    page_size: pageSize,
  }
}

export async function loadJob(id: unknown): Promise<Job | null> {
  const parsedId = z.string().uuid().safeParse(id)
  if (!parsedId.success) return null

  const { userId } = await auth()
  if (!userId) return null

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select(jobFields)
    .eq('id', parsedId.data)
    .in('status', ['active', 'stale'])
    .maybeSingle()

  if (error || !data) return null
  return data as unknown as Job
}

export const supportedJobBoards: JobSourceBoard[] = [
  'linkedin',
  'indeed',
  'rozee',
  'mustakbil',
]
