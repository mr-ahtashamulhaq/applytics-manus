'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Application, ApplicationStatus, ApplicationWithLinks, LinkedJobSummary, LinkedResumeSummary } from '@/lib/types/database'
import {
  applicationIdSchema,
  applicationInputSchema,
  applicationStatusSchema,
  applicationDetailsSchema,
  type ApplicationInput,
} from '@/lib/validation/tracker'

// ── Load all applications ────────────────────────────────────────
export async function loadApplications(): Promise<ApplicationWithLinks[]> {
  const { userId } = await auth()
  if (!userId) return []

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('clerk_user_id', userId).single()
  if (!user) return []

  const { data } = await supabaseAdmin
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const applications = (data ?? []) as Application[]
  const jobIds = [...new Set(applications.map((application) => application.job_id).filter((id): id is string => Boolean(id)))]
  const resumeIds = [...new Set(applications.map((application) => application.generated_resume_id).filter((id): id is string => Boolean(id)))]

  let jobs: LinkedJobSummary[] = []
  if (jobIds.length > 0) {
    const { data: jobRows } = await supabaseAdmin
      .from('jobs')
      .select('id, title, company, source_url, status')
      .in('id', jobIds)
    jobs = (jobRows ?? []) as LinkedJobSummary[]
  }

  let resumes: LinkedResumeSummary[] = []
  if (resumeIds.length > 0) {
    const { data: resumeRows } = await supabaseAdmin
      .from('generated_resumes')
      .select('id, job_id, created_at')
      .eq('user_id', user.id)
      .in('id', resumeIds)
    resumes = (resumeRows ?? []) as LinkedResumeSummary[]
  }

  const jobsById = new Map(jobs.map((job) => [job.id, job]))
  const resumesById = new Map(resumes.map((resume) => [resume.id, resume]))

  return applications.map((application) => ({
    ...application,
    linked_job: application.job_id ? jobsById.get(application.job_id) ?? null : null,
    linked_resume: application.generated_resume_id ? resumesById.get(application.generated_resume_id) ?? null : null,
  }))
}

// ── Add application ──────────────────────────────────────────────
export async function addApplication(input: ApplicationInput): Promise<{ success: boolean; error?: string; application?: Application }> {
  const parsed = applicationInputSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Please check the application details.' }

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('clerk_user_id', userId).single()
  if (!user) return { success: false, error: 'User not found' }

  if (parsed.data.job_id) {
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('id')
      .eq('id', parsed.data.job_id)
      .in('status', ['active', 'stale'])
      .maybeSingle()
    if (!job) return { success: false, error: 'The selected job is no longer available.' }
  }

  if (parsed.data.generated_resume_id) {
    const { data: resume } = await supabaseAdmin
      .from('generated_resumes')
      .select('id, job_id')
      .eq('id', parsed.data.generated_resume_id)
      .eq('user_id', user.id)
      .maybeSingle()
    if (!resume) return { success: false, error: 'The selected resume was not found.' }
    if (parsed.data.job_id && resume.job_id && resume.job_id !== parsed.data.job_id) {
      return { success: false, error: 'The resume and job do not match.' }
    }
  }

  const { data, error } = await supabaseAdmin
    .from('applications')
    .insert({
      user_id: user.id,
      job_id: parsed.data.job_id ?? null,
      generated_resume_id: parsed.data.generated_resume_id ?? null,
      company_name: parsed.data.company_name,
      role_title: parsed.data.role_title,
      status: parsed.data.status,
      applied_date: parsed.data.applied_date || null,
      deadline: parsed.data.deadline || null,
      follow_up_date: parsed.data.follow_up_date || null,
      outcome: parsed.data.outcome || null,
      notes: parsed.data.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return { success: false, error: 'Could not save the application.' }
  revalidatePath('/app/tracker')
  revalidatePath('/app/dashboard')
  return { success: true, application: data as Application }
}

// ── Update status ────────────────────────────────────────────────
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<{ success: boolean; error?: string }> {
  const parsedId = applicationIdSchema.safeParse(id)
  const parsedStatus = applicationStatusSchema.safeParse(status)
  if (!parsedId.success || !parsedStatus.success) {
    return { success: false, error: 'Invalid application update.' }
  }

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('clerk_user_id', userId).single()
  if (!user) return { success: false, error: 'User not found' }

  const { data: updated, error } = await supabaseAdmin
    .from('applications')
    .update({ status: parsedStatus.data, updated_at: new Date().toISOString() })
    .eq('id', parsedId.data)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle()

  if (error || !updated) return { success: false, error: 'Application not found.' }
  revalidatePath('/app/tracker')
  revalidatePath('/app/dashboard')
  return { success: true }
}

// ── Update follow-up details ─────────────────────────────────────
export async function updateApplicationDetails(input: unknown): Promise<{ success: boolean; error?: string; application?: Application }> {
  const parsed = applicationDetailsSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Please check the follow-up details.' }

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('clerk_user_id', userId).single()
  if (!user) return { success: false, error: 'User not found' }

  const { data, error } = await supabaseAdmin
    .from('applications')
    .update({
      deadline: parsed.data.deadline || null,
      follow_up_date: parsed.data.follow_up_date || null,
      outcome: parsed.data.outcome || null,
      notes: parsed.data.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id)
    .eq('user_id', user.id)
    .select()
    .maybeSingle()

  if (error || !data) return { success: false, error: 'Application not found.' }
  revalidatePath('/app/tracker')
  revalidatePath('/app/dashboard')
  return { success: true, application: data as Application }
}

// ── Delete application ───────────────────────────────────────────
export async function deleteApplication(id: string): Promise<{ success: boolean; error?: string }> {
  const parsedId = applicationIdSchema.safeParse(id)
  if (!parsedId.success) return { success: false, error: 'Invalid application.' }

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('clerk_user_id', userId).single()
  if (!user) return { success: false, error: 'User not found' }

  const { data: deleted, error } = await supabaseAdmin
    .from('applications')
    .delete()
    .eq('id', parsedId.data)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle()

  if (error || !deleted) return { success: false, error: 'Application not found.' }
  revalidatePath('/app/tracker')
  revalidatePath('/app/dashboard')
  return { success: true }
}
