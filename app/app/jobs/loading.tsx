export default function JobsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl" aria-busy="true" aria-label="Loading jobs">
      <div className="mb-7 space-y-3">
        <div className="h-3 w-24 animate-pulse" style={{ background: 'var(--hairline)' }} />
        <div className="h-10 w-72 animate-pulse" style={{ background: 'var(--hairline)' }} />
        <div className="h-4 w-full max-w-xl animate-pulse" style={{ background: 'var(--hairline-soft)' }} />
      </div>
      <div className="mb-6 h-14 animate-pulse border" style={{ borderColor: 'var(--hairline)', background: 'var(--surface)' }} />
      <div className="mb-7 grid grid-cols-1 gap-3 border p-4 md:grid-cols-5" style={{ borderColor: 'var(--hairline)' }}>
        {[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-11 animate-pulse" style={{ background: 'var(--surface)' }} />)}
      </div>
      <div className="space-y-0">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-3 border-b py-5" style={{ borderColor: 'var(--hairline)' }}>
            <div className="h-3 w-32 animate-pulse" style={{ background: 'var(--hairline)' }} />
            <div className="h-6 w-2/3 animate-pulse" style={{ background: 'var(--hairline)' }} />
            <div className="h-4 w-1/3 animate-pulse" style={{ background: 'var(--hairline-soft)' }} />
            <div className="h-4 w-1/2 animate-pulse" style={{ background: 'var(--hairline-soft)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
