'use client'

import { useEffect } from 'react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(222,13,18,0.08)' }}
      >
        <span style={{ color: 'var(--brand-red)', fontSize: '1.25rem' }}>!</span>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold mb-1" style={{ color: 'var(--ink-deep)' }}>
          Something went wrong
        </p>
        <p className="text-sm" style={{ color: 'var(--steel)' }}>
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{
          background: 'var(--brand-red)',
          color: '#fff',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  )
}
