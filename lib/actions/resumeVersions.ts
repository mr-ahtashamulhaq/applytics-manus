'use server'

import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { ensureUser } from '@/lib/auth/ensureUser'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { aiResultSchema, type AIResult } from '@/lib/validation/resume'

const saveResumeVersionSchema = z.object({
  generated_resume_id: z.string().uuid(),
  content: aiResultSchema,
})

export interface ResumeVersionSummary {
  id: string
  generated_resume_id: string
  version: number
  content: AIResult
  created_at: string
  updated_at: string
}

async function resolveUser() {
  const { userId } = await auth()
  if (!userId) return null
  await ensureUser(userId)
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .maybeSingle()
  if (error || !data) return null
  return data as { id: string }
}

export async function saveResumeVersion(input: unknown): Promise<{ ok: boolean; version?: ResumeVersionSummary; error?: string }> {
  const parsed = saveResumeVersionSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Resume content is not valid.' }

  const user = await resolveUser()
  if (!user) return { ok: false, error: 'Not authenticated.' }

  const { data: resume } = await supabaseAdmin
    .from('generated_resumes')
    .select('id')
    .eq('id', parsed.data.generated_resume_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!resume) return { ok: false, error: 'Resume not found.' }

  const { data: latest, error: latestError } = await supabaseAdmin
    .from('resume_versions')
    .select('version')
    .eq('generated_resume_id', parsed.data.generated_resume_id)
    .eq('user_id', user.id)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latestError) return { ok: false, error: 'Could not prepare a new resume version.' }

  const nextVersion = (Number(latest?.version) || 0) + 1
  const { data: created, error: createError } = await supabaseAdmin
    .from('resume_versions')
    .insert({
      generated_resume_id: parsed.data.generated_resume_id,
      user_id: user.id,
      version: nextVersion,
      content: parsed.data.content,
    })
    .select('id, generated_resume_id, version, content, created_at, updated_at')
    .single()

  if (createError || !created) {
    console.error('[saveResumeVersion] insert failed')
    return { ok: false, error: 'Could not save this resume version. Please try again.' }
  }

  const version = {
    ...created,
    content: aiResultSchema.parse(created.content),
  } as ResumeVersionSummary
  return { ok: true, version }
}

export async function loadResumeVersions(generatedResumeId: string): Promise<{ versions: ResumeVersionSummary[]; error?: string }> {
  const parsedId = z.string().uuid().safeParse(generatedResumeId)
  if (!parsedId.success) return { versions: [], error: 'Invalid resume.' }

  const user = await resolveUser()
  if (!user) return { versions: [], error: 'Not authenticated.' }

  const { data, error } = await supabaseAdmin
    .from('resume_versions')
    .select('id, generated_resume_id, version, content, created_at, updated_at')
    .eq('generated_resume_id', parsedId.data)
    .eq('user_id', user.id)
    .order('version', { ascending: false })

  if (error) return { versions: [], error: 'Could not load resume versions.' }

  const versions = (data ?? []).flatMap((row) => {
    const parsedContent = aiResultSchema.safeParse(row.content)
    if (!parsedContent.success) return []
    return [{ ...row, content: parsedContent.data } as ResumeVersionSummary]
  })

  return { versions }
}
