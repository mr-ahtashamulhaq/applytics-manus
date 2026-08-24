// ============================================================
// APPLYTICS — Groq AI Output Schema (TypeScript types)
// This mirrors the JSON schema used in the Groq Structured Output call
// ============================================================

export interface RewrittenProject {
  title: string
  bullets: string[]
}

export interface RewrittenExperience {
  role: string
  company: string
  duration: string
  bullets: string[]
}

// The full structured response from Groq
export interface GroqResumeOutput {
  summary: string
  skills_to_emphasize: string[]
  rewritten_projects: RewrittenProject[]
  rewritten_experience: RewrittenExperience[]
  suggested_keywords: string[]
  missing_keywords: string[]
  match_score: number // 0–100
  section_order_recommendation: string[]
}

// JSON Schema for Groq Structured Output (response_format)
export const RESUME_OUTPUT_SCHEMA = {
  type: 'object' as const,
  required: [
    'summary',
    'skills_to_emphasize',
    'rewritten_projects',
    'rewritten_experience',
    'suggested_keywords',
    'missing_keywords',
    'match_score',
    'section_order_recommendation',
  ],
  properties: {
    summary: { type: 'string' },
    skills_to_emphasize: { type: 'array', items: { type: 'string' } },
    rewritten_projects: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'bullets'],
        properties: {
          title: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    rewritten_experience: {
      type: 'array',
      items: {
        type: 'object',
        required: ['role', 'company', 'duration', 'bullets'],
        properties: {
          role: { type: 'string' },
          company: { type: 'string' },
          duration: { type: 'string' },
          bullets: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    suggested_keywords: { type: 'array', items: { type: 'string' } },
    missing_keywords: { type: 'array', items: { type: 'string' } },
    match_score: { type: 'integer', minimum: 0, maximum: 100 },
    section_order_recommendation: { type: 'array', items: { type: 'string' } },
  },
  additionalProperties: false,
}
