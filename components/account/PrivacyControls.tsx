'use client'

import { useState, useTransition } from 'react'
import { useClerk } from '@clerk/nextjs'
import { DownloadSimple, ShieldCheck, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { deleteAccount } from '@/lib/actions/account'

export default function PrivacyControls() {
  const { signOut } = useClerk()
  const [confirmation, setConfirmation] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccount({ confirmation })
      if (!result.success) {
        toast.error(result.error ?? 'Could not delete your account.')
        return
      }

      await signOut({ redirectUrl: '/' })
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="border p-5 md:p-6" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)', borderRadius: 'var(--radius-lg)' }}>
        <div className="flex items-start gap-3">
          <ShieldCheck size={22} weight="duotone" style={{ color: 'var(--brand-red)' }} aria-hidden="true" />
          <div>
            <h2 className="text-h3" style={{ color: 'var(--ink-deep)' }}>Your data</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: 'var(--steel)' }}>
              Your profile, job inputs, generated resumes, saved jobs, and tracker entries stay linked to your account.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4 border-t pt-5" style={{ borderColor: 'var(--hairline)' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--charcoal)' }}>Download a copy</h3>
            <p className="mt-1 text-sm leading-6" style={{ color: 'var(--steel)' }}>
              Get a JSON file with the account data that Applytics stores for your workspace.
            </p>
          </div>
          <a
            href="/api/account/export"
            download="applytics-data-export.json"
            className="inline-flex min-h-11 w-fit items-center gap-2 border px-4 text-sm font-semibold transition-colors hover:bg-[var(--surface)]"
            style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}
          >
            <DownloadSimple size={18} aria-hidden="true" />
            Download data
          </a>
        </div>
      </section>

      <section className="border p-5 md:p-6" style={{ borderColor: 'rgba(222,13,18,0.35)', background: 'var(--brand-red-subtle)', borderRadius: 'var(--radius-lg)' }}>
        <div className="flex items-start gap-3">
          <Trash size={22} weight="duotone" style={{ color: 'var(--brand-red)' }} aria-hidden="true" />
          <div>
            <h2 className="text-h3" style={{ color: 'var(--ink-deep)' }}>Delete your account</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: 'var(--brand-red-deep)' }}>
              This removes your Applytics profile and workflow data. The action cannot be undone.
            </p>
          </div>
        </div>

        {!deleteOpen ? (
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 border px-4 text-sm font-semibold transition-colors hover:bg-[var(--canvas)]"
            style={{ borderColor: 'var(--brand-red)', color: 'var(--brand-red-deep)', borderRadius: 'var(--radius-md)' }}
          >
            <Trash size={17} aria-hidden="true" />
            Start deletion
          </button>
        ) : (
          <div className="mt-5 border-t pt-5" style={{ borderColor: 'rgba(222,13,18,0.2)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--brand-red-deep)' }}>
              Type DELETE MY ACCOUNT to continue.
            </p>
            <label className="mt-3 flex max-w-md flex-col gap-2 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>
              Confirmation
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="min-h-11 border bg-[var(--canvas)] px-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: 'var(--hairline-strong)', borderRadius: 'var(--radius-sm)', color: 'var(--ink)' }}
                aria-describedby="delete-account-help"
              />
            </label>
            <p id="delete-account-help" className="mt-2 max-w-md text-xs leading-5" style={{ color: 'var(--steel)' }}>
              Applytics removes the records and files that it can identify for this account, then signs you out.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending || confirmation !== 'DELETE MY ACCOUNT'}
                className="inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                style={{ background: 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)' }}
              >
                <Trash size={17} aria-hidden="true" />
                {isPending ? 'Deleting account' : 'Delete account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false)
                  setConfirmation('')
                }}
                disabled={isPending}
                className="inline-flex min-h-11 items-center justify-center border px-4 text-sm font-semibold transition-colors hover:bg-[var(--canvas)] disabled:opacity-50"
                style={{ borderColor: 'var(--hairline-strong)', color: 'var(--charcoal)', borderRadius: 'var(--radius-md)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
