import { z } from 'zod'

export const jobCatalogFiltersSchema = z.object({
  q: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  source_board: z.enum(['linkedin', 'indeed', 'rozee', 'mustakbil']).optional(),
  employment_type: z.string().trim().max(40).optional(),
  page: z.number().int().min(1).max(1000).optional(),
  page_size: z.number().int().min(1).max(50).optional(),
})

export type JobCatalogFilters = z.infer<typeof jobCatalogFiltersSchema>
