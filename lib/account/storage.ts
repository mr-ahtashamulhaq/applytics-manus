const STORAGE_BUCKETS = new Set(['resumes', 'generated'])

export function storageReference(value: unknown, bucket: string) {
  if (typeof value !== 'string' || !value || !STORAGE_BUCKETS.has(bucket)) return null

  try {
    const url = new URL(value)
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!baseUrl || new URL(baseUrl).host !== url.host) return null

    const marker = '/storage/v1/object/'
    const markerIndex = url.pathname.indexOf(marker)
    if (markerIndex < 0) return null

    const segments = url.pathname.slice(markerIndex + marker.length).split('/').filter(Boolean)
    if (segments.length < 3 || !['public', 'sign', 'authenticated'].includes(segments[0])) return null
    if (segments[1] !== bucket) return null

    const path = segments.slice(2).map((segment) => decodeURIComponent(segment)).join('/')
    return path || null
  } catch {
    return null
  }
}

export function accountStorageReferences(
  profile: Record<string, unknown> | null,
  generatedResumes: Record<string, unknown>[],
) {
  const references: Array<{ bucket: 'resumes' | 'generated'; path: string }> = []
  const profilePath = storageReference(profile?.resume_file_url, 'resumes')
  if (profilePath) references.push({ bucket: 'resumes', path: profilePath })

  for (const resume of generatedResumes) {
    for (const field of ['output_pdf_url', 'output_tex_url']) {
      const path = storageReference(resume[field], 'generated')
      if (path) references.push({ bucket: 'generated', path })
    }
  }

  return references.filter((reference, index, all) =>
    all.findIndex((candidate) => candidate.bucket === reference.bucket && candidate.path === reference.path) === index,
  )
}
