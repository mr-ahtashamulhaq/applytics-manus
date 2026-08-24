'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { ensureUser } from '@/lib/auth/ensureUser'
import { groq } from '@/lib/groq/client'
import { z } from 'zod'
import { aiResultSchema, validateResumeEvidence } from '@/lib/validation/resume'
export type { AIResult } from '@/lib/validation/resume'

// ── Types ───────────────────────────────────────────────────────

export interface GenerateInput {
  job_id?: string
  job_title: string
  company_name: string
  job_description?: string
  required_skills?: string
}

const generateInputSchema = z.object({
  job_id: z.string().uuid().optional(),
  job_title: z.string().trim().min(2).max(160),
  company_name: z.string().trim().min(1).max(160),
  job_description: z.string().trim().max(30000).optional(),
  required_skills: z.string().trim().max(2000).optional(),
})

export interface GenerateResult {
  success: boolean
  resumeId?: string
  error?: string
}

const DAILY_GENERATION_GUARD = 20

// ── System prompt ───────────────────────────────────────────────

function buildPrompt(profile: Record<string, unknown>, input: GenerateInput): string {
  const experienceText = (profile.experience_text as string | null) ?? ''
  const projectsText   = (profile.projects_text   as string | null) ?? ''
  const jobDescription = (input.job_description ?? '').trim()

  // Count rough number of experience/project entries to decide depth
  const expEntryCount  = experienceText ? (experienceText.match(/\n\n/g)?.length ?? 0) + 1 : 0
  const projEntryCount = projectsText   ? (projectsText.match(/\n\n/g)?.length ?? 0) + 1 : 0
  const totalEntries   = expEntryCount + projEntryCount
  const isSparse       = totalEntries <= 2  // few entries → expand aggressively

  // JD handling guidance
  const jdSection = jobDescription.length > 0
    ? `Job Description:\n${jobDescription}`
    : `Job Description: Not provided by applicant.\nNote: This is common in the Pakistani job market where many listings are vague or missing. Use the job title "${input.job_title}" and required skills to infer what the employer likely needs.`

  // Content depth instruction
  const depthInstruction = isSparse
    ? `IMPORTANT - CONTENT DEPTH: The candidate has provided only ${totalEntries} experience/project ${totalEntries === 1 ? 'entry' : 'entries'} total. To produce a well-filled resume page:
- Write 4-6 strong bullet points for EACH experience role (not 2-3)
- Write 4-5 bullet points for EACH project (not 1-2)
- Make the summary LONGER: 4-5 sentences covering background, technical strengths, and career goals
- Elaborate on each achievement — explain the "what", "how", and "why it matters"
- If the candidate lists a technology, write a bullet that demonstrates HOW they used it
- Do not pad with filler — all added content must be plausible based on what they provided`
    : `CONTENT DEPTH: Write 3-4 bullet points per experience role and 2-3 bullets per project. Summary should be 2-3 sentences.`

  return `You are an expert resume writer and ATS specialist working with Pakistani job seekers. Your task is to tailor a candidate's profile to a specific role.

STRICT RULES - NEVER VIOLATE:
- Do NOT invent companies, employers, or clients
- Do NOT invent tools or technologies not mentioned in the profile
- Do NOT fabricate numbers or metrics that are not present in the original
- Do NOT add a project, role, employer, date, technology, certification, or achievement that is not supported by the profile
- Keep suggested and missing keywords separate from the candidate's factual resume content
- Calculate match_score only from observable overlap between the supplied profile and job requirements; it is an estimate, not a fact
- You MAY rewrite weak or vague bullet points into stronger, more impact-driven language
- You MAY expand and elaborate on what the candidate has described
- You MAY infer reasonable context from technologies mentioned (e.g. if they mention React, you can describe component architecture, state management, etc.)
- You MAY add a strong action verb and professional framing to every bullet
- Respond ONLY with valid JSON matching the schema exactly

PAKISTANI JOB MARKET CONTEXT:
- Many job descriptions are short, vague, or just a job title — treat this as normal
- Candidates are often fresh graduates or students with limited experience
- Internships, freelance work, and academic projects are ALL highly valid experience
- Emphasise learning curve, initiative, and potential alongside achievements

${depthInstruction}

CANDIDATE PROFILE:
Name: ${profile.full_name ?? 'Not provided'}
City: ${profile.city ?? 'Not provided'}
Education: ${profile.degree ?? ''} at ${profile.university ?? ''} (${profile.graduation_status ?? ''})
Skills: ${(profile.skills as string[] ?? []).join(', ') || 'Not provided'}

Work Experience:
${experienceText || 'Not provided'}

Projects:
${projectsText || 'Not provided'}

JOB DETAILS:
Title: ${input.job_title}
Company: ${input.company_name}
Required Skills: ${input.required_skills ?? 'Not specified'}

${jdSection}

Return a JSON object with this EXACT structure:
{
  "summary": "${isSparse ? '4-5 sentence professional summary tailored to this role and company' : '2-3 sentence professional summary tailored to this role'}",
  "skills_to_emphasize": ["skill1", "skill2", "..."],
  "rewritten_experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "Month Year – Month Year",
      "bullets": ${isSparse ? '["Bullet 1 with strong action verb", "Bullet 2", "Bullet 3", "Bullet 4", "Bullet 5"]' : '["Bullet 1 with strong action verb", "Bullet 2", "Bullet 3"]'}
    }
  ],
  "rewritten_projects": [
    {
      "title": "Project Name",
      "bullets": ${isSparse ? '["Detailed bullet 1 explaining what, how and impact", "Bullet 2", "Bullet 3", "Bullet 4"]' : '["Detailed bullet 1 explaining what, how and impact", "Bullet 2"]'}
    }
  ],
  "suggested_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword from JD not in profile"],
  "match_score": 75,
  "section_order_recommendation": ["Summary", "Skills", "Experience", "Projects", "Education"]
}`
}

