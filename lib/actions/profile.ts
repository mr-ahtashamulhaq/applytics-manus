'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { ensureUser } from '@/lib/auth/ensureUser'

export interface ProfileFormData {
  // Personal
  full_name: string
  phone: string
  city: string
  linkedin_url: string
  portfolio_url: string
  // Education
  university: string
  degree: string
  graduation_status: string
  // Skills
  skills: string[]
  // Experience & Projects (free-text for MVP)
  experience_text: string
  projects_text: string
}

// ── Load profile ────────────────────────────────────────────────
export async function loadProfile(): Promise<ProfileFormData | null> {
  const { userId } = await auth()
  if (!userId) return null

  let clerkUser = null
  try {
    clerkUser = await currentUser()
  } catch {
    return null
  }

  // Ensure user row exists in Supabase
  await ensureUser(
    userId,
    clerkUser?.emailAddresses[0]?.emailAddress,
    clerkUser?.fullName
  )

  // Get user's Supabase UUID
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, name, email')
    .eq('clerk_user_id', userId)
    .single()

  if (!user) return null

  // Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return {
    full_name: user.name ?? clerkUser?.fullName ?? '',
    phone: profile?.phone ?? '',
    city: profile?.city ?? '',
    linkedin_url: profile?.linkedin_url ?? '',
    portfolio_url: profile?.portfolio_url ?? '',
    university: profile?.university ?? '',
    degree: profile?.degree ?? '',
    graduation_status: profile?.graduation_status ?? '',
    skills: profile?.skills ?? [],
    experience_text: profile?.experience_text ?? '',
    projects_text: profile?.projects_text ?? '',
  }
}

// ── Save profile ────────────────────────────────────────────────
export async function saveProfile(data: ProfileFormData): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    // Get Supabase user UUID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (userError || !user) return { success: false, error: 'User not found' }

    // Update user name
    await supabaseAdmin
      .from('users')
      .update({ name: data.full_name, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    // Check if profile row already exists
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const profilePayload = {
      user_id: user.id,
      phone: data.phone || null,
      city: data.city || null,
      linkedin_url: data.linkedin_url || null,
      portfolio_url: data.portfolio_url || null,
      university: data.university || null,
      degree: data.degree || null,
      graduation_status: data.graduation_status || null,
      skills: data.skills.length > 0 ? data.skills : null,
      experience_text: data.experience_text || null,
      projects_text: data.projects_text || null,
      updated_at: new Date().toISOString(),
    }

    let profileError
    if (existing) {
      // Row exists — UPDATE
      const { error } = await supabaseAdmin
        .from('profiles')
        .update(profilePayload)
        .eq('user_id', user.id)
      profileError = error
    } else {
      // No row yet — INSERT
      const { error } = await supabaseAdmin
        .from('profiles')
        .insert({ ...profilePayload, created_at: new Date().toISOString() })
      profileError = error
    }

    if (profileError) {
      console.error('[saveProfile] error:', profileError)
      return { success: false, error: profileError.message }
    }

    revalidatePath('/app/profile')
    revalidatePath('/app/dashboard')
    return { success: true }
  } catch (err) {
    console.error('[saveProfile] unexpected error:', err)
    return { success: false, error: 'Something went wrong' }
  }
}
