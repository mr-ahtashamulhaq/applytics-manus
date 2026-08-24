'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, WarningCircle, FloppyDisk, PencilSimple } from '@phosphor-icons/react'
import SkillsInput from './SkillsInput'
import EditModal from '@/components/ui/EditModal'
import { saveProfile, type ProfileFormData } from '@/lib/actions/profile'
import { toast } from 'sonner'

// ── Zod schema ──────────────────────────────────────────────────
const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  city: z.string().optional(),
  linkedin_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  portfolio_url: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  university: z.string().optional(),
  degree: z.string().optional(),
  graduation_status: z.string().optional(),
  skills: z.array(z.string()),
  experience_text: z.string().optional(),
  projects_text: z.string().optional(),
})

type FormValues = z.infer<typeof profileSchema>

// ── Reusable field wrappers ──────────────────────────────────────
function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-1.5"
      style={{ color: 'var(--ink)' }}
    >
      {children}
      {required && <span style={{ color: 'var(--brand-red)' }}> *</span>}
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--brand-red)' }}>
      <WarningCircle size={12} />
      {message}
    </p>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const { hasError, ...rest } = props
  return (
    <input
      {...rest}
      className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
      style={{
        border: `1px solid ${hasError ? 'var(--brand-red)' : 'var(--hairline-strong)'}`,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        fontSize: '14px',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = hasError ? 'var(--brand-red)' : 'var(--brand-red)'
        e.currentTarget.style.borderWidth = '2px'
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = hasError ? 'var(--brand-red)' : 'var(--hairline-strong)'
        e.currentTarget.style.borderWidth = '1px'
        props.onBlur?.(e)
      }}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }) {
  const { hasError, ...rest } = props
  return (
    <textarea
      {...rest}
      className="w-full px-3 py-2.5 text-sm outline-none transition-colors resize-vertical"
      style={{
        border: `1px solid ${hasError ? 'var(--brand-red)' : 'var(--hairline-strong)'}`,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        fontSize: '14px',
        minHeight: '120px',
        lineHeight: '1.6',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--brand-red)'
        e.currentTarget.style.borderWidth = '2px'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = hasError ? 'var(--brand-red)' : 'var(--hairline-strong)'
        e.currentTarget.style.borderWidth = '1px'
      }}
    />
  )
}

// ── Section card wrapper ─────────────────────────────────────────
function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-lg p-6 md:p-8"
      style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
    >
      <div className="mb-5">
        <h2 className="text-h4" style={{ color: 'var(--ink-deep)' }}>{title}</h2>
        {description && (
          <p className="mt-1 text-sm" style={{ color: 'var(--steel)', maxWidth: '60ch' }}>
            {description}
          </p>
        )}
      </div>
      <div className="divider-h mb-5" />
      {children}
    </div>
  )
}

// ── Graduation status options ────────────────────────────────────
const GRADUATION_OPTIONS = [
  { value: '', label: 'Select status' },
  { value: 'current', label: 'Currently enrolled' },
  { value: '2025', label: 'Graduated 2025' },
  { value: '2024', label: 'Graduated 2024' },
  { value: '2023', label: 'Graduated 2023' },
  { value: '2022', label: 'Graduated 2022' },
  { value: '2021', label: 'Graduated 2021' },
  { value: 'other', label: 'Other' },
]

