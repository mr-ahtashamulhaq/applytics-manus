'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PERSONAS = [
  {
    tag: 'Final-year student',
    headline: 'Applying for internships with a half-built resume.',
    scenario:
      'You have some projects and one part-time job. Every internship posting asks for 2 years of experience. Applytics helps you surface what you actually have that matches each role - and closes the gap between what you built and what they want to see.',
    detail: 'CS · Business · Engineering · All disciplines',
  },
  {
    tag: 'Fresh graduate',
    headline: 'Sending 50 applications. Getting 2 responses.',
    scenario:
      'You graduated six months ago. You are applying to everything and hearing nothing back. The problem is not your resume - it is that the same resume is going to every job. Applytics fixes that by tailoring each application to the specific role in seconds.',
    detail: 'BS/BBA · Fresh out of university',
  },
  {
    tag: 'Early-career professional',
    headline: 'Trying to level up but losing track of everything.',
    scenario:
      'You have 1-2 years of experience and want a better role. You are juggling applications, interviews, follow-ups, and still doing your current job. Applytics becomes your command center - tracking every move and helping you apply smarter while you stay focused on the work.',
    detail: '1-3 years experience · Career changers',
  },
]

export default function WhoItsFor() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.persona-row',
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
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
      id="who-its-for"
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
            Who It&apos;s For
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>

        {/* Headline */}
        <div className="mb-16 max-w-[680px]">
          <h2
            className="text-4xl lg:text-5xl font-bold"
            style={{ color: 'var(--ink-deep)', letterSpacing: '-1.5px', lineHeight: 1.1 }}
          >
            Built for Pakistan&apos;s next generation of professionals.
          </h2>
        </div>

        {/* Persona rows — editorial list, NOT 3 equal cards */}
        <div style={{ borderTop: '1px solid var(--hairline)' }}>
          {PERSONAS.map((persona, i) => (
            <div
              key={persona.tag}
              className="persona-row grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-16 py-10"
              style={{ borderBottom: '1px solid var(--hairline)' }}
            >
              {/* Left: tag + detail */}
              <div className="flex flex-col gap-2">
                <span
                  className="inline-flex px-3 py-1 text-xs font-semibold uppercase tracking-widest self-start"
                  style={{
                    background: 'var(--brand-red-subtle)',
                    color: 'var(--brand-red)',
                    border: '1px solid #fcd4d4',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-geist-mono)',
                  }}
                >
                  {persona.tag}
                </span>
                <p
                  className="text-xs mt-2"
                  style={{ color: 'var(--stone)', fontFamily: 'var(--font-geist-mono)' }}
                >
                  {persona.detail}
                </p>
              </div>

              {/* Right: headline + scenario */}
              <div>
                <h3
                  className="text-xl lg:text-2xl font-semibold mb-3"
                  style={{ color: 'var(--ink-deep)', letterSpacing: '-0.35px', lineHeight: 1.3 }}
                >
                  {persona.headline}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--charcoal)', maxWidth: '620px', lineHeight: 1.65 }}
                >
                  {persona.scenario}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
