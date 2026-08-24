'use server'

import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Job } from '@/lib/types/database'
import { jobCatalogFiltersSchema } from '@/lib/validation/jobs'
import { jobFields } from '@/lib/data/jobFields'
import { z } from 'zod'

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

