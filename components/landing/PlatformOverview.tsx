'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MagnifyingGlass, FileText, ChartBar, Trophy } from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    number: '01',
    Icon: MagnifyingGlass,
    title: 'Discover',
    headline: 'A catalog you can inspect.',
    body: 'Applytics is starting with a verified Mustakbil feed. Other sources remain outside the automatic schedule until their access and parsing are verified.',
    status: 'coming-soon',
    statusLabel: 'Coming soon',
  },
  {
    number: '02',
    Icon: FileText,
    title: 'Apply',
    headline: 'A resume for the selected role.',
    body: 'Choose a catalog job or paste job details. Applytics uses your profile and the selected role to create a reviewable resume and PDF.',
    status: 'live',
    statusLabel: 'Available now',
  },
  {
    number: '03',
    Icon: ChartBar,
    title: 'Track',
    headline: 'Keep applications connected.',
    body: 'Track manual or catalog-linked applications with status, dates, deadlines, follow-ups, outcomes, notes, and the resume used.',
    status: 'live',
    statusLabel: 'Available now',
  },
  {
    number: '04',
    Icon: Trophy,
    title: 'Grow',
    headline: 'More career tools over time.',
    body: 'The early-access roadmap includes more discovery and preparation tools. We will label each capability when it is available.',
    status: 'coming-soon',
    statusLabel: 'Coming soon',
  },
]

export default function PlatformOverview() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pillar-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.pillars-grid',
            start: 'top 75%',
            once: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="platform"
      ref={sectionRef}
      className="w-full"
      style={{ background: 'var(--surface)', padding: 'clamp(80px, 10vw, 128px) 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-14">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}
          >
            The Platform
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>

        {/* Headline block */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
          <div>
            <h2
              className="text-4xl lg:text-5xl font-bold"
              style={{ color: 'var(--ink-deep)', letterSpacing: '-1.5px', lineHeight: 1.1 }}
            >
              One place to move your job search forward.
            </h2>
          </div>
          <div>
            <p
              className="text-base lg:text-lg"
              style={{ color: 'var(--charcoal)', lineHeight: 1.65 }}
            >
              Applytics connects job discovery, resume tailoring, recommendations, saved listings, and application tracking. The current early-access scope is shown below.
            </p>
          </div>
        </div>

        {/* 4 pillars grid */}
        <div
          className="pillars-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ border: '1px solid var(--hairline)' }}
        >
          {PILLARS.map((pillar, i) => {
            const isLive = pillar.status === 'live'
            return (
              <div
                key={pillar.number}
                className="pillar-card flex flex-col"
                style={{
                  padding: '32px 28px',
                  background: 'var(--canvas)',
                  borderRight: i < PILLARS.length - 1 ? '1px solid var(--hairline)' : 'none',
                  borderBottom: 'none',
                }}
              >
                {/* Number + status row */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-sm font-bold"
                    style={{ color: 'var(--hairline-strong)', fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {pillar.number}
                  </span>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5"
                    style={{
                      background: isLive ? 'var(--brand-red-subtle)' : 'var(--surface)',
                      color: isLive ? 'var(--brand-red)' : 'var(--stone)',
                      border: `1px solid ${isLive ? '#fcd4d4' : 'var(--hairline)'}`,
                      borderRadius: 'var(--radius-xs)',
                      fontFamily: 'var(--font-geist-mono)',
                    }}
                  >
                    {pillar.statusLabel}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="flex items-center justify-center w-10 h-10 mb-5"
                  style={{
                    background: isLive ? 'var(--brand-red-subtle)' : 'var(--surface)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <pillar.Icon
                    size={18}
                    style={{ color: isLive ? 'var(--brand-red)' : 'var(--steel)' }}
                  />
                </div>

                {/* Title */}
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{
                    color: isLive ? 'var(--brand-red)' : 'var(--stone)',
                    fontFamily: 'var(--font-geist-mono)',
                  }}
                >
                  {pillar.title}
                </p>

                {/* Headline */}
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: 'var(--ink-deep)', letterSpacing: '-0.25px', lineHeight: 1.3 }}
                >
                  {pillar.headline}
                </h3>

                {/* Body */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--charcoal)', lineHeight: 1.6 }}
                >
                  {pillar.body}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
