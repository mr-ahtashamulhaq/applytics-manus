import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loadDashboard } from '@/lib/actions/dashboard'
import type { DashboardData } from '@/lib/actions/dashboard'

export const metadata = {
  title: 'Applytics',
  description: 'Overview of your resume activity and job applications.',
}

// ── Status badge (same config as tracker) ───────────────────────
const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Draft:     { color: '#787671', bg: '#f5f5f4' },
  Applied:   { color: '#2563eb', bg: '#eff6ff' },
  Interview: { color: '#d97706', bg: '#fffbeb' },
  Rejected:  { color: '#de0d12', bg: '#fff1f1' },
  Accepted:  { color: '#16a34a', bg: '#f0fdf4' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_STYLE[status] ?? { color: '#787671', bg: '#f5f5f4' }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color, borderRadius: 'var(--radius-xs)' }}
    >
      {status}
    </span>
  )
}

// ── Score color helper ───────────────────────────────────────────
function scoreColor(score: number | null) {
  if (!score) return 'var(--steel)'
  if (score >= 75) return 'var(--success)'
  if (score >= 50) return '#d97706'
  return 'var(--brand-red)'
}

// ── Stat card ────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-1"
      style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
    >
      <span
        className="text-3xl font-bold"
        style={{ color: 'var(--ink-deep)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}
      >
        {value}
      </span>
      <span className="text-xs font-medium" style={{ color: 'var(--steel)' }}>{label}</span>
      {sub && <span className="text-xs" style={{ color: 'var(--stone)' }}>{sub}</span>}
    </div>
  )
}

// ── Section wrapper ──────────────────────────────────────────────
function Section({
  title,
  href,
  hrefLabel,
  children,
  empty,
}: {
  title: string
  href: string
  hrefLabel: string
  children?: React.ReactNode
  empty?: React.ReactNode
}) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--hairline)' }}
      >
        <h2 className="text-sm font-semibold" style={{ color: 'var(--ink-deep)' }}>{title}</h2>
        <Link href={href} className="text-xs font-medium hover:underline" style={{ color: 'var(--brand-red)' }}>
          {hrefLabel}
        </Link>
      </div>
      {children ?? (
        <div className="flex items-center justify-center py-10" style={{ color: 'var(--stone)' }}>
          {empty}
        </div>
      )}
    </div>
  )
}

// ── Profile incomplete banner ────────────────────────────────────
function IncompleteProfileBanner() {
  return (
    <Link
      href="/app/profile"
      className="flex items-center justify-between px-5 py-3.5 rounded-lg transition-colors"
      style={{
        background: 'rgba(222,13,18,0.04)',
        border: '1px solid rgba(222,13,18,0.2)',
      }}
    >
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--brand-red)' }}>
          Complete your profile to generate better resumes
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--steel)' }}>
          Add your work experience and skills so the AI has enough context.
        </p>
      </div>
      <span className="text-xs font-semibold ml-4 flex-shrink-0" style={{ color: 'var(--brand-red)' }}>
        Complete now →
      </span>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const data = await loadDashboard()

  if (!data) redirect('/sign-in')

  const { stats, recentResumes, recentApplications, profileComplete, userName } = data

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="mb-7">
        <p className="text-label mb-1">Overview</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--steel)' }}>
          Welcome back, {userName.split(' ')[0]}.
        </p>
      </div>

      {/* Profile incomplete banner */}
      {!profileComplete && <div className="mb-5"><IncompleteProfileBanner /></div>}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Resumes Generated" value={stats.resumesGenerated} />
        <StatCard label="Applications" value={stats.applications} />
        <StatCard label="Interviews" value={stats.interviews} />
        <StatCard
          label="Avg. Match Score"
          value={stats.avgMatchScore !== null ? `${stats.avgMatchScore}%` : '-'}
          sub={stats.avgMatchScore !== null ? 'across all resumes' : 'generate a resume first'}
        />
      </div>

      {/* Recent resumes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Section
          title="Recent Resumes"
          href="/app/generate"
          hrefLabel="+ Generate new"
          empty={
            <div className="text-center px-6">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>No resumes yet</p>
              <p className="text-xs">Paste a job description to get your first tailored resume.</p>
            </div>
          }
        >
          {recentResumes.length > 0 && (
            <div>
              {recentResumes.map((r, i) => (
                <Link
                  key={r.id}
                  href={`/app/generate/result/${r.id}`}
                  className="row-hover flex items-center justify-between px-5 py-3"
                  style={{
                    borderBottom: i < recentResumes.length - 1 ? '1px solid var(--hairline)' : 'none',
                    background: 'var(--canvas)',
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--ink-deep)' }}>
                      {r.jobTitle}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--steel)' }}>
                      {r.companyName} · {new Date(r.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  {r.matchScore !== null && (
                    <span
                      className="text-sm font-bold ml-3 flex-shrink-0"
                      style={{ color: scoreColor(r.matchScore), fontFamily: 'var(--font-mono)' }}
                    >
                      {r.matchScore}%
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </Section>

        {/* Recent applications */}
        <Section
          title="Recent Applications"
          href="/app/tracker"
          hrefLabel="View all"
          empty={
            <div className="text-center px-6">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--ink)' }}>No applications tracked</p>
              <p className="text-xs">Generate a resume and save it to start tracking.</p>
            </div>
          }
        >
          {recentApplications.length > 0 && (
            <div>
              {recentApplications.map((a, i) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between px-5 py-3"
                  style={{
                    borderBottom: i < recentApplications.length - 1 ? '1px solid var(--hairline)' : 'none',
                    background: 'var(--canvas)',
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--ink-deep)' }}>
                      {a.companyName}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--steel)' }}>
                      {a.roleTitle}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Generate CTA if no resumes */}
      {stats.resumesGenerated === 0 && (
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-5 rounded-lg"
          style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
        >
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--ink-deep)' }}>
              Ready to tailor your first resume?
            </p>
            <p className="text-xs" style={{ color: 'var(--steel)' }}>
              Paste any job description and Applytics will rewrite your profile to match it.
            </p>
          </div>
          <Link
            href="/app/generate"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold flex-shrink-0"
            style={{
              background: 'var(--brand-red)',
              color: 'var(--on-dark)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Generate your first resume
          </Link>
        </div>
      )}
    </div>
  )
}
