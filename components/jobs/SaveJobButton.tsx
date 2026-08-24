'use client'

import { BookmarkSimple, Check, CircleNotch } from '@phosphor-icons/react'
import { useState, useTransition } from 'react'
import { removeSavedJob, saveJob } from '@/lib/actions/savedJobs'

interface SaveJobButtonProps {
  jobId: string
  savedId?: string
  variant?: 'button' | 'compact'
}

export default function SaveJobButton({ jobId, savedId, variant = 'button' }: SaveJobButtonProps) {
  const [saved, setSaved] = useState(Boolean(savedId))
  const [currentSavedId, setCurrentSavedId] = useState(savedId)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    setError(null)
    startTransition(async () => {
      const result = saved && currentSavedId
        ? await removeSavedJob(currentSavedId)
        : await saveJob({ job_id: jobId })
      if (!result.ok) {
        setError(result.error ?? 'Could not update saved jobs.')
        return
      }
      setSaved(Boolean(result.saved))
      if (result.saved === false) setCurrentSavedId(undefined)
    })
  }

  const label = isPending ? 'Updating' : saved ? 'Saved' : 'Save job'
  const compact = variant === 'compact'

  return (
    <div className={compact ? 'flex flex-col items-end gap-1' : 'flex flex-col gap-1'}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={saved}
        aria-label={label}
        title={label}
        className={compact ? 'inline-flex min-h-11 min-w-11 items-center justify-center border transition-colors disabled:cursor-wait disabled:opacity-60' : 'inline-flex min-h-11 items-center justify-center gap-2 border px-3 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60'}
        style={{ borderColor: saved ? 'var(--brand-red)' : 'var(--hairline-strong)', color: saved ? 'var(--brand-red)' : 'var(--charcoal)', background: saved ? 'var(--brand-red-subtle)' : 'transparent', borderRadius: 'var(--radius-md)' }}
      >
        {isPending ? <CircleNotch size={18} className="animate-spin" aria-hidden="true" /> : saved ? <Check size={18} weight="bold" aria-hidden="true" /> : <BookmarkSimple size={18} aria-hidden="true" />}
        {!compact && label}
      </button>
      {error && <p className="max-w-48 text-right text-xs" style={{ color: 'var(--brand-red-deep)' }} role="alert">{error}</p>}
    </div>
  )
}
