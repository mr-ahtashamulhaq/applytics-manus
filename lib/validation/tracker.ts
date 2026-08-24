import { z } from 'zod'

export const applicationStatusSchema = z.enum([
  'Draft',
  'Applied',
  'Interview',
  'Rejected',
  'Accepted',
])

export const applicationInputSchema = z.object({
  job_id: z.string().uuid().optional(),
  generated_resume_id: z.string().uuid().optional(),
  company_name: z.string().trim().min(1).max(160),
  role_title: z.string().trim().min(1).max(160),
  status: applicationStatusSchema,
  applied_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.')
    .optional(),
  notes: z.string().trim().max(5000).optional(),
})

export const applicationIdSchema = z.string().uuid()

export type ApplicationInput = z.infer<typeof applicationInputSchema>
export type ApplicationStatusInput = z.infer<typeof applicationStatusSchema>
