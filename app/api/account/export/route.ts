import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { loadAccountExport } from '@/lib/account/data'

export const runtime = 'nodejs'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const exportData = await loadAccountExport(userId)
    if (!exportData) return NextResponse.json({ error: 'Account data is not available.' }, { status: 404 })

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': 'attachment; filename="applytics-data-export.json"',
        'Cache-Control': 'private, no-store',
      },
    })
  } catch {
    console.error('[accountExport] unexpected error')
    return NextResponse.json({ error: 'Could not create the data export.' }, { status: 500 })
  }
}
