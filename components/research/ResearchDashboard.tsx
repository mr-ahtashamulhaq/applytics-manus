'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react'

gsap.registerPlugin(ScrollTrigger)

// ─── DATA ────────────────────────────────────────────────────────────────────

const HERO_STATS = [
  { value: '52', label: 'Students Surveyed' },
  { value: '71%', label: 'Rated Platform Highly Useful' },
  { value: '45%', label: 'Never Track Applications' },
  { value: '61%', label: 'Rarely Get Responses' },
]

const STATUS_DATA = [
  { label: 'Student', value: 44, pct: 85, primary: true },
  { label: 'Fresh Graduate', value: 6, pct: 12 },
  { label: 'Other', value: 2, pct: 4 },
]

const FIELD_DATA = [
  { label: 'Computer Science / IT', value: 34, pct: 65, primary: true },
  { label: 'Medical / Health', value: 7, pct: 13 },
  { label: 'Business / Management', value: 4, pct: 8 },
  { label: 'Engineering', value: 3, pct: 6 },
  { label: 'Arts / Humanities', value: 3, pct: 6 },
  { label: 'Other', value: 1, pct: 2 },
]

const DISCOVERY_DATA = [
  { label: 'LinkedIn', value: 36, pct: 71, primary: true },
  { label: 'Job Portals (Rozee, Indeed)', value: 7, pct: 14 },
  { label: 'WhatsApp Groups', value: 5, pct: 10 },
  { label: 'Facebook Groups', value: 2, pct: 4 },
  { label: 'Other', value: 1, pct: 2 },
]

const TIME_DATA = [
  { label: 'Less than 15 min', value: 14, pct: 27 },
  { label: '15 – 30 minutes', value: 20, pct: 39, primary: true },
  { label: '30 – 60 minutes', value: 13, pct: 25 },
  { label: 'More than 1 hour', value: 4, pct: 8 },
]

const TRACKING_DATA = [
  { label: 'Do not track at all', value: 23, pct: 45, primary: true },
  { label: 'Notes app / Notebook', value: 16, pct: 31 },
  { label: 'Excel / Google Sheets', value: 8, pct: 16 },
  { label: 'Memory only', value: 4, pct: 8 },
]

const RESPONSE_DATA = [
  { label: 'Very Rarely', value: 31, pct: 61, primary: true },
  { label: 'Occasionally', value: 16, pct: 31 },
  { label: 'Frequently', value: 3, pct: 6 },
]

const USEFULNESS_RATINGS = [
  { label: '1 - Not at all', value: 1, pct: 2 },
  { label: '2 - Not useful', value: 2, pct: 4 },
  { label: '3 - Neutral', value: 11, pct: 22 },
  { label: '4 - Useful', value: 16, pct: 31 },
  { label: '5 - Very useful', value: 21, pct: 41, primary: true },
]

const LIKELIHOOD_DATA = [
  { label: 'Very Likely', value: 37, pct: 71, primary: true },
  { label: 'Somewhat Likely', value: 12, pct: 23 },
  { label: 'Maybe / Not Likely', value: 3, pct: 6 },
]

const FEATURES_DATA = [
  { label: 'Job Recommendations', value: 25, pct: 48, primary: true },
  { label: 'Resume Customization', value: 13, pct: 25 },
  { label: 'Application Tracking', value: 7, pct: 13 },
  { label: 'Faster Applying', value: 7, pct: 13 },
]

const FREE_DATA = [
  { label: 'Yes', value: 34, pct: 65, primary: true },
  { label: 'No', value: 12, pct: 23 },
  { label: 'Maybe', value: 6, pct: 12 },
]

const PAY_DATA = [
  { label: 'Yes', value: 21, pct: 40, primary: true },
  { label: 'Maybe', value: 24, pct: 46 },
  { label: 'No', value: 7, pct: 13 },
]

const PRICE_DATA = [
  { label: 'Rs 200 – 500 / month', value: 16, pct: 35, primary: false },
  { label: 'Rs 500 – 1,000 / month', value: 16, pct: 35, primary: false },
  { label: 'Rs 1,000+ / month', value: 14, pct: 30, primary: true },
]

