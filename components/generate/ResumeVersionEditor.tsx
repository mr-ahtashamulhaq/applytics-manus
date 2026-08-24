'use client'

import { useEffect, useState, useTransition } from 'react'
import { ClockCounterClockwise, FloppyDisk, PencilSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { loadResumeVersions, saveResumeVersion } from '@/lib/actions/resumeVersions'
import type { AIResult } from '@/lib/validation/resume'

interface Props {
  resumeId: string
  initialAi: AIResult
}

function splitSkills(value: string) {
  return value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 30)
}

export default function ResumeVersionEditor({ resumeId, initialAi }: Props) {
  const [summary, setSummary] = useState(initialAi.summary)
  const [skills, setSkills] = useState(initialAi.skills_to_emphasize.join(', '))
  const [versionCount, setVersionCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let active = true
    loadResumeVersions(resumeId).then((result) => {
      if (active && !result.error) setVersionCount(result.versions.length)
    })
    return () => {
      active = false
    }
  }, [resumeId])

  function handleSave() {
    const nextSummary = summary.trim()
    if (!nextSummary) {
      toast.error('Add a summary before saving.')
      return
    }

    startTransition(async () => {
      const result = await saveResumeVersion({
        generated_resume_id: resumeId,
        content: {
          ...initialAi,
          summary: nextSummary,
          skills_to_emphasize: splitSkills(skills),
        },
      })

      if (!result.ok || !result.version) {
        toast.error(result.error ?? 'Could not save this version.')
        return
      }

      setVersionCount((count) => count + 1)
      toast.success(`Version ${result.version.version} saved`)
    })
  }

  return (
    <section className="mt-5 border" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)', borderRadius: 'var(--radius-lg)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4" style={{ borderColor: 'var(--hairline)' }}>
        <div className="flex items-start gap-3">
          <PencilSimple size={21} weight="duotone" style={{ color: 'var(--brand-red)' }} aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--ink-deep)' }}>Make your own edits</h2>
            <p className="mt-1 text-xs leading-5" style={{ color: 'var(--steel)' }}>
              The generated version stays unchanged. Save your edits as a separate version.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex min-h-11 items-center gap-2 border px-3 text-xs font-semibold transition-colors hover:bg-[var(--surface)]"
          style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}
          aria-expanded={isOpen}
        >
          <PencilSimple size={16} aria-hidden="true" />
          {isOpen ? 'Close editor' : 'Edit resume'}
        </button>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 text-xs" style={{ color: 'var(--steel)' }}>
        <ClockCounterClockwise size={16} aria-hidden="true" />
        {versionCount === 0 ? 'No user edits saved yet' : `${versionCount} user ${versionCount === 1 ? 'version' : 'versions'} saved`}
      </div>

      {isOpen && (
        <div className="border-t px-5 py-5" style={{ borderColor: 'var(--hairline)' }}>
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
              Professional summary
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                maxLength={3000}
                rows={6}
                className="border bg-[var(--surface)] px-3 py-3 text-sm leading-6 outline-none focus:ring-2"
                style={{ borderColor: 'var(--hairline-strong)', borderRadius: 'var(--radius-sm)', color: 'var(--ink)' }}
              />
              <span className="text-xs font-normal" style={{ color: 'var(--steel)' }}>{summary.length}/3000 characters</span>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
              Skills to emphasize
              <input
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                maxLength={2400}
                className="min-h-11 border bg-[var(--surface)] px-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--hairline-strong)', borderRadius: 'var(--radius-sm)', color: 'var(--ink)' }}
                aria-describedby="resume-skills-help"
              />
              <span id="resume-skills-help" className="text-xs font-normal" style={{ color: 'var(--steel)' }}>Separate skills with commas. You can save up to 30.</span>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !summary.trim()}
              className="inline-flex min-h-11 items-center gap-2 px-4 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}
            >
              <FloppyDisk size={17} aria-hidden="true" />
              {isPending ? 'Saving version' : 'Save version'}
            </button>
            <p className="text-xs" style={{ color: 'var(--steel)' }} aria-live="polite">
              {isPending ? 'Saving your separate version.' : 'Review every line before you use the resume.'}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
