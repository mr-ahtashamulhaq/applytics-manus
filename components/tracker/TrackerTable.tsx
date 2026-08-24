'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash, CaretUpDown, Plus, X } from '@phosphor-icons/react'
import {
  addApplication,
  updateApplicationStatus,
  deleteApplication,
} from '@/lib/actions/tracker'
import type { Application, ApplicationStatus } from '@/lib/types/database'
import { toast } from 'sonner'

// ── Status config ────────────────────────────────────────────────
const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  Draft:     { label: 'Draft',     color: '#787671', bg: '#f5f5f4' },
  Applied:   { label: 'Applied',   color: '#2563eb', bg: '#eff6ff' },
  Interview: { label: 'Interview', color: '#d97706', bg: '#fffbeb' },
  Rejected:  { label: 'Rejected',  color: '#de0d12', bg: '#fff1f1' },
  Accepted:  { label: 'Accepted',  color: '#16a34a', bg: '#f0fdf4' },
}
const STATUSES = Object.keys(STATUS_CONFIG) as ApplicationStatus[]

// ── Add form schema ───────────────────────────────────────────────
const addSchema = z.object({
  company_name: z.string().min(1, 'Required'),
  role_title: z.string().min(1, 'Required'),
  status: z.enum(['Draft', 'Applied', 'Interview', 'Rejected', 'Accepted']),
  applied_date: z.string().optional(),
  notes: z.string().optional(),
})
type AddForm = z.infer<typeof addSchema>

