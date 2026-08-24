import { z } from 'zod'

export const applicationStatusSchema = z.enum([
  'Draft',
  'Applied',
  'Interview',
  'Rejected',
  'Accepted',
])

export const applicationOutcomeSchema = z.enum(['offer', 'rejected', 'withdrawn', 'no_response', 'hired', 'other'])

export const trackerDateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.')
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  }, 'Enter a valid calendar date.')
  .optional()

export const applicationInputSchema = z.object({
  job_id: z.string().uuid().optional(),
  generated_resume_id: z.string().uuid().optional(),
  company_name: z.string().trim().min(1).max(160),
  role_title: z.string().trim().min(1).max(160),
  status: applicationStatusSchema,
  applied_date: trackerDateSchema,
  deadline: trackerDateSchema,
  follow_up_date: trackerDateSchema,
  outcome: applicationOutcomeSchema.optional(),
  notes: z.string().trim().max(5000).optional(),
})

export const applicationIdSchema = z.string().uuid()

export const applicationDetailsSchema = z.object({
  id: applicationIdSchema,
  deadline: trackerDateSchema,
  follow_up_date: trackerDateSchema,
  outcome: applicationOutcomeSchema.optional(),
  notes: z.string().trim().max(5000).optional(),
})

export type ApplicationInput = z.infer<typeof applicationInputSchema>
export type ApplicationStatusInput = z.infer<typeof applicationStatusSchema>
export type ApplicationOutcome = z.infer<typeof applicationOutcomeSchema>
export type ApplicationDetailsInput = z.infer<typeof applicationDetailsSchema>
