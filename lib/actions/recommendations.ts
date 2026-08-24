'use server'

import { auth } from '@clerk/nextjs/server'
import { loadJobs } from '@/lib/actions/jobs'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Job } from '@/lib/types/database'

export interface JobRecommendation {
  job: Job
  score: number
  matchedSkills: string[]
  reasons: string[]
}

export interface RecommendationResult {
  recommendations: JobRecommendation[]
  profileMissing: boolean
  error?: string
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').trim()
}

function skillMatches(skill: string, jobText: string) {
  const normalizedSkill = normalize(skill)
  return normalizedSkill.length > 1 && jobText.includes(normalizedSkill)
}

export async function loadRecommendations(): Promise<RecommendationResult> {
  const { userId } = await auth()
  if (!userId) return { recommendations: [], profileMissing: false, error: 'Not authenticated.' }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (!user) return { recommendations: [], profileMissing: true, error: 'Complete your profile to see recommendations.' }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('city, skills')
    .eq('user_id', user.id)
    .maybeSingle()

  const profileSkills = Array.isArray(profile?.skills) ? profile.skills.filter(Boolean) : []
  const profileCity = typeof profile?.city === 'string' ? profile.city.trim() : ''
  const profileMissing = profileSkills.length === 0 && profileCity.length === 0

  const catalog = await loadJobs({ page: 1, page_size: 50 })
  if (catalog.error) return { recommendations: [], profileMissing, error: catalog.error }

  const recommendations = catalog.jobs
    .map((job): JobRecommendation => {
      const jobText = normalize([
        job.title,
        job.description ?? '',
        ...job.skills_required,
      ].join(' '))
      const matchedSkills = profileSkills.filter((skill) => skillMatches(skill, jobText)).slice(0, 5)
      const locationMatches = profileCity.length > 0 && normalize(job.location).includes(normalize(profileCity))
      const score = Math.min(100, matchedSkills.length * 20 + (locationMatches ? 20 : 0))
      const reasons: string[] = []
      if (matchedSkills.length > 0) reasons.push(`Matches ${matchedSkills.join(', ')}`)
      if (locationMatches) reasons.push(`Location includes ${profileCity}`)
      if (reasons.length === 0) reasons.push('Review the listing and compare it with your profile')
      return { job, score, matchedSkills, reasons }
    })
    .sort((a, b) => b.score - a.score || b.job.last_seen_at.localeCompare(a.job.last_seen_at))
    .slice(0, 20)

  return { recommendations, profileMissing }
}
