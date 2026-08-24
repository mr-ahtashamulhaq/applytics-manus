'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, CheckCircle } from '@phosphor-icons/react'
import { BGPattern } from '@/components/ui/bg-pattern'
import { MetalButton } from '@/components/ui/liquid-glass-button'

const TextPressure = dynamic(() => import('@/components/landing/TextPressure'), { ssr: false })

// ── Product workflow preview ─────────────────────────────────────
function ProductMockup() {
  const steps = [
    { label: 'Selected job', value: 'Source context' },
    { label: 'Your profile', value: 'Skills and evidence' },
    { label: 'Resume review', value: 'Check before applying' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full max-w-[420px] overflow-hidden rounded-lg"
      style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)', boxShadow: '0 16px 48px -8px rgba(15,12,8,0.14)' }}
    >
      <div className="flex items-center gap-2 border-b px-5 py-4" style={{ borderColor: 'var(--hairline)' }}>
        <FileText size={18} style={{ color: 'var(--brand-red)' }} aria-hidden="true" />
        <div><p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>Resume workflow</p><p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--charcoal)' }}>From job context to a reviewable draft</p></div>
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: 'var(--hairline)' }}>
            <span className="text-xs" style={{ color: 'var(--stone)', fontFamily: 'var(--font-geist-mono)' }}>0{index + 1}</span>
            <div><p className="text-sm font-medium" style={{ color: 'var(--ink-deep)' }}>{step.label}</p><p className="text-xs" style={{ color: 'var(--steel)' }}>{step.value}</p></div>
            <CheckCircle size={17} className="ml-auto" style={{ color: 'var(--brand-red)' }} aria-hidden="true" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  const slideUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }),
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-center"
      style={{ paddingTop: '64px', background: 'var(--canvas)' }}
    >
      {/* Grid background */}
      <BGPattern variant="grid" mask="fade-edges" size={36} fill="#e5e3df" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center py-16 lg:py-24">

          {/* LEFT: text content */}
          <div className="flex flex-col">

            {/* Micro label */}
            <motion.p
              custom={0} variants={slideUp} initial="hidden" animate="visible"
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}
            >
              Career Operating System
            </motion.p>

            {/* TextPressure headline */}
            <motion.div
              custom={1} variants={slideUp} initial="hidden" animate="visible"
              style={{ height: 'clamp(80px, 12vw, 140px)', marginBottom: '20px' }}
            >
              <TextPressure
                text="APPLYTICS"
                weight={true}
                width={true}
                italic={false}
                alpha={false}
                textColor="#0f0f0f"
                minFontSize={36}
              />
            </motion.div>

            {/* AnimatedTextCycle sentence */}
            <motion.div
              custom={2} variants={slideUp} initial="hidden" animate="visible"
              className="text-2xl lg:text-3xl font-light mb-6 relative"
              style={{ color: 'var(--ink)', lineHeight: 1.35, letterSpacing: '-0.5px' }}
            >
              <span>Built for a clearer job search.</span>
            </motion.div>

            {/* Body */}
            <motion.p
              custom={3} variants={slideUp} initial="hidden" animate="visible"
              className="text-base lg:text-lg mb-8 max-w-[520px]"
              style={{ color: 'var(--charcoal)', lineHeight: 1.75 }}
            >
              Find current listings, compare them with your profile, tailor supported content for a selected role, and keep applications connected.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={4} variants={slideUp} initial="hidden" animate="visible"
              className="flex items-center gap-3 flex-wrap"
            >
              <Link href="/sign-up">
                <MetalButton variant="brand" className="flex items-center gap-2">
                  Start for free
                  <ArrowRight size={14} weight="bold" />
                </MetalButton>
              </Link>

              <a
                href="#how-it-works"
                onClick={e => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all"
                style={{
                  color: 'var(--ink)',
                  border: '1px solid var(--hairline-strong)',
                  borderRadius: 'var(--radius-md)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                See how it works
              </a>
            </motion.div>

            {/* Trust line */}
            <motion.p
              custom={5} variants={slideUp} initial="hidden" animate="visible"
              className="mt-5 text-xs"
              style={{ color: 'var(--stone)' }}
            >
              Free during early access &middot; Built for job seekers in Pakistan
            </motion.p>
          </div>

          {/* RIGHT: product mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex justify-center items-center"
          >
            <ProductMockup />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
