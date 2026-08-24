import { supabaseAdmin } from '@/lib/supabase/admin'

export interface OwnedAccount {
  id: string
  clerk_user_id: string
  name: string | null
  email: string | null
  created_at: string
  updated_at: string | null
}

export interface AccountExport {
  exported_at: string
  account: Omit<OwnedAccount, 'clerk_user_id'>
  profile: Record<string, unknown> | null
  job_inputs: Record<string, unknown>[]
  generated_resumes: Record<string, unknown>[]
  saved_jobs: Record<string, unknown>[]
  applications: Record<string, unknown>[]
}

async function loadRows(table: 'profiles' | 'job_inputs' | 'generated_resumes' | 'saved_jobs' | 'applications', userId: string) {
  const query = supabaseAdmin.from(table).select('*').eq('user_id', userId)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Record<string, unknown>[]
}

export async function findOwnedAccount(clerkUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, clerk_user_id, name, email, created_at, updated_at')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle()

  if (error) throw error
  return (data as OwnedAccount | null) ?? null
}

export async function loadAccountExport(clerkUserId: string): Promise<AccountExport | null> {
  const account = await findOwnedAccount(clerkUserId)
  if (!account) return null

  const [profiles, jobInputs, generatedResumes, savedJobs, applications] = await Promise.all([
    loadRows('profiles', account.id),
    loadRows('job_inputs', account.id),
    loadRows('generated_resumes', account.id),
    loadRows('saved_jobs', account.id),
    loadRows('applications', account.id),
  ])

  return {
    exported_at: new Date().toISOString(),
    account: {
      id: account.id,
      name: account.name,
      email: account.email,
      created_at: account.created_at,
      updated_at: account.updated_at,
    },
    profile: profiles[0] ?? null,
    job_inputs: jobInputs,
    generated_resumes: generatedResumes,
    saved_jobs: savedJobs,
    applications,
  }
}

