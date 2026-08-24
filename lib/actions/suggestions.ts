'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { suggestionInputSchema } from '@/lib/validation/suggestions'
import { abuseControlMessage, checkAbuseControl } from '@/lib/security/abuseControls'

export async function submitSuggestion(input: {
  name?: string
  email?: string
  suggestion: string
  website?: string
}): Promise<{ success: boolean; error?: string }> {
  if (typeof input.website === 'string' && input.website.trim()) return { success: true }

  const parsed = suggestionInputSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Please check your suggestion and email.' }
  const data = parsed.data
  const control = await checkAbuseControl({
    operation: 'public_suggestions',
    ipLimit: 5,
  })
  if (!control.allowed) return { success: false, error: abuseControlMessage('public_suggestions', control.reason) }

  const { error } = await supabaseAdmin
    .from('suggestions')
    .insert({
      name:       data.name || null,
      email:      data.email || null,
      suggestion: data.suggestion,
      created_at: new Date().toISOString(),
    })

  if (error) {
    // Keep the public response bounded while preserving the setup hint.
    if (error.code === '42P01') {
      return { success: false, error: 'Suggestions are not available yet.' }
    }
    return { success: false, error: 'Could not save your suggestion.' }
  }

  revalidatePath('/')
  return { success: true }
}