const CHALLENGE_DATA = [
  { label: 'Hard to find relevant jobs', value: 22, pct: 42, primary: true },
  { label: 'Low response rate', value: 12, pct: 23 },
  { label: 'Resume takes too long to edit', value: 10, pct: 19 },
  { label: 'Application process is repetitive', value: 7, pct: 13 },
  { label: 'Do not know how to improve', value: 1, pct: 2 },
]

const INSIGHTS = [
  {
    number: '01',
    headline: '7 in 10 students never see all available opportunities.',
    body: '71% of respondents rely exclusively on LinkedIn, completely missing jobs posted on WhatsApp groups, Facebook communities, job portals, and company websites. The opportunity gap is structural, not personal.',
  },
  {
    number: '02',
    headline: '45% of students track nothing.',
    body: 'Nearly half of all respondents do not track their applications in any way - not even a Notes app. They are managing a critical life decision entirely from memory. This is the core problem the Applytics Tracker solves.',
  },
  {
    number: '03',
    headline: '71% would be very likely to use Applytics.',
    body: 'Before a single feature was built, 37 out of 52 surveyed students said they would be "very likely" to try the platform. This is product-market fit signal at the research stage.',
  },
  {
    number: '04',
    headline: '86% are open to paying for premium features.',
    body: '40% said yes and 46% said maybe when asked if they would pay for advanced features. Among those willing to pay, the most common price range is Rs 500-1,000 per month - a signal that the Pro plan is positioned correctly.',
  },
]

// ─── CHART COMPONENTS ────────────────────────────────────────────────────────

interface HBarRowProps {
  label: string
  value: number
  pct: number
  maxPct?: number
  primary?: boolean
  animate?: boolean
  index?: number
}

function HBarRow({ label, pct, maxPct = 100, primary = false, index = 0 }: HBarRowProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.65,
        delay: index * 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: barRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    )
  }, [index])

  const fillWidth = `${(pct / maxPct) * 100}%`

  return (
    <div className="flex items-center gap-4 py-2.5" style={{ borderBottom: '1px solid var(--hairline)' }}>
      <span
        className="text-sm shrink-0"
        style={{
          color: 'var(--charcoal)',
          width: 'clamp(160px, 30%, 220px)',
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
      <div className="flex-1 flex items-center gap-3">
        <div
          className="relative flex-1 overflow-hidden"
          style={{ height: '22px', background: 'var(--surface)', borderRadius: '2px' }}
        >
          <div
            ref={barRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: fillWidth,
              background: primary ? 'var(--brand-red)' : 'var(--hairline-strong)',
              borderRadius: '2px',
              transformOrigin: 'left center',
            }}
          />
        </div>
        <span
          className="text-sm font-bold shrink-0"
          style={{
            color: primary ? 'var(--brand-red)' : 'var(--steel)',
            fontFamily: 'var(--font-geist-mono)',
            width: '40px',
            textAlign: 'right',
          }}
        >
          {pct}%
        </span>
      </div>
    </div>
  )
}

interface DonutChartProps {
  data: { label: string; pct: number; primary?: boolean }[]
}

