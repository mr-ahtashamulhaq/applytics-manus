import { supabaseAdmin } from '@/lib/supabase/admin'
import { aiResultSchema, type AIResult } from '@/lib/validation/resume'

export async function loadLatestResumeVersion(resumeId: string, userId: string): Promise<AIResult | null> {
  const { data, error } = await supabaseAdmin
    .from('resume_versions')
    .select('content')
    .eq('generated_resume_id', resumeId)
    .eq('user_id', userId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  const parsed = aiResultSchema.safeParse(data.content)
  return parsed.success ? parsed.data : null
}