// ── Status select — opens UPWARD to avoid clipping ───────────────
function StatusSelect({
  id,
  current,
  onUpdate,
  onStatusChange,
}: {
  id: string
  current: ApplicationStatus
  onUpdate: () => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const cfg = STATUS_CONFIG[current]

  const select = (status: ApplicationStatus) => {
    setOpen(false)
    onStatusChange(id, status)          // ← instant optimistic update
    startTransition(async () => {
      const res = await updateApplicationStatus(id, status)
      if (res.success) {
        toast.success(`Status updated to ${status}`)
      } else {
        toast.error(res.error ?? 'Failed to update status')
      }
      onUpdate()                        // ← background server sync
    })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium transition-opacity"
        style={{
          background: cfg.bg,
          color: cfg.color,
          borderRadius: 'var(--radius-xs)',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {cfg.label}
        <CaretUpDown size={10} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click-away overlay */}
            <div
              className="fixed inset-0 z-20"
              onClick={() => setOpen(false)}
            />
            {/* Dropdown — opens UPWARD */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute left-0 bottom-full mb-1 z-30 rounded-lg overflow-hidden"
              style={{
                border: '1px solid var(--hairline)',
                background: 'var(--canvas)',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
                minWidth: '130px',
              }}
            >
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => select(s)}
                  className="w-full text-left px-3 py-2 text-xs font-medium transition-colors"
                  style={{
                    color: STATUS_CONFIG[s].color,
                    background: current === s ? STATUS_CONFIG[s].bg : 'transparent',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = STATUS_CONFIG[s].bg }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = current === s
                      ? STATUS_CONFIG[s].bg
                      : 'transparent'
                  }}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Add Application modal ────────────────────────────────────────
function AddModal({
  isOpen,
  onClose,
  onAdded,
  defaultCompany,
  defaultRole,
}: {
  isOpen: boolean
  onClose: () => void
  onAdded: (app: Application) => void
  defaultCompany?: string
  defaultRole?: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddForm>({
    resolver: zodResolver(addSchema),
    defaultValues: {
      company_name: defaultCompany ?? '',
      role_title: defaultRole ?? '',
      status: 'Applied',
    },
  })

  const onSubmit = (data: AddForm) => {
    setError('')
    startTransition(async () => {
      const res = await addApplication(data)
      if (res.success && res.application) {
        reset()
        toast.success('Application added')
        onAdded(res.application)
        onClose()
      } else if (res.success) {
        toast.success('Application added')
        reset()
        onClose()
      } else {
        setError(res.error ?? 'Failed to add')
        toast.error(res.error ?? 'Failed to add application')
      }
    })
  }

  const inputStyle = {
    border: '1px solid var(--hairline-strong)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--canvas)',
    color: 'var(--ink)',
    fontSize: '14px',
    width: '100%',
    padding: '8px 12px',
    outline: 'none',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,15,15,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="w-full max-w-md rounded-lg overflow-hidden"
            style={{ background: 'var(--canvas)', border: '1px solid var(--hairline)' }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              <h2 className="text-h4" style={{ color: 'var(--ink-deep)' }}>Add Application</h2>
              <button onClick={onClose} style={{ color: 'var(--steel)' }} className="hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Company *</label>
                  <input style={inputStyle} placeholder="Arbisoft" {...register('company_name')} />
                  {errors.company_name && (
                    <p className="text-xs mt-1" style={{ color: 'var(--brand-red)' }}>{errors.company_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Role *</label>
                  <input style={inputStyle} placeholder="SWE Intern" {...register('role_title')} />
                  {errors.role_title && (
                    <p className="text-xs mt-1" style={{ color: 'var(--brand-red)' }}>{errors.role_title.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Status</label>
                  <select style={inputStyle} {...register('status')}>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Date Applied</label>
                  <input type="date" style={inputStyle} {...register('applied_date')} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--ink)' }}>Notes</label>
                <textarea
                  rows={2}
                  placeholder="Referral from LinkedIn, strong match..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
                  {...register('notes')}
                />
              </div>

              {error && <p className="text-xs" style={{ color: 'var(--brand-red)' }}>{error}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium rounded"
                  style={{
                    border: '1px solid var(--hairline-strong)',
                    color: 'var(--ink)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium rounded"
                  style={{
                    background: isPending ? 'var(--steel)' : 'var(--brand-red)',
                    color: 'var(--on-dark)',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                  }}
                >
                  {isPending ? 'Adding…' : 'Add Application'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Main tracker table ───────────────────────────────────────────
interface Props {
  initialApplications: Application[]
  defaultCompany?: string
  defaultRole?: string
}

export default function TrackerTable({ initialApplications, defaultCompany, defaultRole }: Props) {
  const router = useRouter()
  const [apps, setApps] = useState(initialApplications)
  const [showAdd, setShowAdd] = useState(!!defaultCompany)
  const [filter, setFilter] = useState<ApplicationStatus | 'All'>('All')
  const [isPending, startTransition] = useTransition()

  // Status update — optimistic local state change, background server sync
  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const handleStatusUpdated = () => {
    router.refresh()
  }

  // Add — instantly prepend to local list, no page reload needed
  const handleAdded = (app: Application) => {
    setApps(prev => [app, ...prev])
    router.refresh() // keep server state in sync
  }

  // Delete — remove from local state immediately
  const handleDelete = (id: string) => {
    setApps(prev => prev.filter(a => a.id !== id))
    startTransition(async () => {
      const res = await deleteApplication(id)
      if (res.success) {
        toast.success('Application removed')
      } else {
        toast.error(res.error ?? 'Failed to delete')
      }
      router.refresh()
    })
  }

  const filtered = filter === 'All' ? apps : apps.filter(a => a.status === filter)

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter(a => a.status === s).length
    return acc
  }, {} as Record<ApplicationStatus, number>)

  return (
    <>
      <AddModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onAdded={handleAdded}
        defaultCompany={defaultCompany}
        defaultRole={defaultRole}
      />

      {/* Filter bar + Add button */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['All', ...STATUSES] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 text-xs font-medium rounded transition-all"
              style={{
                borderRadius: 'var(--radius-sm)',
                border: filter === s
                  ? (s === 'All' ? '1px solid var(--ink)' : `1px solid ${STATUS_CONFIG[s as ApplicationStatus].color}`)
                  : '1px solid var(--hairline)',
                background: filter === s
                  ? (s === 'All' ? 'var(--ink)' : STATUS_CONFIG[s as ApplicationStatus].bg)
                  : 'transparent',
                color: filter === s
                  ? (s === 'All' ? 'var(--on-dark)' : STATUS_CONFIG[s as ApplicationStatus].color)
                  : 'var(--steel)',
              }}
            >
              {s}{s !== 'All' && counts[s as ApplicationStatus] > 0 && ` (${counts[s as ApplicationStatus]})`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: 'var(--brand-red)',
            color: 'var(--on-dark)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
          }}
        >
          <Plus size={14} weight="bold" />
          Add Application
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-lg"
          style={{ border: '1px dashed var(--hairline-strong)', color: 'var(--stone)' }}
        >
          <p className="text-sm font-medium mb-1">No applications yet</p>
          <p className="text-xs">Click &ldquo;Add Application&rdquo; to start tracking</p>
        </div>
      ) : (
        <div className="rounded-lg overflow-visible" style={{ border: '1px solid var(--hairline)' }}>
          {/* Table header */}
          <div
            className="grid text-xs font-semibold uppercase tracking-wide px-4 py-2.5 rounded-t-lg"
            style={{
              gridTemplateColumns: '1fr 1fr 140px 100px 36px',
              background: 'var(--surface)',
              borderBottom: '1px solid var(--hairline)',
              color: 'var(--steel)',
            }}
          >
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span>Date</span>
            <span />
          </div>

          {/* Rows */}
          <AnimatePresence initial={false}>
            {filtered.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -8 }}
                className="grid items-center px-4 py-3 group"
                style={{
                  gridTemplateColumns: '1fr 1fr 140px 100px 36px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--hairline)' : 'none',
                  background: 'var(--canvas)',
                  overflow: 'visible',
                }}
              >
                <span className="text-sm font-medium truncate pr-2" style={{ color: 'var(--ink-deep)' }}>
                  {app.company_name}
                </span>
                <div className="pr-2">
                  <p className="text-sm truncate" style={{ color: 'var(--charcoal)' }}>{app.role_title}</p>
                  {app.notes && (
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--stone)' }}>{app.notes}</p>
                  )}
                </div>
                <div style={{ overflow: 'visible' }}>
                  <StatusSelect
                    id={app.id}
                    current={app.status}
                    onUpdate={handleStatusUpdated}
                    onStatusChange={handleStatusChange}
                  />
                </div>
                <span className="text-xs" style={{ color: 'var(--stone)' }}>
                  {app.applied_date
                    ? new Date(app.applied_date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
                    : '-'}
                </span>
                <button
                  onClick={() => handleDelete(app.id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded"
                  style={{ color: 'var(--stone)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand-red)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--stone)' }}
                  aria-label="Delete application"
                >
                  <Trash size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Summary row */}
      {apps.length > 0 && (
        <div className="flex items-center gap-4 mt-3 px-1">
          {STATUSES.map(s => counts[s] > 0 && (
            <span key={s} className="text-xs" style={{ color: STATUS_CONFIG[s].color }}>
              {counts[s]} {STATUS_CONFIG[s].label}
            </span>
          ))}
          <span className="text-xs ml-auto" style={{ color: 'var(--stone)' }}>
            {apps.length} total application{apps.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </>
  )
}
