import { z } from 'zod'

const optionalText = (max: number) => z.string().trim().max(max).optional().default('')
const optionalUrl = z.union([
  z.string().trim().url('Enter a valid URL.').max(500),
  z.literal(''),
]).optional().default('')

export const profileFormSchema = z.object({
  full_name: z.string().trim().min(2).max(160),
  phone: optionalText(80),
  city: optionalText(120),
  linkedin_url: optionalUrl,
  portfolio_url: optionalUrl,
  university: optionalText(200),
  degree: optionalText(200),
  graduation_status: optionalText(80),
  skills: z.array(z.string().trim().min(1).max(80)).max(40),
  experience_text: optionalText(12000),
  projects_text: optionalText(12000),
}).strict()

export type ProfileFormInput = z.infer<typeof profileFormSchema>
