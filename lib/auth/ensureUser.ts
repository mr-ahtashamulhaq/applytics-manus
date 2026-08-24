/**
 * Ensures a user row exists in Supabase for the given Clerk userId.
 * Call at the top of any server action or API route that needs user data.
 * No webhook needed — creates the row lazily on first call.
 */
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function ensureUser(
  clerkUserId: string,
  email?: string | null,
  fullName?: string | null
): Promise<void> {
  // Check if user already exists
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single()

  if (existing) return // Already synced

  // Insert new user row
  const { error } = await supabaseAdmin.from('users').insert({
    clerk_user_id: clerkUserId,
    email: email ?? '',
    name: fullName ?? null,
    created_at: new Date().toISOString(),
  })

  if (error && error.code !== '23505') {
    // 23505 = unique_violation (race condition) — safe to ignore
    console.error('[ensureUser] Supabase insert error:', error)
  }
}
