import { renderToBuffer } from '@react-pdf/renderer'
import { describe, expect, it } from 'vitest'
import ResumePDF from './ResumePDF'
import type { AIResult } from '@/lib/validation/resume'

const result: AIResult = {
  summary: 'Frontend developer with React experience.',
  skills_to_emphasize: ['React', 'TypeScript'],
  rewritten_experience: [{
    role: 'Frontend Developer',
    company: 'Example Labs',
    duration: '2024 – 2025',
    bullets: ['Built React interfaces for internal users.'],
  }],
  rewritten_projects: [{
    title: 'Portfolio App',
    bullets: ['Created a portfolio app with React.'],
  }],
  suggested_keywords: ['Testing'],
  missing_keywords: [],
  match_score: 72,
  section_order_recommendation: ['Summary', 'Skills', 'Experience', 'Projects', 'Education'],
}

const profile = {
  full_name: 'Aisha Khan',
  email: 'aisha@example.com',
  city: 'Lahore',
  university: 'Example University',
  degree: 'BS Computer Science',
}

describe('ResumePDF', () => {
  it('renders a short resume as a PDF', async () => {
    const buffer = await renderToBuffer(ResumePDF({ ai: result, jobTitle: 'Frontend Developer', company: 'Example Labs', profile }))
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })

  it('renders long content without failing', async () => {
    const longResult: AIResult = {
      ...result,
      summary: 'Frontend developer '.repeat(120),
      rewritten_experience: Array.from({ length: 8 }, (_, index) => ({
        role: `Role ${index}`,
        company: `Company ${index}`,
        duration: '2020 – 2025',
        bullets: Array.from({ length: 8 }, (_, bullet) => `Delivered supported project work for users and teams ${bullet}.`),
      })),
      rewritten_projects: Array.from({ length: 8 }, (_, index) => ({
        title: `Project ${index}`,
        bullets: Array.from({ length: 8 }, (_, bullet) => `Built supported project functionality for users ${bullet}.`),
      })),
    }
    const buffer = await renderToBuffer(ResumePDF({ ai: longResult, jobTitle: 'Frontend Developer', company: 'Example Labs', profile }))
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
    expect(buffer.length).toBeGreaterThan(1000)
  })
})
