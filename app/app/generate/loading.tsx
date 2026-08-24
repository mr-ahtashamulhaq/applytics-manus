function SkeletonBlock({ w = 'w-full', h = 'h-4', className = '' }: { w?: string; h?: string; className?: string }) {
  return (
    <div
      className={`${w} ${h} ${className} rounded animate-pulse`}
      style={{ background: 'var(--hairline-strong)' }}
    />
  )
}

export default function GenerateLoading() {
  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-2">
        <SkeletonBlock w="w-20" h="h-3" />
        <SkeletonBlock w="w-48" h="h-8" />
        <SkeletonBlock w="w-64" h="h-3" />
      </div>

      {/* Form card */}
      <div className="rounded-lg p-6 flex flex-col gap-5" style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <SkeletonBlock w="w-24" h="h-3" />
              <SkeletonBlock w="w-full" h="h-10" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <SkeletonBlock w="w-32" h="h-3" />
          <SkeletonBlock w="w-full" h="h-36" />
        </div>
        <div className="flex flex-col gap-2">
          <SkeletonBlock w="w-28" h="h-3" />
          <SkeletonBlock w="w-full" h="h-20" />
        </div>
        <SkeletonBlock w="w-40" h="h-11" className="self-end" />
      </div>
    </div>
  )
}
