import { describe, expect, it } from 'vitest'
import { applicationInputSchema, applicationOutcomeSchema } from './tracker'

const validApplication = {
  company_name: 'Example Labs',
  role_title: 'Frontend Developer',
  status: 'Applied' as const,
  applied_date: '2026-08-24',
  deadline: '2026-09-01',
  follow_up_date: '2026-09-05',
  outcome: 'other' as const,
  notes: 'Follow up after one week.',
}

describe('tracker validation', () => {
  it('accepts valid application details', () => {
    expect(applicationInputSchema.safeParse(validApplication).success).toBe(true)
  })

  it('rejects impossible calendar dates', () => {
    expect(applicationInputSchema.safeParse({ ...validApplication, deadline: '2026-02-30' }).success).toBe(false)
  })

  it('accepts only documented outcome values', () => {
    expect(applicationOutcomeSchema.safeParse('no_response').success).toBe(true)
    expect(applicationOutcomeSchema.safeParse('pending').success).toBe(false)
  })

  it('accepts UUID workflow links', () => {
    expect(applicationInputSchema.safeParse({
      ...validApplication,
      job_id: '00000000-0000-4000-8000-000000000001',
      generated_resume_id: '00000000-0000-4000-8000-000000000002',
    }).success).toBe(true)
  })
})
