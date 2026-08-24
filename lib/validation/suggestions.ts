import { z } from 'zod'

export const suggestionInputSchema = z.object({
  name: z.string().trim().max(160).optional(),
  email: z.string().trim().email('Enter a valid email.').max(320).optional().or(z.literal('')),
  suggestion: z.string().trim().min(1).max(4000),
}).strict()

export type SuggestionInput = z.infer<typeof suggestionInputSchema>
