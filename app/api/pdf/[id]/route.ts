import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import ResumePDF from '@/components/pdf/ResumePDF'
import { aiResultSchema } from '@/lib/validation/resume'
import { loadLatestResumeVersion } from '@/lib/account/resumeVersions'
import { recordUsageEvent } from '@/lib/telemetry/usageEvents'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const parsedId = z.string().uuid().safeParse(id)
  if (!parsedId.success) return new NextResponse('Not found', { status: 404 })

  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  // Get Supabase user
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, name, email')
    .eq('clerk_user_id', userId)
    .single()

  if (!user) return new NextResponse('User not found', { status: 404 })

  // Get resume — verify ownership
  const { data: resume } = await supabaseAdmin
    .from('generated_resumes')
    .select('*, job_inputs(job_title, company_name)')
    .eq('id', parsedId.data)
    .eq('user_id', user.id)
    .single()

  if (!resume) return new NextResponse('Not found', { status: 404 })

  // Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const parsedAi = aiResultSchema.safeParse(resume.ai_output)
  if (!parsedAi.success) return new NextResponse('Resume is not ready', { status: 422 })

  const latestAi = await loadLatestResumeVersion(parsedId.data, user.id)
  const ai = latestAi ?? parsedAi.data
  const job = resume.job_inputs as { job_title: string; company_name: string } | null

  // Build the PDF element — react-pdf needs a Document at the root
  const profileData = {
    full_name: user.name ?? 'Candidate',
    email: user.email ?? undefined,
    phone: profile?.phone ?? undefined,
    city: profile?.city ?? undefined,
    linkedin_url: profile?.linkedin_url ?? undefined,
    portfolio_url: profile?.portfolio_url ?? undefined,
    university: profile?.university ?? undefined,
    degree: profile?.degree ?? undefined,
    graduation_status: profile?.graduation_status ?? undefined,
  }

  const pdfElement = ResumePDF({
    ai,
    jobTitle: job?.job_title ?? 'Role',
    company: job?.company_name ?? 'Company',
    profile: profileData,
  })

  try {
    // Render PDF buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(pdfElement as any)
    const safePart = (value: string) => value.replace(/[^a-z0-9._-]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'resume'
    const filename = `${safePart(user.name ?? 'resume')}_${safePart(job?.company_name ?? 'applytics')}.pdf`
    await recordUsageEvent(user.id, 'pdf_downloaded', { resume_id: parsedId.data })

    return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.length),
      },
    })
  } catch {
    console.error('[pdf] render failed')
    return new NextResponse('Could not create the PDF', { status: 500 })
  }
}
