'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { ensureUser } from '@/lib/auth/ensureUser'
import { jobFields } from '@/lib/data/jobFields'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Job } from '@/lib/types/database'
import { savedJobIdSchema, savedJobInputSchema } from '@/lib/validation/savedJobs'
import { recordUsageEvent } from '@/lib/telemetry/usageEvents'

export interface SavedJob {
  id: string
  job_id: string
  note: string | null
  created_at: string
  updated_at: string
  job: Job
}

async function resolveUser() {
  const { userId } = await auth()
  if (!userId) return null
  await ensureUser(userId)
  const { data } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .maybeSingle()
  return data
}

export async function loadSavedJobMap(): Promise<{ saved: Record<string, string>; error?: string }> {
  const user = await resolveUser()
  if (!user) return { saved: {}, error: 'Not authenticated.' }

  const { data, error } = await supabaseAdmin
    .from('saved_jobs')
    .select('id, job_id')
    .eq('user_id', user.id)

  if (error) return { saved: {}, error: 'Could not load saved jobs.' }
  const saved = Object.fromEntries((data ?? []).map((row) => [row.job_id as string, row.id as string]))
  return { saved }
}

export async function loadSavedJobs(): Promise<{ savedJobs: SavedJob[]; error?: string }> {
  const user = await resolveUser()
  if (!user) return { savedJobs: [], error: 'Not authenticated.' }

  const { data: savedRows, error: savedError } = await supabaseAdmin
    .from('saved_jobs')
    .select('id, job_id, note, created_at, updated_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (savedError) return { savedJobs: [], error: 'Could not load saved jobs.' }
  if (!savedRows || savedRows.length === 0) return { savedJobs: [] }

  const jobIds = savedRows.map((row) => row.job_id as string)
  const { data: jobs, error: jobsError } = await supabaseAdmin
    .from('jobs')
    .select(jobFields)
    .in('id', jobIds)
    .in('status', ['active', 'stale'])

  if (jobsError) return { savedJobs: [], error: 'Could not load saved job details.' }

  const jobsById = new Map((jobs ?? []).map((job) => {
    const typedJob = job as unknown as Job
    return [typedJob.id, typedJob]
  }))
  const savedJobs = savedRows.flatMap((row) => {
    const job = jobsById.get(row.job_id as string)
    if (!job) return []
    return [{
      id: row.id as string,
      job_id: row.job_id as string,
      note: row.note as string | null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      job,
    }]
  })

  return { savedJobs }
}

export async function saveJob(input: unknown): Promise<{ ok: boolean; saved?: boolean; error?: string }> {
  const parsed = savedJobInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid saved job.' }

  const user = await resolveUser()
  if (!user) return { ok: false, error: 'Not authenticated.' }

  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('id')
    .eq('id', parsed.data.job_id)
    .in('status', ['active', 'stale'])
    .maybeSingle()

  if (!job) return { ok: false, error: 'This listing is no longer available.' }

  const { error } = await supabaseAdmin.from('saved_jobs').upsert({
    user_id: user.id,
    job_id: parsed.data.job_id,
    note: parsed.data.note || null,
  }, { onConflict: 'user_id,job_id' })

  if (error) return { ok: false, error: 'Could not save this job.' }
  await recordUsageEvent(user.id, 'saved_job_added', { job_id: parsed.data.job_id })
  revalidatePath('/app/jobs')
  revalidatePath('/app/saved-jobs')
  revalidatePath(`/app/jobs/${parsed.data.job_id}`)
  return { ok: true, saved: true }
}

export async function removeSavedJob(input: unknown): Promise<{ ok: boolean; saved?: boolean; error?: string }> {
  const parsed = savedJobIdSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Invalid saved job.' }

  const user = await resolveUser()
  if (!user) return { ok: false, error: 'Not authenticated.' }

  const { data, error } = await supabaseAdmin
    .from('saved_jobs')
    .delete()
    .eq('user_id', user.id)
    .eq('id', parsed.data)
    .select('id')
    .maybeSingle()

  if (error) return { ok: false, error: 'Could not remove this saved job.' }
  if (!data) return { ok: false, error: 'Saved job not found.' }
  await recordUsageEvent(user.id, 'saved_job_removed', { saved_job_id: parsed.data })
  revalidatePath('/app/jobs')
  revalidatePath('/app/saved-jobs')
  return { ok: true, saved: false }
}
