'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, CheckCircle, Minus } from '@phosphor-icons/react'
import { BGPattern } from '@/components/ui/bg-pattern'
import { MetalButton } from '@/components/ui/liquid-glass-button'
import AnimatedTextCycle from '@/components/ui/animated-text-cycle'

const TextPressure = dynamic(() => import('@/components/landing/TextPressure'), { ssr: false })

// ── Fake product mockup card ─────────────────────────────────────
function ProductMockup() {
  const keywords = ['React', 'TypeScript', 'Node.js', 'Problem Solving', 'REST APIs']
  const missing  = ['Docker', 'CI/CD']

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full max-w-[420px] rounded-lg overflow-hidden"
      style={{
        border: '1px solid var(--hairline)',
        background: 'var(--canvas)',
        boxShadow: '0 16px 48px -8px rgba(15,12,8,0.14)',
      }}
    >
      {/* Card header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
            Match Score
          </p>
          <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--charcoal)' }}>
            Frontend Engineer · Avanceon
          </p>
        </div>
        {/* Score ring SVG */}
        <div className="relative flex-shrink-0">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--hairline)" strokeWidth="5" />
            <circle
              cx="28" cy="28" r="22" fill="none"
              stroke="var(--brand-red)" strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 22 * 0.84} ${2 * Math.PI * 22}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-sm font-bold"
            style={{ color: 'var(--ink-deep)', fontFamily: 'var(--font-geist-mono)' }}
          >
            84%
          </span>
        </div>
      </div>

      {/* Matched keywords */}
      <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}>
          Matched
        </p>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map(k => (
            <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium" style={{ background: 'var(--surface)', color: 'var(--charcoal)', border: '1px solid var(--hairline)', borderRadius: '3px' }}>
              <CheckCircle size={10} weight="fill" style={{ color: 'var(--brand-red)' }} />
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* Missing keywords */}
      <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--hairline)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}>
          Add to stand out
        </p>
        <div className="flex flex-wrap gap-1.5">
          {missing.map(k => (
            <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium" style={{ background: 'var(--brand-red-subtle)', color: 'var(--brand-red-deep)', border: '1px solid #fcd4d4', borderRadius: '3px' }}>
              <Minus size={10} />
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* Resume preview lines */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={13} style={{ color: 'var(--brand-red)' }} />
          <p className="text-xs font-medium" style={{ color: 'var(--ink)', fontFamily: 'var(--font-geist-mono)' }}>
            resume_avanceon.pdf
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          {[90, 70, 85, 55].map((w, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full"
              style={{ width: `${w}%`, background: 'var(--hairline-strong)' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  const CYCLE_WORDS = ['interviews', 'responses', 'callbacks', 'offers']

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
              <span>Built to get more </span>
              <span style={{ color: 'var(--brand-red)', position: 'relative', display: 'inline-block' }}>
                <AnimatedTextCycle
                  words={CYCLE_WORDS}
                  interval={2800}
                  className="text-2xl lg:text-3xl"
                />
              </span>
              <span>.</span>
            </motion.div>

            {/* Body */}
            <motion.p
              custom={3} variants={slideUp} initial="hidden" animate="visible"
              className="text-base lg:text-lg mb-8 max-w-[520px]"
              style={{ color: 'var(--charcoal)', lineHeight: 1.75 }}
            >
              12 tabs open. The same resume going everywhere. No idea why
              you&apos;re being rejected. Applytics is the single platform that manages your
              entire job search.
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
              No credit card required &middot; Free to start &middot; Built for Pakistan
            </motion.p>
          </div>

          {/* RIGHT: product mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex justify-center items-center"
          >
            {/* Glow behind card */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(222,13,18,0.06) 0%, transparent 70%)',
                transform: 'scale(1.1)',
              }}
            />
            <ProductMockup />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
