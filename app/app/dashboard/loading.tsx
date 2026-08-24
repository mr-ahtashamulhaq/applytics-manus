// ── Skeleton primitives ───────────────────────────────────────────
function SkeletonBlock({ w = 'w-full', h = 'h-4', className = '' }: { w?: string; h?: string; className?: string }) {
  return (
    <div
      className={`${w} ${h} ${className} rounded animate-pulse`}
      style={{ background: 'var(--hairline-strong)' }}
    />
  )
}

function StatCardSkeleton() {
  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-3"
      style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
    >
      <SkeletonBlock w="w-16" h="h-8" />
      <SkeletonBlock w="w-28" h="h-3" />
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonBlock w="w-40" h="h-3.5" />
        <SkeletonBlock w="w-24" h="h-3" />
      </div>
      <SkeletonBlock w="w-10" h="h-4" />
    </div>
  )
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--hairline)' }}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--ink-deep)' }}>{title}</span>
        <SkeletonBlock w="w-16" h="h-3" />
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--hairline)' }}>
        {[1, 2, 3].map(i => <RowSkeleton key={i} />)}
      </div>
    </div>
  )
}

// ── Dashboard loading skeleton ────────────────────────────────────
export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-7 flex flex-col gap-2">
        <SkeletonBlock w="w-16" h="h-3" />
        <SkeletonBlock w="w-36" h="h-8" />
        <SkeletonBlock w="w-48" h="h-3" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionSkeleton title="Recent Resumes" />
        <SectionSkeleton title="Recent Applications" />
      </div>
    </div>
  )
}
