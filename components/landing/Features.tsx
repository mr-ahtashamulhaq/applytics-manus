'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Target, ChartBar, Briefcase } from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    tag: 'Job-specific resumes',
    title: 'A resume built around the role.',
    body: 'Applytics compares the selected listing with your profile, then rewrites supported experience and project content for that role. Review every statement before you apply.',
    Icon: Target,
    visual: 'ats',
    available: true,
  },
  {
    tag: 'Profile comparison',
    title: 'See what the listing asks for.',
    body: 'Review the skills and keywords that appear in the selected job. Applytics separates profile evidence from suggestions so you can decide what to improve.',
    Icon: ChartBar,
    visual: 'score',
    available: true,
  },
  {
    tag: 'Application Tracker',
    title: 'Keep the next step visible.',
    body: 'Track manual or catalog-linked applications with status, dates, deadlines, follow-ups, outcomes, notes, and the resume used for the role.',
    Icon: Briefcase,
    visual: 'tracker',
    available: true,
  },
]

// ── Feature visual mock-ups ─────────────────────────────────────
function ATSVisual() {
  return (
    <div className="w-full max-w-[340px] rounded-lg p-5" style={{ border: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>Resume review</p>
      <div className="flex flex-col gap-2.5">
        {['Role language', 'Profile evidence', 'Resume wording', 'Final review'].map((item, index) => (
          <div key={item} className="flex items-center gap-3 border-b pb-2.5 last:border-0 last:pb-0" style={{ borderColor: 'var(--hairline)' }}>
            <span className="text-xs" style={{ color: 'var(--stone)', fontFamily: 'var(--font-geist-mono)' }}>0{index + 1}</span>
            <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScoreVisual() {
  return (
    <div className="w-full max-w-[340px] rounded-lg p-5" style={{ border: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>Comparison signals</p>
      <div className="flex flex-col gap-3">
        <div className="border p-3" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)' }}><p className="text-xs" style={{ color: 'var(--steel)' }}>From the listing</p><p className="mt-1 text-sm font-medium" style={{ color: 'var(--ink-deep)' }}>Required skills and role language</p></div>
        <div className="border p-3" style={{ borderColor: 'var(--hairline)', background: 'var(--canvas)' }}><p className="text-xs" style={{ color: 'var(--steel)' }}>From your profile</p><p className="mt-1 text-sm font-medium" style={{ color: 'var(--ink-deep)' }}>Skills, projects, and experience</p></div>
        <p className="text-xs" style={{ color: 'var(--stone)' }}>Review the evidence before you decide.</p>
      </div>
    </div>
  )
}

function TrackerVisual() {
  const rows = [
    { label: 'Catalog listing', value: 'Linked' },
    { label: 'Resume version', value: 'Attached' },
    { label: 'Next follow-up', value: 'Your date' },
  ]
  return (
    <div className="w-full max-w-[340px] overflow-hidden rounded-lg" style={{ border: '1px solid var(--hairline)' }}>
      <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ background: 'var(--surface)', color: 'var(--steel)', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--font-geist-mono)' }}>Application record</div>
      {rows.map((row, index) => (
        <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3" style={{ borderBottom: index < rows.length - 1 ? '1px solid var(--hairline)' : 'none', background: 'var(--canvas)' }}>
          <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{row.label}</span>
          <span className="text-xs font-medium" style={{ color: row.value === 'Your date' ? 'var(--brand-red)' : 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}

const VISUALS: Record<string, React.ReactNode> = {
  ats:     <ATSVisual />,
  score:   <ScoreVisual />,
  tracker: <TrackerVisual />,
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.feature-row').forEach((row) => {
        gsap.fromTo(row,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 78%', once: true }
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="w-full"
      style={{ background: 'var(--canvas)', padding: 'clamp(64px, 8vw, 120px) 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}>
            Available Today
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>

        {/* Zig-zag feature rows */}
        <div className="flex flex-col" style={{ gap: 'clamp(48px, 7vw, 96px)' }}>
          {FEATURES.map((f, i) => {
            const isEven = i % 2 === 0
            return (
              <div
                key={f.tag}
                className={`feature-row grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${isEven ? '' : 'lg:[direction:rtl]'}`}
              >
                {/* Text */}
                <div className={isEven ? '' : 'lg:[direction:ltr]'}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded" style={{ background: 'var(--brand-red-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <f.Icon size={16} style={{ color: 'var(--brand-red)' }} />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
                      {f.tag}
                    </span>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5"
                      style={{
                        background: 'var(--brand-red-subtle)',
                        color: 'var(--brand-red)',
                        border: '1px solid #fcd4d4',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-geist-mono)',
                      }}
                    >
                      Live
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--ink-deep)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                    {f.title}
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--charcoal)', maxWidth: '480px' }}>
                    {f.body}
                  </p>
                </div>

                {/* Visual */}
                <div className={`flex ${isEven ? 'justify-end' : 'justify-start'} ${isEven ? '' : 'lg:[direction:ltr]'}`}>
                  {VISUALS[f.visual]}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
