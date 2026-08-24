'use client'

import Link from 'next/link'
import { CheckCircle, Circle } from '@phosphor-icons/react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    priceNote: 'forever',
    description: 'Everything you need to start your job search.',
    featured: false,
    features: [
      '5 resume tailors per month',
      'ATS match score analysis',
      'PDF download',
      'Application tracker (up to 10)',
      'Email support',
    ],
    cta: 'Start free',
    ctaHref: '/sign-up',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'PKR 999',
    priceNote: '/month',
    description: 'For active job seekers applying every week.',
    featured: true,
    badge: 'Most Popular',
    features: [
      'Unlimited resume tailors',
      'ATS match score analysis',
      'PDF download',
      'Unlimited application tracking',
      'Priority support',
      'Cover letter generator (soon)',
      'LinkedIn optimization (soon)',
    ],
    cta: 'Join waitlist',
    ctaHref: 'mailto:hello@applytics.online?subject=Applytics Pro Waitlist',
    disabled: false,
  },
  {
    id: 'campus',
    name: 'Campus',
    price: 'Custom',
    priceNote: 'per cohort',
    description: 'For universities, bootcamps, and career centers.',
    featured: false,
    features: [
      'Everything in Pro',
      'Bulk student accounts',
      'Analytics dashboard',
      'Dedicated onboarding',
      'Custom SLA',
      'API access',
    ],
    cta: 'Contact us',
    ctaHref: 'mailto:hello@applytics.online',
  },
]

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="w-full"
      style={{ background: 'var(--canvas)', padding: 'clamp(64px, 8vw, 120px) 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}>
            Pricing
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
        </div>

        {/* Section header */}
        <div className="mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--ink-deep)', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Simple, transparent pricing
          </h2>
          <p className="text-lg" style={{ color: 'var(--slate)', maxWidth: '480px' }}>
            Start free. Upgrade when you need more. No credit card required to begin.
          </p>
        </div>

        {/* Cards grid — 3-col, sharp edges (0px radius per DESIGN.md) */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ border: '1px solid var(--brand-black)' }}
        >
          {PLANS.map((plan, i) => (
            <div
              key={plan.id}
              className="flex flex-col"
              style={{
                background: plan.featured ? 'var(--brand-black)' : 'var(--canvas)',
                borderRight: i < PLANS.length - 1 ? '1px solid var(--brand-black)' : 'none',
                borderRadius: 0,
                padding: plan.featured ? '52px 40px' : '36px 40px',
                position: 'relative',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-widest mb-5 self-start"
                  style={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'var(--on-dark)',
                    borderRadius: 0,
                    fontFamily: 'var(--font-geist-mono)',
                  }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: plan.featured ? 'var(--on-dark)' : 'var(--ink-deep)', letterSpacing: '-0.25px' }}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-3">
                <span
                  className="text-4xl font-bold"
                  style={{ color: plan.featured ? 'var(--on-dark)' : 'var(--ink-deep)', fontFamily: 'var(--font-geist-mono)', letterSpacing: '-1px' }}
                >
                  {plan.price}
                </span>
                <span className="text-sm" style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : 'var(--stone)' }}>
                  {plan.priceNote}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm mb-6" style={{ color: plan.featured ? 'rgba(255,255,255,0.65)' : 'var(--slate)' }}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 flex-1 mb-8">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-start gap-2.5">
                    {plan.featured
                      ? <CheckCircle size={14} weight="fill" style={{ color: 'var(--brand-red)', flexShrink: 0, marginTop: 2 }} />
                      : <Circle size={14} style={{ color: 'var(--hairline-strong)', flexShrink: 0, marginTop: 2 }} />
                    }
                    <span className="text-sm" style={{ color: plan.featured ? 'rgba(255,255,255,0.85)' : 'var(--charcoal)' }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                aria-disabled={plan.disabled}
                className="flex items-center justify-center px-6 h-12 text-sm font-semibold uppercase tracking-wider transition-all"
                style={{
                  borderRadius: 0,
                  background: plan.featured ? 'var(--on-dark)' : 'var(--brand-black)',
                  color: plan.featured ? 'var(--brand-black)' : 'var(--on-dark)',
                  opacity: plan.disabled ? 0.45 : 1,
                  cursor: plan.disabled ? 'not-allowed' : 'pointer',
                  letterSpacing: '1px',
                  pointerEvents: plan.disabled ? 'none' : 'auto',
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs" style={{ color: 'var(--stone)', fontFamily: 'var(--font-geist-mono)' }}>
          All plans include ATS match score analysis and PDF export. No credit card required to start.
        </p>
      </div>
    </section>
  )
}
