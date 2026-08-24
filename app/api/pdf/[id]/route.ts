import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import ResumePDF from '@/components/pdf/ResumePDF'
import type { AIResult } from '@/lib/actions/generate'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!resume) return new NextResponse('Not found', { status: 404 })

  // Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const ai = resume.ai_output as AIResult
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

  // Render PDF buffer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(pdfElement as any)

  const filename = `${(user.name ?? 'resume').replace(/\s+/g, '_')}_${(job?.company_name ?? 'applytics').replace(/\s+/g, '_')}.pdf`

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(pdfBuffer.length),
    },
  })
}