function DonutChart({ data }: DonutChartProps) {
  const size = 140
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  let currentOffset = 0

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {data.map((d, i) => {
            const dasharray = (d.pct / 100) * circumference
            const dashoffset = -currentOffset
            currentOffset += dasharray
            const color = d.primary ? 'var(--brand-red)' : i === 1 ? 'var(--steel)' : 'var(--hairline-strong)'
            return (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dasharray} ${circumference}`}
                strokeDashoffset={dashoffset}
                className="donut-segment transition-all duration-1000 ease-out"
              />
            )
          })}
        </svg>
      </div>
      <div className="flex flex-col gap-3 flex-1 w-full">
        {data.map((d, i) => {
          const color = d.primary ? 'var(--brand-red)' : i === 1 ? 'var(--steel)' : 'var(--hairline-strong)'
          return (
            <div key={d.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-sm" style={{ color: 'var(--charcoal)' }}>{d.label}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--ink)', fontFamily: 'var(--font-geist-mono)' }}>{d.pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface VBarColProps {
  label: string
  pct: number
  maxPct: number
  primary?: boolean
  index?: number
}

function VBarCol({ label, pct, maxPct, primary = false, index = 0 }: VBarColProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return
    gsap.fromTo(
      barRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.55,
        delay: index * 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: barRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    )
  }, [index])

  const heightPct = Math.round((pct / maxPct) * 100)

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <span
        className="text-xs font-bold"
        style={{ color: primary ? 'var(--brand-red)' : 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}
      >
        {pct}%
      </span>
      <div className="w-full flex items-end" style={{ height: '120px' }}>
        <div
          ref={barRef}
          style={{
            width: '100%',
            height: `${heightPct}%`,
            background: primary ? 'var(--brand-red)' : 'var(--hairline-strong)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>
      <span
        className="text-xs text-center"
        style={{ color: 'var(--charcoal)', lineHeight: 1.3, maxWidth: '72px' }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── SECTION LABEL ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <span
        className="text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
        style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--hairline-strong)' }} />
    </div>
  )
}

// ─── CHART CARD ──────────────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  children,
  finding,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  finding?: string
}) {
  return (
    <div
      className="chart-card flex flex-col gap-5 p-7"
      style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}
    >
      <div>
        <h3
          className="text-base font-semibold mb-1"
          style={{ color: 'var(--ink-deep)', letterSpacing: '-0.2px' }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs" style={{ color: 'var(--stone)', fontFamily: 'var(--font-geist-mono)' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div>{children}</div>
      {finding && (
        <div
          className="mt-2 px-4 py-3"
          style={{ background: 'var(--brand-red-subtle)', borderLeft: '3px solid var(--brand-red)' }}
        >
          <p className="text-xs font-medium" style={{ color: 'var(--brand-red-deep)', lineHeight: 1.5 }}>
            {finding}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function ResearchDashboard() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.chart-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.charts-area',
            start: 'top 80%',
            once: true,
          },
        }
      )
      gsap.fromTo(
        '.insight-card',
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.insights-grid',
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} style={{ paddingTop: '64px' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--brand-black)', padding: 'clamp(64px, 8vw, 96px) 0 0' }}>
        <div className="max-w-[1280px] mx-auto px-6">

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium mb-10 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-geist-mono)' }}
          >
            <ArrowLeft size={12} />
            Back to Applytics
          </Link>

          {/* Label */}
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}
          >
            Market Research
          </p>

          {/* Headline */}
          <h1
            className="text-4xl lg:text-6xl font-bold mb-6"
            style={{
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-2px',
              lineHeight: 1.05,
              maxWidth: '820px',
            }}
          >
            What students told us about job searching in Pakistan.
          </h1>

          <p
            className="text-base lg:text-lg mb-12"
            style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: '560px' }}
          >
            Before building Applytics, we surveyed 52 students and fresh graduates to validate
            the problem. This is what we found.
          </p>

          {/* Methodology note */}
          <div
            className="flex flex-wrap items-center gap-6 pb-8"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            {[
              ['Method', 'Google Form Survey'],
              ['Period', 'April 2026'],
              ['Responses', '52 valid entries'],
              ['Location', 'Pakistan (primarily Lahore)'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-geist-mono)' }}>{k}</span>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Hero stat strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {HERO_STATS.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col py-8 pr-8"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
              >
                <span
                  className="text-4xl lg:text-5xl font-bold mb-2"
                  style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'var(--font-geist-mono)', letterSpacing: '-1.5px' }}
                >
                  {s.value}
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-geist-mono)', lineHeight: 1.4 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARTS CONTENT ───────────────────────────────────────── */}
      <div
        className="charts-area max-w-[1280px] mx-auto px-6"
        style={{ padding: 'clamp(72px, 8vw, 112px) clamp(16px, 4vw, 24px)' }}
      >

        {/* ── SECTION 1: About the Survey ─────────────────────── */}
        <div className="mb-20">
          <SectionLabel>About the Survey</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ border: '1px solid var(--hairline)' }}>
            <ChartCard
              title="Who We Surveyed"
              subtitle="Respondent status breakdown"
              finding="85% of respondents are currently enrolled students - the primary target user for Applytics."
            >
              <DonutChart data={STATUS_DATA} />
            </ChartCard>
            <div style={{ borderLeft: '1px solid var(--hairline)' }}>
              <ChartCard
                title="Field of Study"
                subtitle="Academic background"
                finding="65% are from CS/IT, but 35% come from other disciplines, confirming the platform must work beyond technical fields."
              >
                {FIELD_DATA.map((d, i) => (
                  <HBarRow key={d.label} {...d} index={i} />
                ))}
              </ChartCard>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: The Discovery Problem ────────────────── */}
        <div className="mb-20">
          <SectionLabel>The Discovery Problem</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ border: '1px solid var(--hairline)' }}>
            <ChartCard
              title="Where Students Find Job Opportunities"
              subtitle="Primary platform used for job discovery"
              finding="71% rely on LinkedIn alone - meaning most students are missing jobs posted on WhatsApp groups, Facebook communities, Rozee.pk, Indeed, and company career pages."
            >
              {DISCOVERY_DATA.map((d, i) => (
                <HBarRow key={d.label} {...d} index={i} />
              ))}
            </ChartCard>
            <div style={{ borderLeft: '1px solid var(--hairline)' }}>
              <ChartCard
                title="Time Spent Per Application"
                subtitle="How long each application takes"
                finding="64% of students spend 15 minutes or more per application. For someone sending 5-10 applications per week, that is 1.5 to 5 hours of repetitive manual work every week."
              >
                {TIME_DATA.map((d, i) => (
                  <HBarRow key={d.label} {...d} maxPct={50} index={i} />
                ))}
              </ChartCard>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: The Tracking Crisis ──────────────────── */}
        <div className="mb-20">
          <SectionLabel>The Tracking Crisis</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ border: '1px solid var(--hairline)' }}>
            <ChartCard
              title="How Students Track Their Applications"
              subtitle="Current application tracking method"
              finding="45% of students track nothing at all. 31% use a notes app. Only 16% use any kind of structured tracking like a spreadsheet. This is why they cannot improve their process - there is no data."
            >
              {TRACKING_DATA.map((d, i) => (
                <HBarRow key={d.label} {...d} index={i} />
              ))}
            </ChartCard>
            <div style={{ borderLeft: '1px solid var(--hairline)' }}>
              <ChartCard
                title="How Often Students Receive Responses"
                subtitle="Frequency of recruiter responses or interview calls"
                finding="61% of students receive responses 'very rarely' - meaning the current approach of sending the same resume to every job is not working. This is the direct result of no tailoring and no strategy."
              >
                {RESPONSE_DATA.map((d, i) => (
                  <HBarRow key={d.label} {...d} maxPct={75} index={i} />
                ))}
              </ChartCard>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Product Validation ───────────────────── */}
        <div className="mb-20">
          <SectionLabel>Product Validation</SectionLabel>

          {/* Usefulness rating — vertical bar chart */}
          <div style={{ border: '1px solid var(--hairline)' }} className="mb-0">
            <ChartCard
              title="How Useful Would Applytics Be? (Rated 1-5)"
              subtitle="Students rated the platform concept before using it"
              finding="71% of students rated the platform 4 or 5 out of 5 for usefulness - before a single line of code was written. This is the clearest signal of product-market fit."
            >
              <div className="flex items-end gap-3 mt-2" style={{ height: '180px' }}>
                {USEFULNESS_RATINGS.map((d, i) => (
                  <VBarCol
                    key={d.label}
                    label={d.label}
                    pct={d.pct}
                    maxPct={50}
                    primary={d.primary}
                    index={i}
                  />
                ))}
              </div>
            </ChartCard>
          </div>

          {/* Likelihood + Features side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ border: '1px solid var(--hairline)', borderTop: 'none' }}>
            <ChartCard
              title="Likelihood to Try Applytics"
              subtitle="Self-reported intent"
              finding="71% said 'Very Likely' - meaning strong pull demand before any marketing."
            >
              {LIKELIHOOD_DATA.map((d, i) => (
                <HBarRow key={d.label} {...d} maxPct={80} index={i} />
              ))}
            </ChartCard>
            <div style={{ borderLeft: '1px solid var(--hairline)' }}>
              <ChartCard
                title="Most Valuable Feature"
                subtitle="What students want most from the platform"
                finding="Job recommendations (aggregated discovery) was the #1 most-wanted feature - validating the Discover pillar as the highest-impact next build."
              >
                {FEATURES_DATA.map((d, i) => (
                  <HBarRow key={d.label} {...d} maxPct={60} index={i} />
                ))}
              </ChartCard>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Monetization ──────────────────────────── */}
        <div className="mb-20">
          <SectionLabel>Monetization Signal</SectionLabel>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0" style={{ border: '1px solid var(--hairline)' }}>
            <ChartCard title="Would Use Free Version" subtitle="Self-reported">
              <DonutChart data={FREE_DATA} />
            </ChartCard>
            <div style={{ borderLeft: '1px solid var(--hairline)' }}>
              <ChartCard
                title="Would Pay for Advanced Features"
                subtitle="Willingness to pay"
                finding="86% said yes or maybe - strong signal for a freemium model."
              >
                <DonutChart data={PAY_DATA} />
              </ChartCard>
            </div>
            <div style={{ borderLeft: '1px solid var(--hairline)' }}>
              <ChartCard
                title="Acceptable Price Range / Month"
                subtitle="Among those willing to pay (n=46)"
              >
                {PRICE_DATA.map((d, i) => (
                  <HBarRow key={d.label} {...d} maxPct={50} index={i} />
                ))}
              </ChartCard>
            </div>
          </div>
        </div>

        {/* ── SECTION 6: Top Challenges ────────────────────────── */}
        <div className="mb-20">
          <SectionLabel>Top Challenges Students Face</SectionLabel>
          <div style={{ border: '1px solid var(--hairline)' }}>
            <ChartCard
              title="Biggest Challenges When Applying for Jobs"
              subtitle="What students struggle with most"
              finding="'Hard to find relevant jobs' is the #1 challenge - reported by 42% of students. This is the problem that Applytics Discover (coming soon) directly addresses."
            >
              {CHALLENGE_DATA.map((d, i) => (
                <HBarRow key={d.label} {...d} maxPct={50} index={i} />
              ))}
            </ChartCard>
          </div>
        </div>

        {/* ── KEY INSIGHTS ─────────────────────────────────────── */}
        <div className="mb-16">
          <SectionLabel>Key Insights</SectionLabel>
          <div className="insights-grid grid grid-cols-1 lg:grid-cols-2 gap-0" style={{ border: '1px solid var(--hairline)' }}>
            {INSIGHTS.map((insight, i) => {
              const col = i % 2
              const row = Math.floor(i / 2)
              return (
                <div
                  key={insight.number}
                  className="insight-card p-8"
                  style={{
                    borderRight: col === 0 ? '1px solid var(--hairline)' : 'none',
                    borderBottom: row === 0 ? '1px solid var(--hairline)' : 'none',
                  }}
                >
                  <span
                    className="text-4xl font-bold block mb-4"
                    style={{ color: 'var(--hairline-strong)', fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {insight.number}
                  </span>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: 'var(--ink-deep)', letterSpacing: '-0.25px', lineHeight: 1.3 }}
                  >
                    {insight.headline}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)', lineHeight: 1.65 }}>
                    {insight.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
              Start Using Applytics
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--ink-deep)', letterSpacing: '-0.25px' }}>
              The problem is validated. The product is live. It is free to start.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold shrink-0 transition-all"
            style={{
              background: 'var(--brand-red)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--brand-red-deep)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--brand-red)' }}
          >
            Get started free
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  )
}
