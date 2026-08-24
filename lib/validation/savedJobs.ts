import { z } from 'zod'

export const savedJobInputSchema = z.object({
  job_id: z.string().uuid(),
  note: z.string().trim().max(2000).optional(),
})

export const savedJobIdSchema = z.string().uuid()

export type SavedJobInput = z.infer<typeof savedJobInputSchema>
