'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  Buildings,
  FileText,
  Sparkle,
  ArrowRight,
  WarningCircle,
  CircleNotch,
} from '@phosphor-icons/react'
import { generateResume } from '@/lib/actions/generate'

// ── Schema ───────────────────────────────────────────────────────
const generateSchema = z.object({
  job_title: z.string().min(2, 'Job title is required'),
  company_name: z.string().min(1, 'Company name is required'),
  job_description: z.string().optional(),
  required_skills: z.string().optional(),
})
type FormValues = z.infer<typeof generateSchema>

// ── Step indicator ───────────────────────────────────────────────
const STEPS = [
  { label: 'Reading your profile', duration: 800 },
  { label: 'Analysing job description', duration: 1200 },
  { label: 'Tailoring with Groq AI', duration: 4000 },
  { label: 'Saving results', duration: 600 },
]

function GeneratingOverlay({ currentStep }: { currentStep: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(15,15,15,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col items-center gap-6 px-8 py-10 rounded-lg max-w-sm w-full mx-4"
        style={{ background: 'var(--canvas)', border: '1px solid var(--hairline)' }}
      >
        <div className="relative">
          <CircleNotch
            size={40}
            weight="bold"
            style={{ color: 'var(--brand-red)' }}
            className="animate-spin"
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--ink)' }}>
            Generating your tailored resume
          </p>
          <div className="flex flex-col gap-2">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300"
                  style={{
                    background: i < currentStep
                      ? 'var(--success)'
                      : i === currentStep
                        ? 'var(--brand-red)'
                        : 'var(--hairline-strong)',
                  }}
                />
                <span
                  className="text-xs transition-colors duration-300"
                  style={{
                    color: i <= currentStep ? 'var(--ink)' : 'var(--stone)',
                    fontWeight: i === currentStep ? 500 : 400,
                  }}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Field helpers ────────────────────────────────────────────────
function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
      {children}
      {required && <span style={{ color: 'var(--brand-red)' }}>*</span>}
    </label>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1 text-xs flex items-center gap-1" style={{ color: 'var(--brand-red)' }}>
      <WarningCircle size={12} /> {msg}
    </p>
  )
}

function InputField(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const { error, ...rest } = props
  return (
    <input
      {...rest}
      className="w-full px-3 py-2.5 text-sm outline-none transition-all"
      style={{
        border: `1px solid ${error ? 'var(--brand-red)' : 'var(--hairline-strong)'}`,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        fontSize: '14px',
      }}
      onFocus={e => { e.currentTarget.style.borderColor = 'var(--brand-red)'; e.currentTarget.style.borderWidth = '2px' }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? 'var(--brand-red)' : 'var(--hairline-strong)'; e.currentTarget.style.borderWidth = '1px' }}
    />
  )
}

// ── Main form component ──────────────────────────────────────────
export default function GenerateForm() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(generateSchema) })

  const jdLength = watch('job_description')?.length ?? 0

  const runStepAnimation = () => {
    let step = 0
    setCurrentStep(0)

    const advance = () => {
      if (step < STEPS.length - 1) {
        step++
        setCurrentStep(step)
        setTimeout(advance, STEPS[step].duration)
      }
    }
    setTimeout(advance, STEPS[0].duration)
  }

  const onSubmit = async (data: FormValues) => {
    setServerError('')
    setIsGenerating(true)
    runStepAnimation()

    const result = await generateResume(data)

    if (result.success && result.resumeId) {
      router.push(`/app/generate/result/${result.resumeId}`)
    } else {
      setIsGenerating(false)
      setCurrentStep(0)
      setServerError(result.error ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <AnimatePresence>
        {isGenerating && <GeneratingOverlay currentStep={currentStep} />}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        {/* Job details card */}
        <div
          className="rounded-lg p-6 md:p-8"
          style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
        >
          <div className="mb-5">
            <h2 className="text-h4" style={{ color: 'var(--ink-deep)' }}>Job Details</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--steel)' }}>
              Tell us about the role you are applying for.
            </p>
          </div>
          <div className="divider-h mb-5" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job_title" required>
                <Briefcase size={14} /> Job Title
              </Label>
              <InputField
                id="job_title"
                placeholder="Software Engineer Intern"
                error={!!errors.job_title}
                {...register('job_title')}
              />
              <FieldError msg={errors.job_title?.message} />
            </div>

            <div>
              <Label htmlFor="company_name" required>
                <Buildings size={14} /> Company
              </Label>
              <InputField
                id="company_name"
                placeholder="Arbisoft"
                error={!!errors.company_name}
                {...register('company_name')}
              />
              <FieldError msg={errors.company_name?.message} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="required_skills">
                Required Skills <span style={{ color: 'var(--stone)', fontWeight: 400 }}>(optional - paste from JD)</span>
              </Label>
              <InputField
                id="required_skills"
                placeholder="React, Node.js, Python, REST APIs"
                {...register('required_skills')}
              />
            </div>
          </div>
        </div>

        {/* Job description card */}
        <div
          className="rounded-lg p-6 md:p-8"
          style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
        >
          <div className="mb-5">
            <h2 className="text-h4" style={{ color: 'var(--ink-deep)' }}>Job Description</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--steel)' }}>
              Paste the job description if you have one. Even a job title is enough — our AI handles vague or minimal listings.
            </p>
          </div>
          <div className="divider-h mb-5" />

          <Label htmlFor="job_description">
            <FileText size={14} /> Job Description{' '}
            <span style={{ color: 'var(--stone)', fontWeight: 400 }}>(optional)</span>
          </Label>
          <textarea
            id="job_description"
            placeholder={`Optional — paste the job description here if you have one.\n\nEven just a job title like "Frontend Developer" or a short sentence is fine.\nOur AI will tailor your resume based on whatever context you provide.`}
            className="w-full px-3 py-2.5 text-sm outline-none transition-all resize-vertical"
            style={{
              border: `1px solid ${errors.job_description ? 'var(--brand-red)' : 'var(--hairline-strong)'}`,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--canvas)',
              color: 'var(--ink)',
              fontSize: '14px',
              minHeight: '200px',
              lineHeight: '1.65',
            }}
            {...register('job_description', {
              onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => {
                e.currentTarget.style.borderColor = errors.job_description ? 'var(--brand-red)' : 'var(--hairline-strong)'
                e.currentTarget.style.borderWidth = '1px'
              }
            })}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--brand-red)'; e.currentTarget.style.borderWidth = '2px' }}
          />

          <div className="flex items-center justify-between mt-1.5">
            <FieldError msg={errors.job_description?.message} />
            <span className="text-xs ml-auto" style={{ color: jdLength > 0 ? 'var(--success)' : 'var(--stone)' }}>
              {jdLength > 0 ? `${jdLength} characters` : 'Leave empty to generate a general resume'}
            </span>
          </div>
        </div>

        {/* Error + submit */}
        <div className="flex items-center justify-between gap-4 py-1">
          <AnimatePresence>
            {serverError && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-sm"
                style={{ color: 'var(--brand-red)' }}
              >
                <WarningCircle size={16} />
                {serverError}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isGenerating}
            className="ml-auto inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all"
            style={{
              background: isGenerating ? 'var(--steel)' : 'var(--brand-red)',
              color: 'var(--on-dark)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            <Sparkle size={16} weight="fill" />
            Generate Resume
            <ArrowRight size={14} />
          </button>
        </div>
      </form>
    </>
  )
}
