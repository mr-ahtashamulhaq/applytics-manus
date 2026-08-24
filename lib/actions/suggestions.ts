'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function submitSuggestion(input: {
  name?: string
  email?: string
  suggestion: string
}): Promise<{ success: boolean; error?: string }> {
  if (!input.suggestion?.trim()) {
    return { success: false, error: 'Suggestion cannot be empty.' }
  }

  const { error } = await supabaseAdmin
    .from('suggestions')
    .insert({
      name:       input.name?.trim() || null,
      email:      input.email?.trim() || null,
      suggestion: input.suggestion.trim(),
      created_at: new Date().toISOString(),
    })

  if (error) {
    // Gracefully handle missing table
    if (error.code === '42P01') {
      return { success: false, error: 'Suggestions table not found. Please run the SQL setup.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
