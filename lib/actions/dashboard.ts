'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { ensureUser } from '@/lib/auth/ensureUser'

export interface DashboardStats {
  resumesGenerated: number
  applications: number
  interviews: number
  avgMatchScore: number | null
}

export interface RecentResume {
  id: string
  jobTitle: string
  companyName: string
  matchScore: number | null
  createdAt: string
}

export interface RecentApplication {
  id: string
  companyName: string
  roleTitle: string
  status: string
  appliedDate: string | null
}

export interface DashboardData {
  stats: DashboardStats
  recentResumes: RecentResume[]
  recentApplications: RecentApplication[]
  profileComplete: boolean
  userName: string
}

export async function loadDashboard(): Promise<DashboardData | null> {
  try {
    const { userId } = await auth()
    if (!userId) return null

    // currentUser() can throw ClerkAPIResponseError during session transitions
    // (sign-in / sign-out race condition). Catch and return null to trigger redirect.
    let clerkUser = null
    try {
      clerkUser = await currentUser()
    } catch {
      return null
    }

    await ensureUser(
      userId,
      clerkUser?.emailAddresses[0]?.emailAddress,
      clerkUser?.fullName
    )

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, name')
      .eq('clerk_user_id', userId)
      .single()

    if (!user) return null

    // Parallel fetches
    const [resumesRes, applicationsRes, profileRes] = await Promise.all([
      supabaseAdmin
        .from('generated_resumes')
        .select('id, match_score, created_at, job_inputs(job_title, company_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('applications')
        .select('id, company_name, role_title, status, applied_date, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('profiles')
        .select('experience_text, skills')
        .eq('user_id', user.id)
        .single(),
    ])

    const resumes = resumesRes.data ?? []
    const applications = applicationsRes.data ?? []
    const profile = profileRes.data

    const interviews = applications.filter(a => a.status === 'Interview').length
    const scores = resumes.map(r => r.match_score).filter(Boolean) as number[]
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null

    type JobInputRow = { job_title: string; company_name: string } | null
    const recentResumes: RecentResume[] = resumes.slice(0, 5).map(r => {
      const ji = (r.job_inputs as unknown) as JobInputRow
      return {
        id: r.id,
        jobTitle: ji?.job_title ?? 'Unknown Role',
        companyName: ji?.company_name ?? 'Unknown Company',
        matchScore: r.match_score,
        createdAt: r.created_at,
      }
    })

    const recentApplications: RecentApplication[] = applications.slice(0, 5).map(a => ({
      id: a.id,
      companyName: a.company_name,
      roleTitle: a.role_title,
      status: a.status,
      appliedDate: a.applied_date,
    }))

    const profileComplete = !!(profile?.experience_text && profile?.skills?.length)

    return {
      stats: {
        resumesGenerated: resumes.length,
        applications: applications.length,
        interviews,
        avgMatchScore: avgScore,
      },
      recentResumes,
      recentApplications,
      profileComplete,
      userName: user.name ?? clerkUser?.firstName ?? 'there',
    }
  } catch {
    // Any unexpected error (network, Clerk, Supabase) → return null, page will redirect
    return null
  }
}
