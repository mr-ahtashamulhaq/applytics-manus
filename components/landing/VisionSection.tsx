'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  MagnifyingGlass,
  EnvelopeSimple,
  Microphone,
  Users,
  Graph,
  ClockCountdown,
} from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const COMING_FEATURES = [
  {
    Icon: MagnifyingGlass,
    title: 'Source expansion',
    body: 'Add more job sources only after access, parsing, freshness, and source-link behavior are verified.',
  },
  {
    Icon: EnvelopeSimple,
    title: 'Cover Letter Generator',
    body: 'A possible future workflow for drafting a cover letter from the selected role and your supported profile evidence.',
  },
  {
    Icon: Microphone,
    title: 'Interview Preparation',
    body: 'A possible future practice space for role questions and structured preparation.',
  },
  {
    Icon: Graph,
    title: 'Skill Gap Analysis',
    body: 'A possible future comparison of target-role requirements with profile skills and projects.',
  },
  {
    Icon: Users,
    title: 'Referral Network',
    body: 'A possible future space for networking notes and referral activity. It is not available today.',
  },
  {
    Icon: ClockCountdown,
    title: 'Career contacts',
    body: 'A possible future extension for recruiter and networking contact records.',
  },
]

export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.vision-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.vision-grid',
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
      id="vision"
      ref={sectionRef}
      className="w-full"
      style={{ background: 'var(--canvas)', padding: 'clamp(80px, 10vw, 128px) 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-14">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}
          >
            What We&apos;re Building
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>

        {/* Headline block — asymmetric 2-col */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
          <div>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-5"
              style={{ color: 'var(--ink-deep)', letterSpacing: '-1.5px', lineHeight: 1.1 }}
            >
              A platform we are building in clear stages.
            </h2>
            <p
              className="text-base lg:text-lg"
              style={{ color: 'var(--charcoal)', lineHeight: 1.65, maxWidth: '520px' }}
            >
              The catalog, recommendations, saved jobs, resume tailoring, and application tracking are live today. The cards below show future work, not current promises.
            </p>
          </div>
          <div
            className="hidden lg:flex flex-col justify-center p-6"
            style={{ border: '1px solid var(--hairline)', borderRadius: 'var(--radius-lg)' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}
            >
              Platform Status
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Verified job catalog', live: true },
                { label: 'Profile recommendations', live: true },
                { label: 'Saved jobs', live: true },
                { label: 'AI resume tailoring', live: true },
                { label: 'Application tracker', live: true },
                { label: 'More source coverage', live: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{item.label}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5"
                    style={{
                      background: item.live ? 'var(--brand-red-subtle)' : 'var(--surface)',
                      color: item.live ? 'var(--brand-red)' : 'var(--stone)',
                      border: `1px solid ${item.live ? '#fcd4d4' : 'var(--hairline)'}`,
                      borderRadius: 'var(--radius-xs)',
                      fontFamily: 'var(--font-geist-mono)',
                    }}
                  >
                    {item.live ? 'Live' : 'Soon'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision cards grid — 3-col (not 3 equal feature cards — these are vision/coming-soon items) */}
        <div className="vision-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0" style={{ border: '1px solid var(--hairline)' }}>
          {COMING_FEATURES.map((feature, i) => {
            const col = i % 3
            const row = Math.floor(i / 3)
            const totalRows = Math.ceil(COMING_FEATURES.length / 3)
            return (
              <div
                key={feature.title}
                className="vision-card flex flex-col gap-4"
                style={{
                  padding: '28px 28px',
                  borderRight: col < 2 ? '1px solid var(--hairline)' : 'none',
                  borderBottom: row < totalRows - 1 ? '1px solid var(--hairline)' : 'none',
                  background: 'var(--canvas)',
                }}
              >
                {/* Coming soon badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center justify-center w-9 h-9"
                    style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}
                  >
                    <feature.Icon size={16} style={{ color: 'var(--steel)' }} />
                  </div>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5"
                    style={{
                      background: 'var(--surface)',
                      color: 'var(--stone)',
                      border: '1px solid var(--hairline)',
                      borderRadius: 'var(--radius-xs)',
                      fontFamily: 'var(--font-geist-mono)',
                    }}
                  >
                    Coming soon
                  </span>
                </div>

                <div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: 'var(--ink-deep)', letterSpacing: '-0.2px' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--charcoal)', lineHeight: 1.6 }}
                  >
                    {feature.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
