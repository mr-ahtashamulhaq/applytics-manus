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
    title: 'Job Discovery',
    body: 'Aggregated opportunities from LinkedIn, Facebook, WhatsApp, job boards, and company websites - filtered by your profile and ranked by fit.',
  },
  {
    Icon: EnvelopeSimple,
    title: 'Cover Letter Generator',
    body: 'AI-generated cover letters tailored to each role, company culture, and your personal experience. Personalized, not generic.',
  },
  {
    Icon: Microphone,
    title: 'Interview Preparation',
    body: 'AI mock interviews, behavioral question practice, company-specific prep, and real-time feedback on your answers.',
  },
  {
    Icon: Graph,
    title: 'Skill Gap Analysis',
    body: 'Compare your current skills against target roles. Get specific recommendations on what to learn, build, or certify next.',
  },
  {
    Icon: Users,
    title: 'Referral Network',
    body: 'Connect with alumni and professionals, request referrals, and build the relationships that actually get you through the door.',
  },
  {
    Icon: ClockCountdown,
    title: 'Career CRM',
    body: 'Manage recruiters, hiring managers, follow-up schedules, and networking contacts. Treat your job search like a professional operation.',
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
              Your career platform. Not just your resume tool.
            </h2>
            <p
              className="text-base lg:text-lg"
              style={{ color: 'var(--charcoal)', lineHeight: 1.65, maxWidth: '520px' }}
            >
              Resume tailoring and application tracking are live today. Here is what the complete
              Applytics platform is building toward - and why early users who join now
              will benefit most.
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
                { label: 'AI Resume Tailoring', live: true },
                { label: 'ATS Match Score', live: true },
                { label: 'Application Tracker', live: true },
                { label: 'Job Discovery', live: false },
                { label: 'Cover Letter AI', live: false },
                { label: 'Interview Prep', live: false },
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
