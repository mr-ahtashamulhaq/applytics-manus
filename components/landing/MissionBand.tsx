'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from '@phosphor-icons/react'
import { MetalButton } from '@/components/ui/liquid-glass-button'

gsap.registerPlugin(ScrollTrigger)

export default function MissionBand() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.mission-content',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{ background: 'var(--brand-black)', padding: 'clamp(80px, 10vw, 140px) 0' }}
    >
      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="mission-content max-w-[860px] mx-auto text-center">

          {/* Brand mark */}
          <div className="flex justify-center mb-8">
            <Image
              src="/applytics-logo.png"
              alt="Applytics logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain opacity-90"
            />
          </div>

          {/* Tagline — exact words */}
          <blockquote
            className="text-2xl lg:text-3xl font-light mb-14"
            style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, letterSpacing: '-0.25px' }}
          >
            We are not helping people apply to more jobs.
            <br />
            We are helping them{' '}
            <span style={{ color: 'var(--brand-red)', fontWeight: 600 }}>apply with context.</span>
          </blockquote>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '56px' }} />

          {/* Mission + Vision two-col */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left mb-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
                Mission
              </p>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                Helping Pakistan&apos;s job seekers prepare stronger applications.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
                Vision
              </p>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                To build a trusted career support platform that helps people find, prepare for, and track better opportunities.
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link href="/sign-up">
            <MetalButton variant="brand" className="inline-flex items-center gap-2">
              Start your journey
              <ArrowRight size={14} weight="bold" />
            </MetalButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
