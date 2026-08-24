function SkeletonBlock({ w = 'w-full', h = 'h-4', className = '' }: { w?: string; h?: string; className?: string }) {
  return (
    <div
      className={`${w} ${h} ${className} rounded animate-pulse`}
      style={{ background: 'var(--hairline-strong)' }}
    />
  )
}

export default function TrackerLoading() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-7 flex flex-col gap-2">
        <SkeletonBlock w="w-16" h="h-3" />
        <SkeletonBlock w="w-44" h="h-8" />
      </div>

      {/* Filter + Add bar */}
      <div className="flex items-center gap-3 mb-4">
        <SkeletonBlock w="w-48" h="h-9" />
        <SkeletonBlock w="w-32" h="h-9" />
        <div className="ml-auto">
          <SkeletonBlock w="w-36" h="h-9" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
        {/* Header */}
        <div className="grid grid-cols-5 px-5 py-3" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--hairline)' }}>
          {[1,2,3,4,5].map(i => <SkeletonBlock key={i} w="w-20" h="h-3" />)}
        </div>
        {/* Rows */}
        {[1,2,3,4,5].map(i => (
          <div key={i} className="grid grid-cols-5 items-center px-5 py-4" style={{ borderBottom: '1px solid var(--hairline)' }}>
            {[1,2,3,4].map(j => <SkeletonBlock key={j} w="w-28" h="h-3.5" />)}
            <SkeletonBlock w="w-20" h="h-6" className="rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