// ── Main form component ──────────────────────────────────────────
interface ProfileFormProps {
  initialData: ProfileFormData | null
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [saveError, setSaveError] = useState<string>('')
  const [expModalOpen, setExpModalOpen] = useState(false)
  const [projModalOpen, setProjModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? '',
      phone: initialData?.phone ?? '',
      city: initialData?.city ?? '',
      linkedin_url: initialData?.linkedin_url ?? '',
      portfolio_url: initialData?.portfolio_url ?? '',
      university: initialData?.university ?? '',
      degree: initialData?.degree ?? '',
      graduation_status: initialData?.graduation_status ?? '',
      skills: initialData?.skills ?? [],
      experience_text: initialData?.experience_text ?? '',
      projects_text: initialData?.projects_text ?? '',
    },
  })

  const skills = watch('skills')
  const expText  = watch('experience_text') ?? ''
  const projText = watch('projects_text')  ?? ''

  const onSubmit = async (data: FormValues) => {
    setSaveStatus('saving')
    setSaveError('')

    const result = await saveProfile(data as ProfileFormData)

    if (result.success) {
      setSaveStatus('success')
      toast.success('Profile saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } else {
      setSaveStatus('error')
      setSaveError(result.error ?? 'Failed to save')
      toast.error(result.error ?? 'Failed to save profile')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* ── Personal Information ─────────────────────── */}
      <Section
        title="Personal Information"
        description="This information appears at the top of your generated resume."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name" required>Full Name</Label>
            <Input
              id="full_name"
              placeholder="Muhammad Ahmad"
              hasError={!!errors.full_name}
              {...register('full_name')}
            />
            <FieldError message={errors.full_name?.message} />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+92 300 1234567"
              {...register('phone')}
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Lahore, Pakistan"
              {...register('city')}
            />
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              type="url"
              placeholder="https://linkedin.com/in/username"
              hasError={!!errors.linkedin_url}
              {...register('linkedin_url')}
            />
            <FieldError message={errors.linkedin_url?.message} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="portfolio_url">Portfolio / GitHub URL</Label>
            <Input
              id="portfolio_url"
              type="url"
              placeholder="https://github.com/username"
              hasError={!!errors.portfolio_url}
              {...register('portfolio_url')}
            />
            <FieldError message={errors.portfolio_url?.message} />
          </div>
        </div>
      </Section>

      {/* ── Education ───────────────────────────────── */}
      <Section
        title="Education"
        description="Your highest or most relevant qualification."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="university">University / Institution</Label>
            <Input
              id="university"
              placeholder="UOL - The University Of Lahore"
              {...register('university')}
            />
          </div>

          <div>
            <Label htmlFor="degree">Degree &amp; Field</Label>
            <Input
              id="degree"
              placeholder="BS Computer Science"
              {...register('degree')}
            />
          </div>

          <div>
            <Label htmlFor="graduation_status">Graduation Status</Label>
            <select
              id="graduation_status"
              className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
              style={{
                border: '1px solid var(--hairline-strong)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--canvas)',
                color: 'var(--ink)',
                fontSize: '14px',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23787671' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '32px',
              }}
              {...register('graduation_status')}
            >
              {GRADUATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* ── Skills ──────────────────────────────────── */}
      <Section
        title="Skills"
        description="Add your technical and professional skills. Press Enter or comma to add each one."
      >
        <Label htmlFor="skills-input">Skills</Label>
        <SkillsInput
          value={skills}
          onChange={(val) => setValue('skills', val, { shouldDirty: true })}
        />
        <p className="mt-2 text-xs" style={{ color: 'var(--stone)' }}>
          {skills.length} skill{skills.length !== 1 ? 's' : ''} added
        </p>
      </Section>

      {/* ── Experience ──────────────────────────────── */}
      <Section
        title="Work Experience"
        description="Describe your work experience. Our AI will parse and format this into your resume."
      >
        <Label htmlFor="experience_text">Experience</Label>

        {/* Preview card with Edit button */}
        <div
          className="relative w-full rounded"
          style={{
            border: '1px solid var(--hairline-strong)',
            background: 'var(--surface)',
            minHeight: '100px',
          }}
        >
          <pre
            className="px-3 py-2.5 text-sm w-full overflow-auto whitespace-pre-wrap"
            style={{
              color: expText ? 'var(--ink)' : 'var(--stone)',
              fontFamily: 'inherit',
              lineHeight: 1.65,
              minHeight: '100px',
              maxHeight: '200px',
            }}
          >
            {expText || `Software Engineering Intern - Arbisoft (Jun 2024 – Aug 2024)\n• Built REST APIs using Node.js…`}
          </pre>
          <button
            type="button"
            onClick={() => setExpModalOpen(true)}
            className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background: 'var(--canvas)',
              border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--ink)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand-red)'; (e.currentTarget as HTMLElement).style.color = 'var(--brand-red)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline-strong)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink)' }}
          >
            <PencilSimple size={12} weight="bold" />
            Edit
          </button>
        </div>

        {/* Hidden textarea keeps react-hook-form in sync */}
        <textarea
          id="experience_text"
          {...register('experience_text')}
          style={{ display: 'none' }}
        />

        <EditModal
          isOpen={expModalOpen}
          onClose={() => setExpModalOpen(false)}
          title="Edit Work Experience"
          hint="Write naturally — list each role, company, dates, and a few bullet points. Our AI will structure and tailor this for each job you apply to."
          value={expText}
          onChange={val => setValue('experience_text', val, { shouldDirty: true })}
          placeholder={`Software Engineering Intern - Arbisoft (Jun 2024 – Aug 2024)\n• Built REST APIs using Node.js and Express\n• Reduced API response time by 30%\n\nFreelance Web Developer (2023 – Present)\n• Delivered 10+ client projects using React and Next.js`}
        />

        <p className="mt-2 text-xs" style={{ color: 'var(--stone)' }}>
          Write naturally - our AI will structure this for each job application.
        </p>
      </Section>

      {/* ── Projects ────────────────────────────────── */}
      <Section
        title="Projects"
        description="Notable personal, academic, or open-source projects."
      >
        <Label htmlFor="projects_text">Projects</Label>

        {/* Preview card with Edit button */}
        <div
          className="relative w-full rounded"
          style={{
            border: '1px solid var(--hairline-strong)',
            background: 'var(--surface)',
            minHeight: '80px',
          }}
        >
          <pre
            className="px-3 py-2.5 text-sm w-full overflow-auto whitespace-pre-wrap"
            style={{
              color: projText ? 'var(--ink)' : 'var(--stone)',
              fontFamily: 'inherit',
              lineHeight: 1.65,
              minHeight: '80px',
              maxHeight: '200px',
            }}
          >
            {projText || `Applytics (2024)\n• AI-powered resume tailoring platform…`}
          </pre>
          <button
            type="button"
            onClick={() => setProjModalOpen(true)}
            className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background: 'var(--canvas)',
              border: '1px solid var(--hairline-strong)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--ink)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--brand-red)'; (e.currentTarget as HTMLElement).style.color = 'var(--brand-red)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--hairline-strong)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink)' }}
          >
            <PencilSimple size={12} weight="bold" />
            Edit
          </button>
        </div>

        {/* Hidden textarea keeps react-hook-form in sync */}
        <textarea
          id="projects_text"
          {...register('projects_text')}
          style={{ display: 'none' }}
        />

        <EditModal
          isOpen={projModalOpen}
          onClose={() => setProjModalOpen(false)}
          title="Edit Projects"
          hint="List your notable personal, academic, or open-source projects. Include the name, year, tech stack, and any key outcomes."
          value={projText}
          onChange={val => setValue('projects_text', val, { shouldDirty: true })}
          placeholder={`Applytics (2024)\n• AI-powered resume tailoring platform built with Next.js, Supabase, and Groq\n• github.com/username/applytics\n\nPortfolio Website\n• Personal site built with React - 1,000+ monthly visitors`}
        />
      </Section>

      {/* ── Save button + status ─────────────────────── */}
      <div className="flex items-center justify-between py-2">
        <AnimatePresence mode="wait">
          {saveStatus === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--success)' }}
            >
              <CheckCircle size={16} weight="fill" />
              Profile saved
            </motion.div>
          )}
          {saveStatus === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--brand-red)' }}
            >
              <WarningCircle size={16} />
              {saveError}
            </motion.div>
          )}
          {(saveStatus === 'idle' || saveStatus === 'saving') && (
            <span className="text-sm" style={{ color: 'var(--stone)' }}>
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={saveStatus === 'saving'}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all"
          style={{
            background: saveStatus === 'saving' ? 'var(--steel)' : 'var(--brand-red)',
            color: 'var(--on-dark)',
            borderRadius: 'var(--radius-md)',
            cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
            border: 'none',
          }}
        >
          <FloppyDisk size={16} />
          {saveStatus === 'saving' ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}