// ── Main action ─────────────────────────────────────────────────

export async function generateResume(rawInput: GenerateInput): Promise<GenerateResult> {
  const parsedInput = generateInputSchema.safeParse(rawInput)
  if (!parsedInput.success) return { success: false, error: 'Please check the job details.' }
  const input = parsedInput.data

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const clerkUser = await currentUser()

  // Ensure user exists in Supabase
  await ensureUser(
    userId,
    clerkUser?.emailAddresses[0]?.emailAddress,
    clerkUser?.fullName
  )

  try {
    // 1. Get Supabase user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (!user) return { success: false, error: 'User not found. Try signing out and back in.' }

    const dayStart = new Date()
    dayStart.setUTCHours(0, 0, 0, 0)
    const { count: generationsToday, error: usageError } = await supabaseAdmin
      .from('generated_resumes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', dayStart.toISOString())

    if (usageError) {
      console.error('[generateResume] usage guard query failed')
    } else if ((generationsToday ?? 0) >= DAILY_GENERATION_GUARD) {
      return { success: false, error: 'Daily resume generation is temporarily limited. Please try again tomorrow.' }
    }

    // 2. Resolve catalog context when the request came from the jobs page
    let resolvedInput: GenerateInput = input
    if (input.job_id) {
      const { data: catalogJob, error: catalogError } = await supabaseAdmin
        .from('jobs')
        .select('id, title, company, description, skills_required')
        .eq('id', input.job_id)
        .in('status', ['active', 'stale'])
        .maybeSingle()

      if (catalogError || !catalogJob) {
        return { success: false, error: 'That job is no longer available.' }
      }

      resolvedInput = {
        job_id: catalogJob.id,
        job_title: catalogJob.title,
        company_name: catalogJob.company,
        job_description: catalogJob.description ?? '',
        required_skills: Array.isArray(catalogJob.skills_required)
          ? catalogJob.skills_required.join(', ')
          : '',
      }
    }

    // 3. Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return {
        success: false,
        error: 'Please complete your profile before generating a resume.',
      }
    }

    // 4. Validate profile has enough data
    if (!profile.experience_text && !profile.projects_text) {
      return {
        success: false,
        error: 'Add your work experience or projects to your profile first.',
      }
    }

    // 5. Build prompt
    const userMessage = buildPrompt(
      {
        full_name: (await supabaseAdmin.from('users').select('name').eq('id', user.id).single()).data?.name,
        city: profile.city,
        degree: profile.degree,
        university: profile.university,
        graduation_status: profile.graduation_status,
        skills: profile.skills ?? [],
        experience_text: profile.experience_text,
        projects_text: profile.projects_text,
      },
      resolvedInput
    )

    // 6. Call Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS resume writer. Always respond with valid JSON only. No markdown, no code blocks, just raw JSON.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 3000,
    })

    const rawJson = completion.choices[0]?.message?.content
    if (!rawJson) return { success: false, error: 'AI returned empty response. Please try again.' }

    // 7. Parse and validate the complete AI result contract.
    let parsedJson: unknown
    try {
      parsedJson = JSON.parse(rawJson)
    } catch {
      console.error('[generateResume] AI JSON parse error')
      return { success: false, error: 'AI returned invalid format. Please try again.' }
    }

    const parsedAiResult = aiResultSchema.safeParse(parsedJson)
    if (!parsedAiResult.success) {
      console.error('[generateResume] AI schema validation failed:', parsedAiResult.error.issues.length)
      return { success: false, error: 'AI response did not match the required resume format. Please try again.' }
    }
    const aiResult = parsedAiResult.data
    const unsupportedClaim = validateResumeEvidence(aiResult, [
      profile.skills ?? [],
      profile.experience_text ?? '',
      profile.projects_text ?? '',
      profile.degree ?? '',
      profile.university ?? '',
    ].join(' '))
    if (unsupportedClaim) {
      console.error('[generateResume] AI evidence validation failed:', unsupportedClaim.split(':')[0])
      return { success: false, error: 'AI response included content that was not supported by your profile. Please try again.' }
    }

    // 8. Save job_inputs record
    const { data: jobInput, error: jobError } = await supabaseAdmin
      .from('job_inputs')
      .insert({
        user_id: user.id,
        job_id: resolvedInput.job_id ?? null,
        job_title: resolvedInput.job_title,
        company_name: resolvedInput.company_name,
        job_description: resolvedInput.job_description ?? '',
        required_skills: resolvedInput.required_skills ?? null,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (jobError || !jobInput) {
      console.error('[generateResume] job_inputs error:', jobError)
      return { success: false, error: 'Failed to save job input.' }
    }

    // 9. Save generated_resumes record with AI output
    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('generated_resumes')
      .insert({
        user_id: user.id,
        job_input_id: jobInput.id,
        job_id: resolvedInput.job_id ?? null,
        match_score: aiResult.match_score,
        missing_keywords: aiResult.missing_keywords,
        suggested_keywords: aiResult.suggested_keywords,
        ai_output: aiResult,          // full JSON stored for result page
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (resumeError || !resume) {
      console.error('[generateResume] generated_resumes error:', resumeError)
      return { success: false, error: 'Failed to save resume record.' }
    }

    return { success: true, resumeId: resume.id }
  } catch (err) {
    console.error('[generateResume] unexpected error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
