import { describe, expect, it } from 'vitest'
import { accountStorageReferences, storageReference } from './storage'

describe('account storage references', () => {
  it('accepts only same-host Supabase object references for known buckets', () => {
    const previous = process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'

    expect(storageReference('https://example.supabase.co/storage/v1/object/public/resumes/user/file.pdf', 'resumes')).toBe('user/file.pdf')
    expect(storageReference('https://attacker.example/storage/v1/object/public/resumes/user/file.pdf', 'resumes')).toBeNull()
    expect(storageReference('https://example.supabase.co/storage/v1/object/public/generated/user/file.pdf', 'resumes')).toBeNull()

    if (previous === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previous
  })

  it('deduplicates known profile and generated-file references', () => {
    const previous = process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'

    const references = accountStorageReferences(
      { resume_file_url: 'https://example.supabase.co/storage/v1/object/public/resumes/user/file.pdf' },
      [
        {
          output_pdf_url: 'https://example.supabase.co/storage/v1/object/public/generated/user/resume.pdf',
          output_tex_url: 'https://example.supabase.co/storage/v1/object/public/generated/user/resume.tex',
        },
        {
          output_pdf_url: 'https://example.supabase.co/storage/v1/object/public/generated/user/resume.pdf',
          output_tex_url: null,
        },
      ],
    )

    expect(references).toEqual([
      { bucket: 'resumes', path: 'user/file.pdf' },
      { bucket: 'generated', path: 'user/resume.pdf' },
      { bucket: 'generated', path: 'user/resume.tex' },
    ])

    if (previous === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previous
  })
})
