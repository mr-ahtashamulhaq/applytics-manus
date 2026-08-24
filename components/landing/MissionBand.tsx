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
      {/* Subtle grid pattern on dark bg */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="mission-content max-w-[860px] mx-auto text-center">

          {/* Chrome logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/wordmark.png"
              alt="Applytics"
              width={48}
              height={48}
              className="h-12 w-auto object-contain opacity-80"
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
            <span style={{ color: 'var(--brand-red)', fontWeight: 600 }}>get more responses.</span>
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
                Turning applications into interviews for Pakistan&apos;s job seekers.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
                Vision
              </p>
              <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                To become Pakistan&apos;s leading career support platform and help millions of people
                connect with meaningful career opportunities over the next 10 years.
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
