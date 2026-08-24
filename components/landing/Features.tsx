'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Target, ChartBar, Briefcase } from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    tag: 'ATS Intelligence',
    title: 'Resumes that actually get read.',
    body: 'Most resumes are filtered out before a human ever sees them. Applytics rewrites your resume to match the exact language of the job description and keywords recruiters scan for, in the format ATS systems understand.',
    Icon: Target,
    visual: 'ats',
    available: true,
  },
  {
    tag: 'Match Score',
    title: 'Know your odds before you apply.',
    body: 'See a match score for every application. Understand exactly which keywords you matched, which you missed, and what to add to your profile to improve your chances on future roles.',
    Icon: ChartBar,
    visual: 'score',
    available: true,
  },
  {
    tag: 'Application Tracker',
    title: 'One place for every application.',
    body: 'Track every job you applied to. Update status from Applied to Interview to Offer in a single click. Replace your spreadsheet and Notes app with a dashboard built for the job search.',
    Icon: Briefcase,
    visual: 'tracker',
    available: true,
  },
]

// ── Feature visual mock-ups ─────────────────────────────────────
function ATSVisual() {
  const lines = [95, 80, 70, 88, 60, 75]
  return (
    <div className="w-full max-w-[340px] p-5 rounded-lg" style={{ border: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
        ATS scan result
      </p>
      <div className="flex flex-col gap-2.5">
        {['React', 'TypeScript', 'REST APIs', 'Agile', 'Node.js', 'Git'].map((kw, i) => (
          <div key={kw} className="flex items-center gap-3">
            <span className="text-xs w-20 flex-shrink-0" style={{ color: 'var(--charcoal)' }}>{kw}</span>
            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--hairline)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${lines[i]}%`, background: lines[i] > 75 ? 'var(--brand-red)' : 'var(--hairline-strong)' }}
              />
            </div>
            <span className="text-xs w-8 text-right" style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}>
              {lines[i]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScoreVisual() {
  const circumference = 2 * Math.PI * 40
  return (
    <div className="w-full max-w-[340px] p-5 rounded-lg flex flex-col items-center" style={{ border: '1px solid var(--hairline)', background: 'var(--surface-soft)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-5 self-start" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
        Match analysis
      </p>
      <div className="relative mb-4">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--hairline)" strokeWidth="7" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke="var(--brand-red)" strokeWidth="7"
            strokeDasharray={`${circumference * 0.84} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
          style={{ color: 'var(--ink-deep)', fontFamily: 'var(--font-geist-mono)' }}>
          84%
        </span>
      </div>
      <div className="flex gap-3">
        {[{ label: 'Matched', val: '12', color: 'var(--brand-red)' }, { label: 'Missing', val: '2', color: 'var(--stone)' }].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-xl font-bold" style={{ color: s.color, fontFamily: 'var(--font-geist-mono)' }}>{s.val}</p>
            <p className="text-xs" style={{ color: 'var(--steel)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrackerVisual() {
  const rows = [
    { company: 'Devsinc', role: 'Frontend Dev', status: 'Interview', statusColor: '#d97706', statusBg: '#fffbeb' },
    { company: 'Arbisoft', role: 'React Engineer', status: 'Applied', statusColor: '#2563eb', statusBg: '#eff6ff' },
    { company: 'Avanceon', role: 'Fullstack Dev', status: 'Applied', statusColor: '#2563eb', statusBg: '#eff6ff' },
  ]
  return (
    <div className="w-full max-w-[340px] rounded-lg overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
      <div className="px-4 py-2.5 grid grid-cols-[1fr_1fr_80px] text-xs font-semibold uppercase tracking-wide"
        style={{ background: 'var(--surface)', color: 'var(--steel)', borderBottom: '1px solid var(--hairline)', fontFamily: 'var(--font-geist-mono)' }}>
        <span>Company</span><span>Role</span><span>Status</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="px-4 py-3 grid grid-cols-[1fr_1fr_80px] items-center"
          style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--hairline)' : 'none', background: 'var(--canvas)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--ink-deep)' }}>{r.company}</span>
          <span className="text-xs" style={{ color: 'var(--charcoal)' }}>{r.role}</span>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ color: r.statusColor, background: r.statusBg, borderRadius: '3px' }}>{r.status}</span>
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
