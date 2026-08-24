function SkeletonBlock({ w = 'w-full', h = 'h-4', className = '' }: { w?: string; h?: string; className?: string }) {
  return (
    <div
      className={`${w} ${h} ${className} rounded animate-pulse`}
      style={{ background: 'var(--hairline-strong)' }}
    />
  )
}

export default function ProfileLoading() {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-7 flex flex-col gap-2">
        <SkeletonBlock w="w-16" h="h-3" />
        <SkeletonBlock w="w-36" h="h-8" />
        <SkeletonBlock w="w-52" h="h-3" />
      </div>

      {['Personal Information', 'Education', 'Skills', 'Work Experience', 'Projects'].map(section => (
        <div key={section} className="mb-6 rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
          <div className="px-5 py-3.5" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--hairline)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--ink-deep)' }}>{section}</span>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="flex flex-col gap-2">
                  <SkeletonBlock w="w-20" h="h-3" />
                  <SkeletonBlock w="w-full" h="h-9" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <SkeletonBlock w="w-32" h="h-10" className="ml-auto" />
    </div>
  )
}
