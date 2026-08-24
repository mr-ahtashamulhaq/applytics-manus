'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Application, ApplicationStatus } from '@/lib/types/database'

// ── Load all applications ────────────────────────────────────────
export async function loadApplications() {
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

  return data ?? []
}

// ── Add application ──────────────────────────────────────────────
export async function addApplication(input: {
  company_name: string
  role_title: string
  status: ApplicationStatus
  applied_date?: string
  notes?: string
}): Promise<{ success: boolean; error?: string; application?: Application }> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('clerk_user_id', userId).single()
  if (!user) return { success: false, error: 'User not found' }

  const { data, error } = await supabaseAdmin
    .from('applications')
    .insert({
      user_id: user.id,
      company_name: input.company_name,
      role_title: input.role_title,
      status: input.status,
      applied_date: input.applied_date || null,
      notes: input.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/app/tracker')
  revalidatePath('/app/dashboard')
  return { success: true, application: data as Application }
}

// ── Update status ────────────────────────────────────────────────
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('clerk_user_id', userId).single()
  if (!user) return { success: false, error: 'User not found' }

  const { error } = await supabaseAdmin
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/app/tracker')
  revalidatePath('/app/dashboard')
  return { success: true }
}

// ── Delete application ───────────────────────────────────────────
export async function deleteApplication(id: string): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const { data: user } = await supabaseAdmin
    .from('users').select('id').eq('clerk_user_id', userId).single()
  if (!user) return { success: false, error: 'User not found' }

  const { error } = await supabaseAdmin
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/app/tracker')
  revalidatePath('/app/dashboard')
  return { success: true }
}
