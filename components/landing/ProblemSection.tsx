'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROBLEMS = [
  {
    number: '01',
    title: 'Listings are spread across places',
    body: 'Job information lives across boards, company pages, and community channels. It is hard to compare roles, source links, and freshness in one view.',
  },
  {
    number: '02',
    title: 'Every application needs context',
    body: 'A single general resume does not capture the language of every role. Moving between a listing, profile, resume, and application record adds manual work.',
  },
  {
    number: '03',
    title: 'Follow-ups are easy to lose',
    body: 'Application status, deadlines, notes, and the resume used for a role often live in separate places. A focused tracker keeps the next action visible.',
  },
]


export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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

        <div className="grid grid-cols-1 gap-px border-y md:grid-cols-3" style={{ background: 'var(--hairline)', borderColor: 'var(--hairline)' }}>
          {['Compare current listings', 'Tailor supported profile content', 'Keep follow-ups visible'].map((item) => (
            <div key={item} className="px-6 py-5" style={{ background: 'var(--surface)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{item}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
