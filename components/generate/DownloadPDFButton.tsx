'use client'

import { useState } from 'react'
import { CircleNotch, FilePdf, Check } from '@phosphor-icons/react'

interface Props {
  resumeId: string
  filename?: string
}

export default function DownloadPDFButton({ resumeId, filename }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleDownload = async () => {
    if (state === 'loading') return
    setState('loading')

    try {
      const res = await fetch(`/api/pdf/${resumeId}`)
      if (!res.ok) throw new Error('PDF generation failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename ?? `resume_${resumeId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setState('done')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('idle')
      alert('PDF generation failed! please try again.')
    }
  }

  const label = state === 'loading' ? 'Generating PDF…' : state === 'done' ? 'Downloaded!' : 'Download PDF'

  return (
    <button
      onClick={handleDownload}
      disabled={state === 'loading'}
      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all"
      style={{
        border: `1px solid ${state === 'done' ? 'var(--success)' : 'var(--hairline-strong)'}`,
        borderRadius: 'var(--radius-md)',
        color: state === 'done' ? 'var(--success)' : 'var(--ink)',
        background: 'var(--canvas)',
        cursor: state === 'loading' ? 'not-allowed' : 'pointer',
        opacity: state === 'loading' ? 0.8 : 1,
      }}
    >
      {state === 'loading' && <CircleNotch size={14} className="animate-spin" style={{ color: 'var(--brand-red)' }} />}
      {state === 'done'    && <Check size={14} weight="bold" />}
      {state === 'idle'    && <FilePdf size={14} />}
      {label}
    </button>
  )
}
