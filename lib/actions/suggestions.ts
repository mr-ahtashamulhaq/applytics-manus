'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { suggestionInputSchema } from '@/lib/validation/suggestions'

export async function submitSuggestion(input: {
  name?: string
  email?: string
  suggestion: string
}): Promise<{ success: boolean; error?: string }> {
  const parsed = suggestionInputSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Please check your suggestion and email.' }
  const data = parsed.data

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
