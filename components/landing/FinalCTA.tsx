'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from '@phosphor-icons/react'
import { MetalButton } from '@/components/ui/liquid-glass-button'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.final-cta-content',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.65,
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
      ref={sectionRef}
      className="w-full"
      style={{ background: 'var(--canvas)', padding: 'clamp(80px, 10vw, 128px) 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div
          className="final-cta-content"
          style={{
            background: 'var(--brand-black)',
            padding: 'clamp(56px, 8vw, 96px) clamp(32px, 6vw, 80px)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}
              >
                Start Today
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-4"
                style={{
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: '-1px',
                  lineHeight: 1.15,
                }}
              >
                Your job search should not feel like a full-time job.
              </h2>
              <p
                className="text-base"
                style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: '520px' }}
              >
                Free to start. No credit card. Your first tailored resume is ready in under 60 seconds.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Link href="/sign-up">
                <MetalButton variant="brand" className="flex items-center gap-2 whitespace-nowrap">
                  Start for free
                  <ArrowRight size={14} weight="bold" />
                </MetalButton>
              </Link>
              <p
                className="text-center text-xs"
                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-geist-mono)' }}
              >
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
