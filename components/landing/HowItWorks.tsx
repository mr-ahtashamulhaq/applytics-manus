'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ClipboardText, Sparkle, FilePdf } from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    number: '01',
    Icon: ClipboardText,
    title: 'Paste the job description',
    body: 'Copy any job posting from LinkedIn, Indeed, or a company website. Paste it directly into Applytics.',
  },
  {
    number: '02',
    Icon: Sparkle,
    title: 'AI tailors your resume',
    body: 'Our model rewrites your experience bullets, emphasizes matched skills, and removes everything irrelevant to this specific role.',
  },
  {
    number: '03',
    Icon: FilePdf,
    title: 'Download and apply',
    body: 'Get an ATS-safe PDF in seconds. See your match score. Know where you stand before you hit send.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.how-step', 
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="w-full"
      style={{ background: 'var(--surface)', padding: 'clamp(64px, 8vw, 120px) 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}
          >
            How it works
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="how-step relative flex flex-col gap-4 px-0 py-6 md:px-8"
              style={{
                borderLeft: i > 0 ? '1px solid var(--hairline)' : 'none',
                paddingTop: i === 0 ? 0 : undefined,
              }}
            >
              {/* Number + icon row */}
              <div className="flex items-start justify-between">
                <span
                  className="text-5xl font-bold leading-none"
                  style={{ color: 'var(--hairline-strong)', fontFamily: 'var(--font-geist-mono)' }}
                >
                  {step.number}
                </span>
                <div
                  className="flex items-center justify-center w-10 h-10 rounded"
                  style={{ background: 'var(--brand-red-subtle)', borderRadius: 'var(--radius-md)' }}
                >
                  <step.Icon size={18} style={{ color: 'var(--brand-red)' }} />
                </div>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ink-deep)', letterSpacing: '-0.25px' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)', maxWidth: '280px' }}>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
