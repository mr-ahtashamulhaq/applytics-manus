'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROBLEMS = [
  {
    number: '01',
    title: 'Opportunities you never see',
    body: 'Jobs are posted across LinkedIn, Facebook groups, WhatsApp communities, Discord servers, university portals, and company websites. Most candidates are only checking one or two. Every week, relevant opportunities disappear before they ever appear on your radar.',
  },
  {
    number: '02',
    title: 'Hours wasted per application',
    body: 'The same resume goes to every company. Each application takes 20-30 minutes of copy-pasting, reformatting, and guessing what the recruiter wants to see. The process is repetitive, manual, and produces mediocre results at scale.',
  },
  {
    number: '03',
    title: 'No visibility into what is working',
    body: 'No analytics. No response rate data. No signal on why you were rejected. Most job seekers track applications in a Notes app - or not at all. Without data, nothing improves and nothing changes.',
  },
]

const STATS = [
  { value: '52', label: 'students surveyed' },
  { value: '71%', label: 'rated this platform highly useful' },
  { value: '1 in 2', label: 'never track their applications' },
  { value: '30+ min', label: 'wasted per application' },
]

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stat strip items
      gsap.fromTo('.stat-item',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.stat-strip',
            start: 'top 80%',
            once: true,
          },
        }
      )
      // Problem rows
      gsap.fromTo('.problem-row',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.problems-grid',
            start: 'top 78%',
            once: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="w-full"
      style={{ background: 'var(--canvas)', padding: 'clamp(80px, 10vw, 1px) 0 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-14">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}
          >
            The Problem
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>

        {/* Headline */}
        <div className="mb-16 max-w-[800px]">
          <h2
            className="text-4xl lg:text-5xl font-bold mb-5"
            style={{ color: 'var(--ink-deep)', letterSpacing: '-1.5px', lineHeight: 1.1 }}
          >
            Job searching in Pakistan is broken.
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--charcoal)', lineHeight: 1.65, maxWidth: '600px' }}
          >
            It is not a talent problem. It is a systems problem. Students and fresh graduates spend
            hours on a process that was never designed for them.
          </p>
        </div>

        {/* Three problem rows — editorial, not cards */}
        <div className="problems-grid" style={{ borderTop: '1px solid var(--hairline)' }}>
          {PROBLEMS.map((p, i) => (
            <div
              key={p.number}
              className="problem-row grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-6 lg:gap-16 py-10"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              {/* Number */}
              <div className="flex items-start gap-4 lg:flex-col lg:gap-0">
                <span
                  className="text-5xl font-bold leading-none"
                  style={{ color: 'var(--hairline-strong)', fontFamily: 'var(--font-geist-mono)' }}
                >
                  {p.number}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3
                  className="text-xl lg:text-2xl font-semibold mb-3"
                  style={{ color: 'var(--ink-deep)', letterSpacing: '-0.35px' }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--charcoal)', maxWidth: '640px' }}
                >
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Research stats strip */}
        <div
          className="stat-strip mt-0"
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--hairline)',
            borderBottom: '1px solid var(--hairline)',
            padding: '28px 0',
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="stat-item flex flex-col items-center justify-center py-4 px-6 text-center"
                style={{
                  borderRight: i < STATS.length - 1 ? '1px solid var(--hairline)' : 'none',
                }}
              >
                <span
                  className="text-3xl lg:text-4xl font-bold mb-1"
                  style={{
                    color: 'var(--brand-red)',
                    fontFamily: 'var(--font-geist-mono)',
                    letterSpacing: '-1px',
                  }}
                >
                  {s.value}
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          {/* Survey attribution */}
          <p
            className="text-center text-xs mt-4"
            style={{ color: 'var(--stone)', fontFamily: 'var(--font-geist-mono)' }}
          >
            Based on student survey · April 2026 · Pakistan
          </p>
        </div>

      </div>
    </section>
  )
}
